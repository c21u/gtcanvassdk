import fetch from "make-fetch-happen";
import path from "path";
import { readFile } from "fs/promises";
import { URLSearchParams, fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const serialize = (obj, prefix) => {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + "[" + p + "]" : p;
      const v = obj[p];
      str.push(
        v !== null && typeof v === "object"
          ? serialize(v, k)
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      );
    }
  }
  return str.join("&");
};

readFile(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "toolconf.json"),
  { encoding: "utf8" }
)
  .then((conf) => {
    const body = new URLSearchParams(serialize(JSON.parse(conf)));
    fetch("https://canvas.127.0.0.1.nip.io/api/v1/accounts/2/external_tools", {
      method: "POST",
      headers: { Authorization: "Bearer canvas-docker" },
      body,
    })
      .then(() => console.log("Success"))
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));
