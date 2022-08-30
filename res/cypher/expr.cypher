
# check artefact configurations with same hash: one has with 27 configs, one has 2, and all the others have 1.
match(r:ArtifactConfiguration) 
    with r.hash as hash, collect(r) as rs 
    return hash, size(rs) 
    order by size(rs)

match(c:Customer)--(a:Application) 
    with c as cc, collect(a) as aa 
    return cc.name, size(aa) 
    order by size(aa)

match (d:Deployment)--(di:DeploymentInstance) 
    with d as deployment, collect(di.started) as instances 
    return deployment.created, instances

MATCH (a: Artifact)--(:ArtifactVersion)--(d:Deployment)--(i:DeploymentInstance), (d)--(env:Environment) 
    with a as artifact, env.name as environment, collect(i.started) as started 
    return artifact, environment, started 
    order by artifact.id

    


"relationshipQuery": "Match (a:Application)--(:Environment)--(:Deployment)-[r]-(di:DeploymentInstance) return id(di) as source, id(a) as target, type(r) as type",
  "jobId": "157b2548-4489-44a1-8c03-9c21479b81af",
  "creationTime": "2022-08-25T12:20:31.550537000[Etc/UTC]",
  "validateRelationships": true,
  "nodeQuery": "MATCH (n) where n:Application or n:DeploymentInstance return id(n) as id, labels(n) as labels",