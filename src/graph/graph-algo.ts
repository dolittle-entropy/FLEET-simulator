import { executeQuery } from "./dbconn";

export async function projectDeployGraph(){
    const query = `
        call gds.graph.project(
            "deploygraph", 
            ['Deployment', 'Version', 'DolittleRuntime', 'Artefact'], 
            ['ArtefactVersion', 'RuntimeVersion', 'VersionOf']
        )
    `

    let result = await executeQuery(query)
    return result;

}

export async function pageRank(){
    try{
        let projectResult = await projectDeployGraph()
    }
    catch(e){
        console.log(e)
    }
    let query = `
        CALL gds.pageRank.stream('deploygraph')
        YIELD nodeId, score
        RETURN gds.util.asNode(nodeId).name AS name, score
        ORDER BY score DESC, name ASC
    `
    let result = executeQuery(query)
    return result
}