import Ajv from "ajv";
import VPSchema from "../res/VPSchema.json";

const ajv = new Ajv({ strict: false, allErrors: true });

function validateJsonAgainstSchema(schema: object, json: object): boolean {
  try {
    const validate = ajv.compile(schema);
    return validate(json);
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function isVerifiablePresentationSchema(VPData: object) {
  return validateJsonAgainstSchema(VPSchema, VPData);
}
