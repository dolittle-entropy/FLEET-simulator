import { driver } from './dbconn';
import * as fs from 'fs';


export async function createMockupGraph(){
    let session = driver.session()
    let query = fs.readFileSync('./res/cypher/init.cypher', 'utf-8')
    let result = await session.run(query)
    console.log(result)
    session.close()
}