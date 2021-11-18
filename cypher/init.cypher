create (company1:Developer {name:'SomeCompany', size:'sme'})
create (dolittle:Developer {name:'dolittle', size:'sme'})
create (company2:Developer {name:'AnotherCompany', size:'le'})
create (ms1:Artefact {name:'FirstArtefact'})-[:DevelopedBy]->(company1)
create (ms2:Artefact {name:'SecondArtefact'})-[:DevelopedBy]->(company1)
create (ms3:Artefact {name:'ThirdArtefact'})-[:DevelopedBy]->(company2)
create (runtime:DolittleRuntime)-[:DevelopedBy]->(dolittle)
create (ms1v1:Version {label:'1.0', released:date('2021-01-01')})-[:VersionOf]->(ms1)
create (ms1v2:Version {label:'1.1', released:date('2021-02-01')})-[:VersionOf]->(ms1)
create (ms1v3:Version {label:'1.2', released:date('2021-02-03')})-[:VersionOf]->(ms1)
create (ms2v1:Version {label:'1.0', released:date('2021-01-05')})-[:VersionOf]->(ms2)
create (ms3v1:Version {label:'1.0', released:date('2021-01-07')})-[:VersionOf]->(ms3)
create (ms3v2:Version {label:'2.0', released:date('2021-07-01')})-[:VersionOf]->(ms3)
create (drv1:Version {label:'1.0', released:date('2021-01-01')})-[:VersionOf]->(runtime)
create (drv2:Version {label:'2.0', released:date('2021-02-01')})-[:VersionOf]->(runtime)
create (drv3:Version {label:'3.0', released:date('2021-03-01')})-[:VersionOf]->(runtime)
create (drv4:Version {label:'4.0', released:date('2021-05-01')})-[:VersionOf]->(runtime)
create (drv5:Version {label:'5.0', released:date('2021-07-15')})-[:VersionOf]->(runtime)
create (ms1v1)<-[:AtefactVersion]-(d1:Deployment {number:1, created:date('2021-01-02'), retired:date('2021-02-03')})-[:RuntimeVersion]->(drv1)
create (ms1v1)<-[:AtefactVersion]-(d2:Deployment {number:2, created:date('2021-02-01'), retired:date('2021-02-08')})-[:RuntimeVersion]->(drv2)
create (ms1v2)<-[:AtefactVersion]-(d3:Deployment {number:3, created:date('2021-02-08')})-[:RuntimeVersion]->(drv2)
create (ms2v1)<-[:AtefactVersion]-(d4:Deployment {number:4, created:date('2021-02-05')})-[:RuntimeVersion]->(drv2)