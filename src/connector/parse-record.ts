import { executeCommand, executeCommandInTransaction, startTransaction } from "../graph/dbconn"
import { readFileSync, createReadStream } from "fs"
import { createInterface } from "readline"
import { fileURLToPath } from "url"
import { notDeepEqual } from "assert"
import { Session, Transaction } from "neo4j-driver"
// import { lineByLine } from 'n-readlines'

const REPORT_FILE_PATH = './res/2022-08-04-dolittle-export-filtered-instances.ndjson'
var trans: Transaction
var transSession: Session 

function cleanId (fullId:string) : string{
    return fullId.split(':')[1]
}

async function parseCustomer(entry:any){
    const CREATE_CUSTOMER = `
        CREATE (c:Customer {name:$name, id:$id, uid:$uid})
    `
    return executeCommandInTransaction(trans,CREATE_CUSTOMER, {
        ...entry.properties,
        uid: entry.uid
    })
}

async function parseApplication(entry: any){
    const CREATE_APPLICATION = `
        MATCH (c:Customer {uid: $cid})
        MERGE (a:Application {id: $id, name: $name, uid: $uid}) -[:OwnedBy]-> (c)
    `
    return executeCommandInTransaction(trans, CREATE_APPLICATION, {
        ...entry.properties,
        cid: entry.links.ownedBy,
        uid: entry.uid
    })
}

async function parseEnvironment(entry: any){
    const CREATE_ENV = `
        MATCH (a:Application {uid: $aid})
        CREATE (e:Environment {uid: $uid, name: $name}) -[:EnvironmentOf]-> (a)
    `
    return executeCommandInTransaction(trans, CREATE_ENV, {
        ...entry.properties,
        aid: entry.links.environmentOf,
        uid: entry.uid
    })
}

async function parseArtifact(entry: any){
    const CREATE_ART = `
        MATCH (c:Customer {uid: $cid})
        MERGE (a:Artifact {uid: $uid, id: $id, name: $name}) -[:DevelopedBy]-> (c)
    `
    return executeCommandInTransaction(trans, CREATE_ART, {
        ...entry.properties,
        cid: entry.links.developedBy,
        uid: entry.uid,
        name: entry.properties.id.split('-')[0]
    })
}

async function parseArtifactVersion(entry: any){
    const CREATE_ART_V = `
        MATCH (o {uid: $oid})
        MERGE (a:ArtifactVersion {uid: $uid, name:$name}) -[:VersionOf]-> (o)
    `
    return executeCommandInTransaction(trans, CREATE_ART_V, {
        ...entry.properties,
        oid: entry.links.versionOf,
        uid: entry.uid
    })
}

async function parseRuntimeVersion(entry: any){
    const CREATE_RT_V = `
        CREATE (v:RuntimeVersion {uid: $uid, name:$uid, major:$major, minor:$minor, patch:$patch})
    `
    return executeCommandInTransaction(trans, CREATE_RT_V, {
        ...entry.properties,
        uid: entry.uid
    })
}

async function parseDeployment(entry: any){
    const CREATE_RT_V = `
        MATCH (av {uid:$usesArtifact})
        MATCH (rv {uid:$usesRuntime})
        MATCH (e {uid:$deployedIn})
        MERGE (d:Deployment {name:$id, uid: $uid, id:$id, created: datetime($created)})-[:DeployedIn]->(e) 
        MERGE (d)-[:UsesArtifact]->(av)
        MERGE (d)-[:UsesRuntime]->(rv)
    `
    return executeCommandInTransaction(trans, CREATE_RT_V, {
        ...entry.properties,
        ...entry.links,
        uid: entry.uid
    })
}

async function parseArtifactConfiguration(entry: any){
    const CREATE_AC = `
        CREATE (v:ArtifactConfiguration {uid: $uid, hash:$hash})
    `
    return executeCommandInTransaction(trans, CREATE_AC, {
        ...entry.properties,
        uid: entry.uid
    })
}

async function parseRuntimeConfiguration(entry: any){
    const CREATE_RC = `
        CREATE (v:RuntimeConfiguration {uid: $uid, hash:$hash})
    `
    return executeCommandInTransaction(trans, CREATE_RC, {
        ...entry.properties,
        uid: entry.uid
    })
}


async function parseDeploymentInstance(entry: any){
    const CREATE_DEPLOY_INSTANCE = `
        MATCH (d {uid:$instanceOf})
        MATCH (ac {uid:$usesArtifactConfiguration})
        MATCH (rc {uid:$usesRuntimeConfiguration})
        MERGE (di:DeploymentInstance {name:$id, uid: $uid, id:$id, started: datetime($started)})-[:InstanceOf]->(d) 
        MERGE (di)-[:UsesArtifactConfiguration]->(ac)
        MERGE (di)-[:UsesRuntimeConfiguration]->(rc)
    `
    return executeCommandInTransaction(trans, CREATE_DEPLOY_INSTANCE, {
        ...entry.properties,
        ...entry.links,
        uid: entry.uid
    })
}

export async function parseEntry(entry:{type:string}){
    switch(entry.type){
        case "Customer": return parseCustomer(entry)
        case "Application": return parseApplication(entry)
        case "Environment": return parseEnvironment(entry)
        case "Artifact": return parseArtifact(entry)
        case "ArtifactVersion": return parseArtifactVersion(entry)
        case "RuntimeVersion": return parseRuntimeVersion(entry)
        case "Deployment": return parseDeployment(entry)
        case "ArtifactConfiguration": return parseArtifactConfiguration(entry)
        case "RuntimeConfiguration": return parseRuntimeConfiguration(entry)
        case "DeploymentInstance": return parseDeploymentInstance(entry)
        default: return
    }
}


export async function importReportFile(){
    const content = createReadStream(REPORT_FILE_PATH)
    const reader = createInterface(content)
    let results: Promise<any>[] = []

    let transPair = startTransaction()
    transSession = transPair.session
    trans = transPair.trans

    reader.on("line", async (l: string)=>{
        let entry = JSON.parse(l)
        await Promise.all(results)
        results.push(parseEntry(entry))        
    })

    reader.on('close', async ()=>{
        // console.log('All records are read')
        let finalResults = await Promise.all(results)
        await trans.commit()
        
        transSession.close()
        // console.log(finalResults[26])
        let filteredResults = finalResults.filter(i => typeof(i) == 'object' && '_stats' in i)
        
        let nodesCreated = filteredResults.reduce((accumulator, i)=>{return accumulator + i['_stats']['nodesCreated']}, 0)
        let relationshipsCreated = filteredResults.reduce((accumulator, i)=>{return accumulator + i['_stats']['relationshipsCreated']}, 0)
        console.log(`${nodesCreated} nodes and ${relationshipsCreated} relationships created`)

        // let index = 0
        // finalResults.forEach(i => {
        //     if(index > 1200) return
        //     if (typeof(i) != 'object' || !('_stats' in i ) || i['_stats']['nodesCreated']==0){
        //         console.log(i)
        //         console.log(index)
        //         index = index + 1000
        //     }
        //     index = index + 1
        // })
        return {nodesCreated:nodesCreated, relationshipCreated:relationshipsCreated}
    })
    return {nodesCreated:0, relationshipsCreated:0} //This is wrong. Always return 0.0
    // const results = lines.map(e => parseLine(JSON.parse(e)))
}

export async function importReportFileNoReturn(){
    let result = await importReportFile()
    // console.log(`${result.nodesCreated} nodes and ${result.relationshipsCreated} relationships created`)

}

