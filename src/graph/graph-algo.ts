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

/**
 * List the most "important" nodes (artefacts), which has most intensely used
 * by "important" deployments.
 * See: https://neo4j.com/docs/graph-data-science/current/algorithms/page-rank/ 
 * @returns node name (only applies to artefacts) and importance score
 */
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