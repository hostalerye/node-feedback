
var DB              = require("./DB.js").DB
var DBReady         = require("./DB.js").Event
var ParallelRunner  = require("serial").ParallelRunner
var EventEmitter    = require('events').EventEmitter
var config          = require("../../config").config

var DBHelper = {}

DBReady.on('ready', function(){
    module.exports.Event.emit('ready')
})

DBHelper.Users = {
    findOne: function(query, options, callback) {

        DB.findOne(config.usersCollection, query, options, callback)

    },

    findByKey: function(login, options, callback) {

        DB.findOne(config.usersCollection, {login: login}, options, callback)

    },

    find: function(query, fields_or_options, options_or_callback, callback) {

        DB.find(config.usersCollection, query, fields_or_options, options_or_callback, callback)

    },

    save: function(obj, callback) {

        if(obj._id) {
            DB.update(config.usersCollection, {"_id":obj._id}, obj, {safe: true}, callback)
        } else {
            DB.save(config.usersCollection, obj, callback)
        }
    }
}

DBHelper.Bugs = {
    findOne: function(query, options, callback) {

        DB.findOne("bugs", query, options, callback)

    },

    find: function(query, fields_or_options, options_or_callback, callback) {

        DB.find("bugs", query, fields_or_options, options_or_callback, callback)

    },

    save: function(obj, callback) {

        if(obj._id) {
            DB.update("bugs", {"_id":obj._id}, obj, {safe: true}, callback)
        } else {
            DB.save("bugs", obj, callback)
        }
    }
}

DBHelper.Ideas = {
    findOne: function(query, options, callback) {

        DB.findOne("ideas", query, options, callback)

    },

    find: function(query, fields_or_options, options_or_callback, callback) {

        DB.find("ideas", query, fields_or_options, options_or_callback, callback)

    },

    save: function(obj, callback) {

        if(obj._id) {
            DB.update("ideas", {"_id":obj._id}, obj, {safe: true}, callback)
        } else {
            DB.save("ideas", obj, callback)
        }
    }
}

DBHelper.News = {
    findOne: function(query, options, callback) {

        DB.findOne("news", query, options, callback)

    },

    find: function(query, fields_or_options, options_or_callback, callback) {

        DB.find("news", query, fields_or_options, options_or_callback, callback)

    },

    save: function(obj, callback) {

        if(obj._id) {
            DB.update("news", {"_id":obj._id}, obj, {safe: true}, callback)
        } else {
            DB.save("news", obj, callback)
        }
    }
}

DBHelper.Questions = {
    findOne: function(query, options, callback) {

        DB.findOne("news", query, options, callback)

    },

    find: function(query, fields_or_options, options_or_callback, callback) {

        DB.find("news", query, fields_or_options, options_or_callback, callback)

    },

    save: function(obj, callback) {

        if(obj._id) {
            DB.update("news", {"_id":obj._id}, obj, {safe: true}, callback)
        } else {
            DB.save("news", obj, callback)
        }
    }
}

DBHelper.Comments = {
    findOne: function(query, options, callback) {

        DB.findOne("comments", query, options, callback)

    },

    find: function(query, fields_or_options, options_or_callback, callback) {

        DB.find("comments", query, fields_or_options, options_or_callback, callback)

    },

    save: function(obj, callback) {

        if(obj._id) {
            DB.update("comments", {"_id":obj._id}, obj, {safe: true}, callback)
        } else {
            DB.save("comments", obj, callback)
        }
    }
}


module.exports = {
    DBHelper: DBHelper,
    Event: new EventEmitter()
}

