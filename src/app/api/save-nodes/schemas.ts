import { z } from 'zod'

export const Node = z.object({
    id: z.string().min(1),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    data: z.any(),
    type: z.string(),
})


export const Edge = z.object({
    id: z.string().min(1),
    source: z.string(),
    target: z.string()
})

export const SaveNodesPayload = z.object({
    // There are more fields for both, but I cannot think about 
    // a better way to translate all the extra fields related to
    // xyflow
    nodes: z.array(Node).optional(),
    edges: z.array(Edge).optional(),
})
