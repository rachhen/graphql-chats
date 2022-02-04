import { authDirectiveTransformer } from "./auth";
import { guestDirectiveTransformer } from "./guest";

export const makeDirective = (schema) => {
  schema = authDirectiveTransformer(schema, "auth");
  schema = guestDirectiveTransformer(schema, "guest");

  return schema;
};
