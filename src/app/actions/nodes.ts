"use server"

import { neon } from "@neondatabase/serverless"
import { type AideNode } from '@/components/flow/nodes/types'

export async function updateNodes(nodes: AideNode[]) {
    if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!")
    if (!nodes || nodes.length === 0) throw new Error("No nodes to update!")

    const sql = neon(process.env.POSTGRES_URL)
    const values = nodes
        .map((n) => `(${n.id}, '${JSON.stringify(n)}')`).join(',\n')

    console.log('executing sql: ', `
      INSERT INTO nodes (id, data)
      VALUES
      ${values}
      ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data;
    `)

    // await sql`
    //   INSERT INTO nodes (id, data)
    //   VALUES
    //   ${values}
    //   ON CONFLICT (id) DO UPDATE
    //   SET data = EXCLUDED.data;
    // `;

    // console.log(values)
    // console.log(nodes)
}

