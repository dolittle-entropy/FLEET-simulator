import { executeCommand, executeQuery } from "./dbconn";

export async function newDeployment(dlversion:string, ...artefacts: {artefact:string, version:string}[]){
    let query = `
        match (:DolittleRuntime)--(dlv:Version {label: $dlv})
        match (:Artefact {name: $artefactName})--(v:Version {label: $artefactVersion})
        merge (dlv)<-[:RuntimeVersion]-(:Deployment {number: $dnumber, created: date($date)})-[:ArtefactVersion]->(v)
    `
    let result = await executeQuery("match (a:Deployment) return count(a) as n");
    let total = result[0].n.low
    let mergeResult = await executeCommand(
        query,
        {
            artefactName: artefacts[0].artefact,
            artefactVersion: artefacts[0].version,
            dnumber: total,
            date: "2022-05-06",
            dlv: dlversion
        }
    )
    //console.log(result)
    return mergeResult
}

