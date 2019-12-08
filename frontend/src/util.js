const crypto = require("crypto");

export function sanitize(str) {
  if (str) {
    return str
      .replace("-", "")
      .replace("(", "")
      .replace(")", "");
  }
  return "";
}

export function sha256(msg) {
  var shasum = crypto.createHash("sha256").update(msg);
  return shasum.digest("base64");
}

export function formatPhoneNumber(str) {
  if (str) {
    return str.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
}
