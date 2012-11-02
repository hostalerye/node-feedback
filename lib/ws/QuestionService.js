var DBHelper            = require("../database/Helper.js").DBHelper

function QuestionService(app) {

    return function() {

        app.get('/:page/:perPage', function(req, res) {
            var page    = req.param("page")
            var limit   = req.param("perPage")
            var skip    = page*limit - limit

            DBHelper.Questions.find({}, {skip: skip, limit: limit, sort: [['date','desc']]}, function(err, questions) {
                if(err) {
                    return res.error(err)
                }
                res.send(questions)
            })
        })

        app.post('/', function(req, res) {
            var author  = req.param("author")
            var title   = req.param("title")
            var text    = req.param("text")

            DBHelper.Questions.save({author: author, title: title, text: text, date: new Date()}, function(err, question) {
                if(err) {
                    return res.error(err)
                }
                res.send(question)
            })
        })
    }
}

module.exports = QuestionService
