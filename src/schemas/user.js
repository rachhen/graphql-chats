import Joi from "joi";

const email = Joi.string().email().required().label("Email");

const username = Joi.string()
  .alphanum()
  .min(4)
  .max(30)
  .required()
  .label("Username");

const name = Joi.string().max(254).label("Name");

const password = Joi.string()
  .min(8)
  .max(30)
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,30}$/)
  .label("Password")
  .messages({
    "string.pattern.base":
      '"Password" must have at least one lowercase letter, one uppercase letter, one digit, and one special character.',
  });

export const signUp = Joi.object().keys({
  email,
  username,
  name,
  password,
});

export const signIn = Joi.object().keys({
  email,
  password,
});
