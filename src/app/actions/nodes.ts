"use server"

import { neon } from "@neondatabase/serverless"
import { type AideNode } from '@/components/flow/nodes/types'

export async function updateNodes(nodes: AideNode[]) {
    if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!")
    if (!nodes || nodes.length === 0) throw new Error("No nodes to update!")

    try {
        const sql = neon(process.env.POSTGRES_URL)
        const savePromises = nodes.map(n => {
            return sql`
        INSERT INTO nodes (id, data)
        VALUES
        (${n.id}, ${JSON.stringify(n)})
        ON CONFLICT (id)
        DO UPDATE SET
            data = EXCLUDED.data;
        `;
        })

        return await Promise.allSettled(savePromises)
    } catch (e) {
        // TODO: add better error handling
        console.error(e);
    }
}

