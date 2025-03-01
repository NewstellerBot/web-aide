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
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_count BIGINT,
    s3_key VARCHAR(256),
    knowledge_id VARCHAR(128),
    processing BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_knowledge_items FOREIGN KEY(knowledge_id) REFERENCES knowledge(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS embeddings (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id VARCHAR(128) NOT NULL,
    embedding VECTOR(1536),
    start_index INTEGER,
    end_index INTEGER,
    CONSTRAINT fk_item_embeddings FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS bots (
    id VARCHAR(128) DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id VARCHAR(128),
    access_token VARCHAR(64),
    webhook_url TEXT,
    workflow_id VARCHAR(128),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workflow_bots FOREIGN KEY(workflow_id) REFERENCES workflows(id) ON DELETE SET NULL
);