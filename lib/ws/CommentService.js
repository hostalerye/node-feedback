var DBHelper            = require("../database/Helper.js").DBHelper

function CommentService(app) {

    return function() {

        app.get('/:parentId/:page/:perPage', function(req, res) {
            var parentId    = req.param("parentId")
            var page        = req.param("page")
            var limit       = req.param("perPage")
            var skip        = page*limit - limit

            DBHelper.Comments.find({parentId: parentId}, {skip: skip, limit: limit, sort: [['date','desc']]}, function(err, comments) {
                if(err) {
                    return res.error(err)
                }
                res.send(comments)
            })
        })

        app.post('/', function(req, res) {
            var author      = req.param("author")
            var title       = req.param("title")
            var parentId    = req.param("parentId")
            var text        = req.param("text")

            DBHelper.Comments.save({author: author, title: title, text: text, parentId: parentId, date: new Date()}, function(err, comment) {
                if(err) {
                    return res.error(err)
                }
                res.send(comment)
            })
        })
    }
}

module.exports = CommentService
