CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(36) DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    data JSONB,
    workflow_id VARCHAR(36),
    CONSTRAINT fk_workflow_nodes FOREIGN KEY(workflow_id) REFERENCES workflows(id)
);
CREATE TABLE IF NOT EXISTS edges (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    source VARCHAR(128),
    target VARCHAR(128),
    workflow_id VARCHAR(36),
    CONSTRAINT fk_workflow_edges FOREIGN KEY(workflow_id) REFERENCES workflows(id)
);