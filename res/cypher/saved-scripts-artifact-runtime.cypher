// a artifact version used with different runtime version
match (a:ArtifactVersion)--(d:Deployment)--(r:RuntimeVersion)
match (d)--(e:Environment)
with a.name as artifact, e.name as env, collect(r.name) as runtime
return artifact, env , runtime
order by size(runtime) desc

// application uses runtime versions
match (a:Application)--(e:Environment)--(d:Deployment)--(r:RuntimeVersion)
with a.name as app, e.name as env, collect([r.name, d.created]) as runtime
return app, env, runtime
order by app

// artifact configuration with same hash
match(r:ArtifactConfiguration) 
    with r.hash as hash, collect(r) as rs 
    return hash, size(rs) 
    order by size(rs)
    

// Deplyment instance started # of days after deployment created
match (d:Deployment)--(i:DeploymentInstance)
with d.uid as deploy, collect(duration.inDays(i.started, d.created).days) as latest
return deploy, latest


// how long an artefact has been used
match (a:Artifact)--(:ArtifactVersion)--(:Deployment)--(i:DeploymentInstance)
with a.name as artifact, min(i.started) as firstStarted, max(i.started) as lastStarted
return artifact, duration.between(firstStarted, lastStarted)

// how long an artefact version has been used
match (a:ArtifactVersion)--(:Deployment)--(i:DeploymentInstance)
with a.name as artifact, min(i.started) as firstStarted, max(i.started) as lastStarted
return artifact, duration.between(firstStarted, lastStarted) as dura
order by dura desc

// Runtime version used
match (r:RuntimeVersion)--(d:Deployment)--(i:DeploymentInstance), (d)--(e:Environment)
with r.name as runtime, e.name as env, collect(i.started) as started
return runtime, env, started