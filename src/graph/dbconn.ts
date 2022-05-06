import neo4j, { QueryResult } from 'neo4j-driver'

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
    return result.summary.updateStatistics
}