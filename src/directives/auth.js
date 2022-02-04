import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";
import { ensureSignedIn } from "../auth";

/**
 * https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
 */
export function authDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const dirt = getDirective(schema, fieldConfig, directiveName);
      const authDirective = dirt && dirt[0];

      if (authDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (...args) {
          const [, , context] = args;

          ensureSignedIn(context.req);

          return resolve.apply(this, args);
        };

        return fieldConfig;
      }
    },
  });
}
