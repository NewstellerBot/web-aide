import { z } from "zod";

const chatSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  type: z.enum(["private", "group", "supergroup", "channel"]),
});

type Chat = z.infer<typeof chatSchema>;

const transformChat = (chat: Chat) => ({
  id: chat.id,
  type: chat.type,
  username: chat.username,
  firstName: chat.first_name,
  lastName: chat.last_name,
});

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

type User = z.infer<typeof userSchema>;

const transformUser = (user: User) => ({
  id: user.id,
  isBot: user.is_bot,
  firstName: user.first_name,
  lastName: user.last_name,
  username: user.username,
  languageCode: user.language_code,
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
  chat: chatSchema.optional(),
  forward_origin: messageOriginSchema.optional(),
  is_topic_message: z.boolean().optional(),
  is_automatic_forward: z.boolean().optional(),
  text: z.string().optional(),
});

type Message = z.infer<typeof baseMessageSchema>;

const messageSchema: z.ZodType<Message> = baseMessageSchema.extend({
  reply_to_message: z.lazy(() => messageSchema).optional(),
});

const transformMessage = (message: Message) => ({
  messageId: message.message_id,
  messageThreadId: message.message_thread_id,
  date: message.date,
  text: message.text,
  chat: message.chat ? transformChat(message.chat) : undefined,
  from: message.from ? transformUser(message.from) : undefined,
  senderChat: message.sender_chat
    ? transformChat(message.sender_chat)
    : undefined,
  senderBoostCount: message.sender_boost_count,
  senderBusinessBot: message.sender_business_bot
    ? transformUser(message.sender_business_bot)
    : undefined,
  forwardOrigin: message.forward_origin
    ? {
        type: message.forward_origin.type,
        date: message.forward_origin.date,
      }
    : undefined,
  isTopicMessage: message.is_topic_message,
  isAutomaticForward: message.is_automatic_forward,
});

export const updateSchema = z
  .object({
    update_id: z.number(),
    message: messageSchema.optional(),
    edited_message: messageSchema.optional(),
    channel_post: messageSchema.optional(),
    edited_channel_post: messageSchema.optional(),
    business_message: messageSchema.optional(),
    edited_business_message: messageSchema.optional(),
  })
  .transform((update) => ({
    updateId: update.update_id,
    message: update.message ? transformMessage(update.message) : undefined,
    editedMessage: update.edited_message
      ? transformMessage(update.edited_message)
      : undefined,
    channelPost: update.channel_post
      ? transformMessage(update.channel_post)
      : undefined,
    editedChannelPost: update.edited_channel_post
      ? transformMessage(update.edited_channel_post)
      : undefined,
    businessMessage: update.business_message
      ? transformMessage(update.business_message)
      : undefined,
    editedBusinessMessage: update.edited_business_message,
  }));
