var DBHelper            = require("../database/Helper.js").DBHelper

function NewsService(app) {

    return function() {

        app.get('/list', function(req, res) {

        })

    }
}

module.exports = NewsService
