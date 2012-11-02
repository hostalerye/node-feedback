/************************
 DEPENDENCIES
 ************************/

var express         = require('express')
require('express-namespace')
var routes          = require('./routes')
var config          = require('./config').config
var passport        = require('passport')
var LocalStrategy   = require('passport-local').Strategy
var DBHelper        = require("./lib/database/Helper").DBHelper

var app = module.exports = express()



/************************
 AUTH CONFIGURATION
 ************************/
passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    DBHelper.Users.findOne({id: id}, function (err, user) {
        done(err, user)
    })
})

passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            DBHelper.Users.findByKey(username, function(err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, { message: 'Unknown user ' + username })
                }
                if (user.password != password) {
                    return done(null, false, { message: 'Invalid password' })
                }
                return done(null, user)
            })
        })
    }
))



/************************
 CONFIGURATION
 ************************/
app.configure(function(){
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(express.cookieParser())
    app.use(express.session({ secret: 'your secret here' }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(require('stylus').middleware({ src: __dirname + '/public' }))
    app.use(app.router)
    app.use(express.static(__dirname + '/public'))
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
    app.use(express.errorHandler())
})


/************************
 AUTHENTICATION
 ************************/
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/')
    })

app.get('/logout', function(req, res){
    req.logout()
    res.redirect('/')
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

/************************
 ROUTES
 ************************/
app.get('/', routes.index)
app.get('/issues', routes.issues)


/************************
 WEB SERVICES
 ************************/
var UserService     = require("./lib/ws/UserService.js")
var BugService      = require("./lib/ws/BugService.js")
var IdeaService     = require("./lib/ws/IdeaService.js")
var NewsService     = require("./lib/ws/NewsService.js")
var QuestionService = require("./lib/ws/QuestionService.js")

app.namespace("/users", UserService(app))
app.namespace("/bugs", BugService(app))
app.namespace("/ideas", IdeaService(app))
app.namespace("/news", NewsService(app))
app.namespace("/questions", QuestionService(app))




/************************
 START SERVER
 ************************/
app.listen(config.port)
console.log("Express server listening on port "+config.port)
