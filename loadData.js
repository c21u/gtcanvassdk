import archiver from "archiver";
import blobStream from "blob-stream";
import path from "path";
import { fileURLToPath } from "url";

const url = "https://canvas.127.0.0.1.nip.io/api/v1/accounts/1/sis_imports";

const archive = archiver("zip", {zlib: {level: 9}});

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.error(err);
  } else {
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(blobStream()).on("finish", async function() {
  const blob = this.toBlob();

  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer canvas-docker",
      "Content-Type": "application/zip"
    },
    /*body: {
    [Symbol.toStringTag]: "File",
    name: "canvas.zip",
    type: "application/zip",
    stream: () => archive,
  },*/
    body: blob,
  };

  const res = await fetch(url, options);
  console.log("Success", await res.text());
})

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
archive.directory(dataDir, false);
archive.finalize();
