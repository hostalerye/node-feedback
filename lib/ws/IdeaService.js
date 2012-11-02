var DBHelper            = require("../database/Helper.js").DBHelper

function IdeaService(app) {

    return function() {

        app.get('/:page/:perPage', function(req, res) {
            var page    = req.param("page")
            var limit   = req.param("perPage")
            var skip    = page*limit - limit

            DBHelper.Ideas.find({}, {skip: skip, limit: limit, sort: [['date','desc']]}, function(err, ideas) {
                if(err) {
                    return res.error(err)
                }
                res.send(ideas)
            })
        })

        app.post('/', function(req, res) {
            var author  = req.param("author")
            var title   = req.param("title")
            var text    = req.param("text")

            DBHelper.Ideas.save({author: author, title: title, text: text, date: new Date()}, function(err, idea) {
                if(err) {
                    return res.error(err)
                }
                res.send(idea)
            })
        })

    }
}

module.exports = IdeaService
