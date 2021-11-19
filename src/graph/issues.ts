import { executeQuery } from "./dbconn";

export async function getNearestIssues(artefact:string, version:string){
    let query = `
        match (a:Artefact {name: $artefact})--(v:Version {label:$version})-[*2..2]-(issue:Issue) 
        return a, v, issue
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