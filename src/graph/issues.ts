import { executeQuery } from "./dbconn";

export async function getNearestIssues(artefact:string, version:string){
    let query = `
        match (aretefact:Artefact {name: $artefact})--(version:Version {label:$version})-[*2..2]-(issue:Issue) 
        return issue
    `
    let result = await executeQuery(
        query,
        {
            artefact: artefact,
            version: version
        }
    )

    return result;
}

export async function getArtefactsWithIssues(){
    let query = `
        match (artefact:Artefact)--(version:Version)--()--(issue:Issue)
        return artefact.name, version.label, issue.type, issue.time
    `
    return await executeQuery(query);
}