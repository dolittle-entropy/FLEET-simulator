
import { executeQuery } from './dbconn';

export async function listAllDeployments(){
    const query = `
        match (a:Artefact)--(v1:Version)--(d:Deployment)--(v2:Version)--(r:DolittleRuntime) 
        return a, v1, d, v2, r 
    `
   return await executeQuery(query)
}



