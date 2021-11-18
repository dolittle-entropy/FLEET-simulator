export interface Artefact{
    id: string;
    config: object;
    developer: Developer;
}

export interface Version{
    name: string;
    releaseType: "major" | "minor" | "bug fixing";
    artefact: Artefact;
    config: object;
}

export interface Deployment{
    id: string;
    number: number;
    runtime: Version;
    microService: Version[];
    config: object;
    sla: object;
}

export interface Developer{
    name: string;
}

export interface Env{
    config: object;
}







