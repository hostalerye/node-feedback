var DBHelper            = require("../database/Helper.js").DBHelper

function BugService(app) {

    return function() {

        app.get('/list', function(req, res) {

        })

    }
}

module.exports = BugService
