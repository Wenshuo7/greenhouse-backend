import validator from "validator";
import Filter from "bad-words";

const filter = new Filter({ placeHolder: "x" });

export default function validateCaption(value: string) {
  if (!validator.isLength(value, { min: 4 })) {
    throw new Error(`Your comment needs to be atleast 4 characters`);
  }
  if (!validator.isLength(value, { max: 100 })) {
    throw new Error(`Comment needs to have max number of 100 characters`);
  }

  let newCaption = value;

  newCaption = validator.escape(validator.trim(newCaption));
  newCaption = filter.clean(newCaption);

  return newCaption;
}
