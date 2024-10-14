const jwt = require('jsonwebtoken')

//use Refresh Token to generate new Refresh and Auth Token
function refreshingToken(req, res, refreshTokenCookie) {
    console.log("[Request refreshing with]: " + refreshTokenCookie);
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
            const authToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '12h' });

            createSecureCookie(req, res, "authTokenCookie", authToken, 60 * 60 * 1000); //1 hour
            createSecureCookie(req, res, 'refreshTokenCookie', refreshToken, 12 * 60 * 60 * 1000) // 12 hours
            console.log("Auth refreshed & created new Refresh in cookies")
            resolve(authToken); // Resolve with the new auth token
        });
    });
}

//middleware function
async function middleAuthentication(req, res, next) {
    console.log("-[Request Middle Authentication]-")
    try {
        const authToken = req.cookies.authTokenCookie;
        console.log("-> Checking Authentication Cookie: " + authToken);

        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) { // 1. Auth is invalid
                console.log("-> Authentication Token is invalid");
                try {
                    const refreshTokenCookie = req.cookies.refreshTokenCookie;
                    if (!refreshTokenCookie) {
                        console.log("-> No Refresh Cookie, request to log out")
                        return res.status(401).send({ message: "Failed to refresh auth token." });
                    }
                    const newAuthToken = await refreshingToken(req, res, refreshTokenCookie);
                    req.user = jwt.decode(newAuthToken);
                    return next();
                } catch (err) {
                    return res.status(err.status || 403).send({ message: err.message });
                }
            }
            //req.user = user;
            // 2. Auth exists and valid
            console.log("-> Valid Authentication -> proceed")
            next();
        });
    }
    catch (err) { // 3. No Auth
        console.log("No Authentication Cookie");
        try { // 4. Use Refresh to get new Auth
            const refreshTokenCookie = req.cookies.refreshTokenCookie;
            console.log("-> Checking Refresh Cookie: " + refreshTokenCookie);
            if (!refreshTokenCookie) { // 5. No Refresh, Log out
                console.log("No Refresh Cookie, request to log out")
                return res.status(401).send({ message: "Failed to refresh auth token." });
            }
            // 6. Auth successfully generated by Refresh
            const newAuthToken = await refreshingToken(req, res, refreshTokenCookie);
            req.user = jwt.decode(newAuthToken);
            console.log("-> New Authentication created -> proceed")
            return next();
        }
        catch (err) {
            console.log("-> Failed to use refresh cookie")
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
    }
    else {
        console.log("Cookie [" + name + "] already exists, creating a new one")
    }
    res.cookie(name, value, {
        httpOnly: true,
        secure: true, //https
        maxAge: expiresIn
    })
    console.log("[" + name + "] Cookie created")
}


module.exports = {
    createSecureCookie,
    middleAuthentication
}