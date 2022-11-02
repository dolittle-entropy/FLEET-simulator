import express from 'express'
import { experiment } from '../graph/graphnode'

const app = express()

app.get('/api/graph/fields', (req, res)=>{
    res.json(
        {
            edges_fields: [ 
                {field_name: "id", type: "string"},
                {field_name: "source", type:"string"},
                {field_name: "target", type:"string"},
            ],
            nodes_fields: [
                {field_name: "id", type: "string"},
                {field_name: "title", type: "string"}
            ]
        }
    )
})

app.get('/api/graph/data', async (req, res)=>{
    try{
        let data = await experiment()
        res.json(data)
    }
    catch(e){
        console.log('neo4j not ready, try later')
        res.json({})
    }
})

app.get('/api/health', (req, res)=>{
    res.send('ok')
})


const port = 5000
app.listen(port, ()=> console.log(`running on ${port}`))