const fs = require("fs");
const jose = require("node-jose");
const ms = require("ms");

export default async function handler(req, res) {
    const { name, id } = req.query;
    if (!name || !id) {
        return res.status(400).send("Invalid Request!!!")
    }
    const JWKeys = fs.readFileSync("keys.json");
    const keyStore = await jose.JWK.asKeyStore(JWKeys.toString());
    const [key] = keyStore.all({ use: "sig" });
    const opt = { compact: true, jwk: key, fields: { typ: "jwt" } };
    const payload = JSON.stringify({
        exp: Math.floor((Date.now() + ms("1d")) / 1000),
        iat: Math.floor(Date.now() / 1000),
        sub: "gari-sdk",
        name,
        uid: id,
    });
    const token = await jose.JWS.createSign(opt, key).update(payload).final();
    res.send({ token });
}