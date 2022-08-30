// drop the projected graph
call gds.graph.drop("deploygraph") yield graphName

// page-ranking of all nodes
CALL gds.pageRank.stream('deploygraph')
        YIELD nodeId, score
        RETURN gds.util.asNode(nodeId).name AS name, gds.util.asNode(nodeId).uid AS uid, score
        ORDER BY score DESC, name ASC

// Project a graph
call gds.graph.project(
            "deploygraph", 
            ['Deployment', 'DeploymentInstance', 'RuntimeVersion', 'ArtifactVersion', 'Artifact', 'Customer', 'Application', 'Environment'], 
            ['InstanceOf', 'UsesArtifact', 'VersionOf','DevelopedBy', 'DeployedIn', 'EnvironmentOf', 'OwnedBy']
        )
