exports.config = {
    appName         : "node-feedback",
    port            : 3000,
    language        : "eng",
    database        : {
            name        : "node-feedback",
            host        : "alex.mongohq.com",
            port        : 10018,
            user        : "toto",
            password    : "toto"
    },
    usersCollection : "users"
}