import { toNumber } from "neo4j-driver-core";
import { stringify } from "querystring";
import { executeQuery } from "./dbconn";

export async function queryCustomApp(){
    let query = `
        match (c:Customer)--(a:Application) 
        return c, a
    `
    let result = await executeQuery(
        query
    )
    return result
}

export async function experiment(){
    let result = await queryCustomApp()
    let allnodes = await extractNodes(result)
    let alledges = (await queryEdges(allnodes)).map((i:any) => i.edge[0])
    
    let simplifedResult = {
        nodes: allnodes.map(i=>simplifyNode(i)), 
        edges: alledges.map((i:any)=>simplifyEdge(i))
    }
    return simplifedResult
}

export function simplifyNode(node: any){
    return {
        id: toNumber(node.identity).toString(),
        title: `${node.properties.name ?? node.properties.id}:${node.labels[0]}`
    }
}

export function simplifyEdge(edge: any){
    return {
        id: toNumber(edge.identity).toString(),
        source: toNumber(edge.start).toString(),
        target: toNumber(edge.end).toString()
    }
}

export async function queryEdges(nodes: any[]){
    let ids = nodes.map(i => toNumber(i.identity))
    let query = `
        with [${ids}] as nodeIds
        match (n) where ID(n) in nodeIds
        match (m) where ID(m) in nodeIds
        match p=(n)-[rels]-(m)
        return relationships(p) as edge
    `
    let result = await executeQuery(
        query
    )
    return result
}

export async function extractNodes(root: any): Promise<any[]>{
    let allnodes:any[] = []
    try{
        if(('identity' in root) && ('labels' in root)){
            return [root]
        }

        let leaves = []

        if(Array.isArray(root)){
            leaves = root
        }
        else{
            leaves = Object.values(root)
        }
            
        let allPromises = leaves.map(async (i) =>{
            return extractNodes(i)
        })

        let result = await Promise.all(allPromises)
        result.forEach(i => { allnodes.push(...i) })
        return allnodes
    }
    catch(e){
        return []
    }
}

// function toNumber(integer: {low:number, high:number}){
//     let res = integer.high

//     for (let i = 0; i < 32; i++) {
//         res *= 2
//     }

//     return integer.low + res
// }