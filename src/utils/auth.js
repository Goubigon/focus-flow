const jwt = require('jsonwebtoken')

//used when authenticating
function refreshingToken(req, res, refreshTokenCookie) {
    console.log("-[Request refreshing with following token]-: " + refreshTokenCookie);
    if (!refreshTokenCookie) {
        console.log("No Refresh Cookie")
        return null;
    }
    return new Promise((resolve, reject) => {
        jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                reject({ status: 403, message: "Refresh Token is invalid" });
                return;
            }

            const newUser = {
                mUserIdentifier: user.mUserIdentifier,
                mUsername: user.mUsername,
                mEmail: user.mEmail,
                mRole: user.mRole,
            };
            const authToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
            createSecureCookie(req, res, "authTokenCookie", authToken, 15 * 1000); // 15 sec
            console.log("Auth Token refreshed & put in cookies")
            resolve(authToken); // Resolve with the new auth token
        });
    });
}

//middleware function
async function middleAuthentication(req, res, next) {
    console.log("-[Request authentication]-")
    const authToken = req.cookies.authTokenCookie;
    console.log("Checking Authentication Cookie: " + authToken);

    //if auth exists -> verify
    if (authToken) {
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) { // if auth error
                console.log("Authentication Token is invalid");
                try { // try refresh
                    const refreshTokenCookie = req.cookies.refreshTokenCookie;
                    if (!refreshTokenCookie) {
                        console.log("No Refresh Cookie, request to log out")
                        return res.status(401).send({ message: "Failed to refresh auth token." });
                    }
                    const newAuthToken = await refreshingToken(req, res, refreshTokenCookie);
                    req.user = jwt.decode(newAuthToken);
                    return next();
                } catch (err) {
                    return res.status(err.status || 403).send({ message: err.message });
                }
            }
            req.user = user;
            console.log("Valid Authentication -> proceed")
            next();
        });
    } else {
        console.log("No Authentication Cookie");
        try {
            const refreshTokenCookie = req.cookies.refreshTokenCookie;
            console.log("Checking Refresh Cookie: " + refreshTokenCookie);
            if (!refreshTokenCookie) {
                console.log("No Refresh Cookie, request to log out")
                return res.status(401).send({ message: "Failed to refresh auth token." });
            }
            const newAuthToken = await refreshingToken(req, res, refreshTokenCookie);
            req.user = jwt.decode(newAuthToken);
            console.log("New Authentication created -> proceed")
            return next();
        }
        catch (err) {
            return res.status(err.status || 401).send({ message: err.message });
        }
    }
}

/**
 * Creates a secure, HTTP-only cookie if it does not already exist.
 *
 * @param {Object} req - The request object, which contains cookies.
 * @param {Object} res - The response object, used to set the cookie.
 * @param {string} name - The name of the cookie to create.
 * @param {string} value - The value of the cookie to set.
 * @param {number} expiresIn - The expiration time for the cookie in milliseconds.
 */
function createSecureCookie(req, res, name, value, expiresIn) {
    console.log("-[Requesting Secure cookie creation]-")
    if (req.cookies[name] === undefined) {
        console.log("[" + name + "] Cookie doesn't exist yet")
        res.cookie(name, value, {
            httpOnly: true,
            secure: true, //https
            maxAge: expiresIn
        })
        console.log("[" + name + "] Cookie created")
    } else {
        console.log("Cookie [" + name + "] already exists, nothing to do")
    }
}


module.exports = {
    createSecureCookie,
    middleAuthentication
}