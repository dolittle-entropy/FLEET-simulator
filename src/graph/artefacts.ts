import { executeQuery } from "./dbconn";

export async function getUsedArtefactVersions(){
    let query = `
        match (a:Artefact)--(v:Version)--()--(dv:Version)--(dolittle:DolittleRuntime) 
        return a.name, v.label, dv.label
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
              ((d.released is null) or (d.release >= date($datepoint)))
        return a.name, v.label, d
    `
    return await executeQuery(query, {datepoint: date})
}