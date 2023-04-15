import validator from "validator";

export default function validateAlpha(value: string, label: string) {
  if (!validator.isAlpha(value)) {
    throw new Error(`${label} must contain only alphabetical characters`);
  }
}
