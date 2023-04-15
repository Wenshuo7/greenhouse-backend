import validator from "validator";
import Filter from "bad-words";

const filter = new Filter({ placeHolder: "x" });

export default function validateComment(value: string) {
  if (!validator.isLength(value, { min: 4 })) {
    throw new Error(`Your comment needs to be atleast 4 characters`);
  }
  if (!validator.isLength(value, { max: 80 })) {
    throw new Error(`Comment needs to have max number of 80 characters`);
  }

  let newComment = value;

  newComment = validator.escape(validator.trim(newComment));
  newComment = filter.clean(newComment);

  return newComment;
}
