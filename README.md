# FLEET-simulator

This project has been setup using Typescript, Node@v16 and Yarn.

To get started run `yarn` to install dependencies, and `yarn start` to run the `main.ts` file.

# Install Neo4j
```bash
cd ./docker
docker-compose up
```

After it's up and running, you may access the database through ```http://localhost:7474```. user name is neo4j, and password is fleet

# Play around

- Create initial, mock-up graph using [src/graph/mockup-graph.ts]. The graph/data is defined in [res/cypher/init.cypher].
- Some general queries in [src/graph/view.ts]
- Found and count issues: [src/graph/issues.ts]

