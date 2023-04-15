import validator from "validator";

export default function validateLength(value: string, label: string) {
  if (!validator.isLength(value, { min: 4 })) {
    throw new Error(`${label} needs to be atleast 4 characters`);
  }
  if (!validator.isLength(value, { max: 10 })) {
    throw new Error(`${label} needs to have max number of 10 characters`);
  }
}
