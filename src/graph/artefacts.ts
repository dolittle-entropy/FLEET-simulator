import { executeQuery } from "./dbconn";

export async function getUsedArtefactVersions(){
    let query = `
        match (a:Artefact)--(v:Version)--()--(dv:Version)--(dolittle:DolittleRuntime) 
        return a.name as artefact, v.label as version, dv.label as runtime-version
    `
    let result = await executeQuery(
        query
    )

    return result;
}

/**
 * Find artefacts that are active at a given date
 * @param date In the format of "YYYY-MM-DD"
 * @returns 
 */
export async function getActiveArtefactVersionsAt(date: string){
    const query = `
        match (a: Artefact)--(v: Version)--(d)
        where d.created <= date($datepoint) and 
              ((d.retired is null) or (d.retired >= date($datepoint)))
        return a.name as artefact, v.label as version, d.number as deployment
    `
    return await executeQuery(query, {datepoint: date})
}