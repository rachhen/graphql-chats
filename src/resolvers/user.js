import mongoose from "mongoose";
import { UserInputError } from "apollo-server-express";
import { User } from "../models";
import { signUp, signIn, objectId } from "../schemas";
import { attemptSignIn, signOut } from "../auth";

export default {
  Query: {
    me: (root, args, { req }, info) => {
      // TODO: projection

      return User.findById(req.session.userId).exec();
    },
    users: (root, args, { req }, info) => {
      // TODO: projection, pagination

      return User.find({}).exec();
    },
    user: async (root, args, { req }, info) => {
      // TODO:  projection

      await objectId.validateAsync(args);

      return User.findById(args.id);
    },
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      // TODO: not auth

      // validation
      const { value, error } = await signUp.validate(args, {
        abortEarly: false,
      });
      if (error) throw new UserInputError(error);

      const user = await User.create(value);
      req.session.userId = user.id;
      return user;
    },
    signIn: async (root, args, { req }, info) => {
      const { value, error } = await signIn.validate(args, {
        abortEarly: false,
      });
      if (error) throw new UserInputError(error);

      const user = await attemptSignIn(value.email, value.password);

      req.session.userId = user.id;
      return user;
    },
    signOut: async (root, args, { req, res }, info) => {
      return signOut(req, res);
    },
  },
  User: {
    chats: async (user, args, context, info) => {
      return (await user.populate("chats")).chats;
    },
  },
};
