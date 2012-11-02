var DBHelper            = require("../database/Helper.js").DBHelper

function BugService(app) {

    return function() {

        app.get('/:page/:perPage', function(req, res) {
            var page    = req.param("page")
            var limit   = req.param("perPage")
            var skip    = page*limit - limit

            DBHelper.Bugs.find({}, {skip: skip, limit: limit, sort: [['date','desc']]}, function(err, bugs) {
                if(err) {
                    return res.error(err)
                }
                res.send(bugs)
            })
        })

        app.post('/', function(req, res) {
            var author  = req.param("author")
            var title   = req.param("title")
            var text    = req.param("text")

            DBHelper.Bugs.save({author: author, title: title, text: text, date: new Date()}, function(err, bug) {
                if(err) {
                    return res.error(err)
                }
                res.send(bug)
            })
        })

    }
}

module.exports = BugService
