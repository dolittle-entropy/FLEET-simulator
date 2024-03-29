create (company1:Customer {
    name:'SomeCompany', 
    type:'sme'
    })
create (dolittle:Developer {name:'Dolittle', type:'sme'})
create (company2:Developer {name:'AnotherCompany', type:'le'})
create (app1:Application {
    name:'appname'
    })-[:ownedBy]->(company1)

create (env1:Environment {
    name: 'envname'
})-[:App]->(app1)

create (ms1:Artefact {
        name:'FirstArtefact',
        id:'artefactid', 
    })-[:DevelopedBy]->(company1)


create (ms2:Artefact {name:'SecondArtefact'})-[:DevelopedBy]->(company1)
create (ms3:Artefact {name:'ThirdArtefact'})-[:DevelopedBy]->(company2)
create (mongo:Artefact {name:'MongoDB'})-[:DevelopedBy]->(:Developer {name:'MongoDB Inc', size:'opensource'})
create (runtime:DolittleRuntime {
        name:'DolittleRuntime'
    })-[:DevelopedBy]->(dolittle)
create (ms1v1:Version {
        name:'1.0', 
        released:date('2021-01-01')
    })-[:VersionOf]->(ms1)
create (ms1v2:Version {label:'1.1', released:date('2021-02-01')})-[:VersionOf]->(ms1)
create (ms1v3:Version {label:'1.2', released:date('2021-06-03')})-[:VersionOf]->(ms1)
create (ms2v1:Version {label:'1.0', released:date('2021-01-05')})-[:VersionOf]->(ms2)
create (ms3v1:Version {label:'1.0', released:date('2021-01-07')})-[:VersionOf]->(ms3)
create (ms3v2:Version {label:'2.0', released:date('2021-07-01')})-[:VersionOf]->(ms3)
create (drv1:Version {
        label:'1.0',
        major:'1',
        minor:'2',
        patch:'0', 
        prerelease:'name',
        released:date('2021-01-01')}
    )-[:VersionOf]->(runtime)
create (drv2:Version {label:'2.0', released:date('2021-02-01')})-[:VersionOf]->(runtime)
create (drv3:Version {label:'3.0', released:date('2021-03-01')})-[:VersionOf]->(runtime)
create (drv4:Version {label:'4.0', released:date('2021-05-01')})-[:VersionOf]->(runtime)
create (drv5:Version {label:'5.0', released:date('2021-07-15')})-[:VersionOf]->(runtime)
create (mongo50:Version {label:'5.0', released:date('2021-07-13')})-[:VersionOf]->(mongo)
create (mongo44:Version {label:'4.4', released:date('2020-09-09')})-[:VersionOf]->(mongo)
create (rconf1:RuntimeConfig {
    version:'string',
    hash:'string',
})
create (aconf1:ArtefactConfig {
    version:'string',
    hash:'string'
})
create (ms1v1)<-[:ArtefactVersion]-(d1:Deployment {
        number:1, 
        created:date('2021-01-02'), 
        retired:date('2021-02-03'),
        admin: 'alice'
    })-[:RuntimeVersion]->(drv1)
create (d1)-[:DeployedIn]->(env1)
create (di1:DeploymentInstance{
    id: 'pod-id',
    started:date('2021-01-02'),
    stoped:date('2021-01-03')
})-[:InstanceOf]->(d1)
create (aconf1)<-[:ArtefactConfig]-(di1)-[:RuntimeConfig]->(rconf1)
create (ms1v1)<-[:ArtefactVersion]-(d2:Deployment {number:2, created:date('2021-02-01'), retired:date('2021-02-08')})-[:RuntimeVersion]->(drv2)
create (d2)-[:succeeds]->(d1)
create (ms1v2)<-[:ArtefactVersion]-(d3:Deployment {number:3, created:date('2021-02-08')})-[:RuntimeVersion]->(drv2)
create (ms2v1)<-[:ArtefactVersion]-(d4:Deployment {number:4, created:date('2021-02-05')})-[:RuntimeVersion]->(drv2)
create (ms3v1)<-[:ArtefactVersion]-(d5:Deployment {number:5, created:date('2021-02-05'), retired:date('2021-08-05')})-[:RuntimeVersion]->(drv2)
create (mongo44)<-[:ArtefactVersion]-(d5)
create (ms3v2)<-[:ArtefactVersion]-(d6:Deployment {number:6, created:date('2021-08-05')})-[:RuntimeVersion]->(drv4)
create (mongo44)<-[:ArtefactVersion]-(d6)
create (ms1v3)<-[:ArtefactVersion]-(sd1:StagingDeployment {number:1, created:date('2021-08-08'), retired:date('2021-08-10')})-[:RuntimeVersion]->(drv5)
create (iss1:Issue {
        type:'Crashed', 
        time:date('2021-02-08'), 
        cause:'API mismatch'
    })-[:HappenedTo]->(di1)
create (iss2:Issue {type:'Slow', time:date('2021-02-11')})-[:HappenedTo]->(d4)
create (iss3:Issue {type:'Slow', time:date('2021-02-14')})-[:HappenedTo]->(d4)
create (iss4:Issue {type:'Broken', time:date('2021-08-08')})-[:HappenedTo]->(d6)
create (iss5:Issue {type:'Slow', time:date('2021-08-09')})-[:HappenedTo]->(d3)
create (iss6:Issue {type:'Slow', time:date('2021-01-03')})-[:HappenedTo]->(d1)
create (iss7:Issue {type:'Broken', time:date('2021-08-08')})-[:HappenedTo]->(d6)
create (iss8:Issue {type:'Slow', time:date('2021-03-06')})-[:HappenedTo]->(d5)

