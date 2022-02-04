import Joi from "joi";
import mongoose from "mongoose";

const objectId = {
  type: "objectId",
  base: Joi.string(),
  messages: {
    "objectId.base": "{{#label}} must be a valid Object ID",
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId.base") };
    }
    // return { value };
  },
};

/**
 * @type {import('joi')}
 */
export default Joi.extend(objectId);
