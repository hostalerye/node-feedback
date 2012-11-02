var DBHelper            = require("../database/Helper.js").DBHelper

function UserService(app) {

    return function() {

        app.get('/:login', function(req, res) {
            var login = req.param("login")
            DBHelper.Users.findOne({login: login}, function(err, user) {
                if(err) {
                    return res.error(err)
                }
                res.send(user)
            })
        })

    }
}

module.exports = UserService
