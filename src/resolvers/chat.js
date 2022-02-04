import { UserInputError } from "apollo-server-core";
import { Chat, Message, User } from "../models";
import { startChat } from "../schemas";

export default {
  Mutation: {
    startChat: async (root, args, { req }, info) => {
      const { userId } = req.session;

      const { value, error } = await startChat(userId).validate(args, {
        abortEarly: false,
      });
      if (error) throw new UserInputError(error);

      console.log(value);
      const { title, userIds } = value;
      const idsFound = await User.where("_id").in(userIds).countDocuments();

      if (idsFound !== userIds.length) {
        throw new UserInputError("One or more User IDs are invalid.");
      }

      userIds.push(userId);
      const chat = await Chat.create({ title, users: userIds });

      await User.updateMany(
        { _id: { $in: userIds } },
        { $push: { chats: chat } }
      );

      return chat;
    },
  },
  Chat: {
    messages: (chat, args, context, info) => {
      // TODO: pagination. projection
      return Message.find({ chat: chat.id }).exec();
    },
    users: async (chat, args, context, info) => {
      return (await chat.populate("users")).users;
    },
    lastMessage: async (chat, args, context, info) => {
      return (await chat.populate("lastMessage")).lastMessage;
    },
  },
};
