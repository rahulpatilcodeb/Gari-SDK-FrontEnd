const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
    let resourcePath = "token/jwks";
    let token = req.body;
    let decodedToken = jwt.decode(token, { complete: true });
    let kid = decodedToken.headers.kid;
    return new Promise(function (resolve, reject) {
        var jwksPromise = config.request("GET", resourcePath);
        jwksPromise
            .then(function (jwksResponse) {
                const jwktopem = require("jwk-to-pem");
                const [firstKey] = jwksResponse.keys(kid);
                const publicKey = jwktopem(firstKey);
                try {
                    const decoded = jwt.verify(token, publicKey);
                    resolve(decoded);
                } catch (e) {
                    reject(e);
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
}