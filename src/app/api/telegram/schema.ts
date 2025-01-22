import { z } from "zod";

const chatSchema = z.object({});

const messageOriginBase = z.object({
  type: z.string(),
  date: z.coerce.date(),
});

const messageOriginSchema = messageOriginBase;

const userSchema = z.object({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
});

const baseMessageSchema = z.object({
  message_id: z.number(),
  message_thread_id: z.number().optional(),
  from: userSchema.optional(),
  sender_chat: chatSchema.optional(),
  sender_boost_count: z.number().optional(),
  sender_business_bot: userSchema.optional(),
  date: z.coerce.date(),
  business_connection_id: z.string().optional(),
  chat: chatSchema,
  forward_origin: messageOriginSchema.optional(),
  is_topic_message: z.boolean().optional(),
  is_automatic_forward: z.boolean().optional(),
});

type Message = z.infer<typeof baseMessageSchema>;

const messageSchema: z.ZodType<Message> = baseMessageSchema.extend({
  reply_to_message: z.lazy(() => messageSchema).optional(),
});

export const updateSchema = z.object({
  update_id: z.number(),
  message: messageSchema.optional(),
  edited_message: messageSchema.optional(),
  channel_post: messageSchema.optional(),
  edited_channel_post: messageSchema.optional(),
  business_message: messageSchema.optional(),
  edited_business_message: messageSchema.optional(),
});
