// import { z } from 'zod'
// import { sql } from '@vercel/postgres'
// import { NextResponse } from 'next/server'
//
// import { SaveNodesPayload } from './schemas'
//
//
// export async function POST(request: Request) {
//     try {
//         const payload = SaveNodesPayload.parse(await request.json())
//         if (!payload.nodes && !payload.edges) return NextResponse.json({ message: "Nothing to do" }, { status: 200 })
//
//         if (payload?.nodes) {
//             const promises = payload.nodes.map(n =>
//                 sql`INSERT INTO nodes (id, data) VALUES (${n.id}, ${JSON.stringify(n)})`
//             )
//             await Promise.allSettled(promises)
//         }
//
//         return new Response("success", { status: 200 });
//     } catch (err) {
//         console.error("[Error] Saving nodes has failed. Error: ", err)
//         if (err instanceof z.ZodError) {
//             return NextResponse.json({ message: "Bad request" }, { status: 400 })
//         }
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//     }
// }
//
//
