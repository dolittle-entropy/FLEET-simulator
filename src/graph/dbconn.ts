import neo4j from 'neo4j-driver'

export const driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic('neo4j', 'fleet')
)

export async function executeQuery(query: string, parameters?: any): Promise<Record<any, any>>{
    let session = driver.session()
    let result = await session.run(query, parameters)
    session.close()
    return result.records;
}