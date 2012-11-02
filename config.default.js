/**
 * Configuration file
 */

exports.config = {
    appName         : "node-feedback",
    port            : 3000,
    langauge        : "eng",
    database        : {
            name        : "node-feedback",
            host        : "alex.mongohq.com",
            port        : 10018,
            user        : "toto",
            password    : "toto"
    },
    authType        : "github",
    usersCollection : "users"
}