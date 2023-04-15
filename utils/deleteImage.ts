import fs from "fs";

function fsUnlink(filePath: string) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

export default function deleteImage(image: string) {
  if (!image) return;

  fsUnlink(`./upload/${image}`);
}
