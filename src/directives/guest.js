import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";
import { ensureSignedOut } from "../auth";

/**
 * https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
 */
export function guestDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const dirt = getDirective(schema, fieldConfig, directiveName);
      const guestDirective = dirt && dirt[0];

      if (guestDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (...args) {
          const [, , context] = args;

          ensureSignedOut(context.req);

          return resolve.apply(this, args);
        };

        return fieldConfig;
      }
    },
  });
}
