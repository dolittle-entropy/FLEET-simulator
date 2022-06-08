import { driver, executeCommand } from './dbconn';
import * as fs from 'fs';


export async function createMockupGraph(){
    let session = driver.session()
    let query = fs.readFileSync('./res/cypher/init.cypher', 'utf-8')
    let result = await session.run(query)
    console.log(result)
    session.close()
}

export async function cleanup(){
    const query = `match (a) detach delete a`
    let result = await executeCommand(query)
    console.log(result)
}