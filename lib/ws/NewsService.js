var DBHelper            = require("../database/Helper.js").DBHelper

function NewsService(app) {

    return function() {

        app.get('/:page/:perPage', function(req, res) {
            var page    = req.param("page")
            var limit   = req.param("perPage")
            var skip    = page*limit - limit

            DBHelper.News.find({}, {skip: skip, limit: limit, sort: [['date','desc']]}, function(err, news) {
                if(err) {
                    return res.error(err)
                }
                res.send(news)
            })
        })

        app.post('/', function(req, res) {
            var author  = req.param("author")
            var title   = req.param("title")
            var text    = req.param("text")

            DBHelper.News.save({author: author, title: title, text: text, date: new Date()}, function(err, news) {
                if(err) {
                    return res.error(err)
                }
                res.send(news)
            })
        })

    }
}

module.exports = NewsService
