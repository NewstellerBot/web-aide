import { z } from "zod";

export const BotSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  description: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  timestamp: z
    .union([z.string().transform((str) => new Date(str)), z.date()])
    .optional()
    .nullable(),
});

export type Bot = z.infer<typeof BotSchema>;

export const BotsSchema = BotSchema.array();
