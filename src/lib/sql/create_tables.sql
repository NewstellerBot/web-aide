CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(128),
    name VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    data JSONB,
    workflow_id VARCHAR(128),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(128),
    CONSTRAINT fk_workflow_nodes FOREIGN KEY(workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS edges (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    source VARCHAR(128),
    target VARCHAR(128),
    workflow_id VARCHAR(128),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(128),
    CONSTRAINT fk_workflow_edges FOREIGN KEY(workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS knowledge (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(256),
    user_id VARCHAR(128),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    knowledge_id VARCHAR(128),
    embedding VECTOR(1536) CONSTRAINT fk_knowledge_items FOREIGN KEY(knowledge_id) REFERENCES knowledge(id) ON DELETE CASCADE
);