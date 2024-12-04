CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(36) DEFAULT uuid_generate_v4(),
    data JSONB,
    workflow_id VARCHAR(36),
);
CREATE TABLE IF NOT EXISTS edges (
    id VARCHAR(36) DEFAULT uuid_generate_v4(),
    source VARCHAR(36),
    target VARCHAR(36),
    data JSONB,
    workflow_id VARCHAR(36),
);
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(36) DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    -- data JSONB
);