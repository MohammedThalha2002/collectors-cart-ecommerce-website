import admin from "firebase-admin";
import fs from "fs";
const serviceAccount = fs.readFileSync("./config/serviceAccountKey.json");
const key = JSON.parse(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(key),
});

export default admin;
