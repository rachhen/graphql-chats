import { AuthenticationError } from "apollo-server-core";
import { User } from "./models";
import { SESS_NAME } from "./config";

export const attemptSignIn = async (email, password) => {
  const message = "Incorrect email or password. Please try again";
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError(message);
  }

  if (!(await user.matchesPassword(password))) {
    throw new AuthenticationError(message);
  }

  return user;
};

const signedIn = (req) => req.session.userId;

export const ensureSignedIn = (req) => {
  if (!signedIn(req)) {
    throw new AuthenticationError("You must be singed in.");
  }
};

export const ensureSignedOut = (req) => {
  if (signedIn(req)) {
    throw new AuthenticationError("You are already singed in.");
  }
};

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);

      res.clearCookie(SESS_NAME);

      resolve(true);
    });
  });
