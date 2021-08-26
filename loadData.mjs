import archiver from "archiver";
import fetch from "make-fetch-happen";
import path from "path";
import FormData from "form-data";
import fs from "fs";
import Minipass from "minipass";
import { readdir } from "fs/promises";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const url = "https://canvas.127.0.0.1.nip.io/api/v1/accounts/2/sis_imports";

const archive = archiver("zip");

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.log(err);
  } else {
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

const outStream = new Minipass();
archive.pipe(outStream);

const form = new FormData();
form.append("attachment", outStream, {
  filename: "canvas.zip",
});
const options = {
  method: "POST",
  headers: form.getHeaders({
    Authorization: "Bearer canvas-docker",
  }),
  body: form,
};

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
readdir(dataDir).then((files) => {
  files.map((name) =>
    archive.append(fs.createReadStream(path.join(dataDir, name)), { name })
  );
  archive.finalize();
  fetch(url, options)
    .then((res) => console.log("Success"))
    .catch((err) => console.error(err));
});
