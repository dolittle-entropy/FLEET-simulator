import neo4j, { QueryResult, Session, Transaction } from 'neo4j-driver'

export const driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic('neo4j', 'fleet')
)

export async function executeQuery(query: string, parameters?: any): Promise<Record<any, any>>{
    let session = driver.session()
    let result: QueryResult = await session.run(query, parameters)
    session.close()
    return result.records.map(i => i.toObject() )
}

export async function executeCommand(query: string, parameters?: any): Promise<Record<any, any>>{
    let session = driver.session()
    let result: QueryResult = await session.run(query, parameters)
    session.close()
    // if(result.summary.updateStatistics['_stats']['nodesCreated']==0){
    //     console.log(result)
    //     console.log(result.summary.query.parameters)
    // }
    return result.summary.updateStatistics
}

export async function executeCommandInTransaction(trans:Transaction, query: string, parameters?: any){
    let result: QueryResult = await trans.run(query, parameters)
    return result.summary.updateStatistics
}

export function startTransaction(){
    let session =  driver.session()
    return {session: session, trans: session.beginTransaction()}
}