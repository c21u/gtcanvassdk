import archiver from "archiver";
import fetch from "make-fetch-happen";
import path from "path";
import FormData from "form-data";
import fs from "fs";
import { readdir } from "fs/promises";
import { fileURLToPath } from "url";

const url =
  "https://canvas.127.0.0.1.nip.io/api/v1/accounts/2/sis_imports?extension=zip";

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

const form = new FormData();
form.append("attachment", archive);
const options = {
  method: "POST",
  headers: form.getHeaders({
    Authorization: "Bearer canvas-docker",
    "Content-Type": "application/zip",
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
    .then((res) => console.log(JSON.stringify(res.json)))
    .catch((err) => console.error(err));
});
