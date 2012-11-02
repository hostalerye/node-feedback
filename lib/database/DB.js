var mongo           = require('mongodb')
var config          = require('../../config').config
var EventEmitter    = require('events').EventEmitter
var ParallelRunner  = require('serial').ParallelRunner

Provider = function(name, host, port, user, password, callback) {
    var self = this

    this.db = new mongo.Db(name, new mongo.Server(host, port, {auto_reconnect : true, poolSize : 30}), {native_parser:false, safe: true})

    this.db.open(function(err) {

        if (err) throw(err)

        self.db.authenticate(user, password, function(err, result) {

            if (err) throw err

            console.info("authentication: "+result)
            callback()
        })
    })

    var collections = {}

    /**
     *
     * @param name the collection name
     * @param indexes any indexes to set on the collection. See doc on indexes here: (http://christkv.github.com/node-mongodb-native)
     */
    this.loadCollection = function(name, indexes, callback) {

        console.info('Loading collection ['+name+']')

        self.db.collection(name, function(err, collection) {

            if (err) throw err

            collections[name] = collection
            console.info('Collection ['+name+'] loaded')


            if(indexes) {
//                console.log(">> Creating indexes on collection ["+name+"]")

                for(var i = 0 ; i < indexes.length ; i++) {

                    collection.ensureIndex(indexes[i].index, indexes[i].options, function(err, indexName) {

                        if (err) throw err

                        console.log("Created index [" + indexName + "] on collection ["+name+"]")

                        if(callback) {
                            callback()
                        }
                    })

                }
            }
        })
    }

    /**
     *
     * @param collection the collection name in which to save the object
     * @param obj the object to insert or update
     * @param callback (err, obj)
     */
    this.update = function(collection, selector, document, optionsOrCallback, callback) {

        if(collections[collection]) {

            console.log(collection+".update("+JSON.stringify(selector)+", "+JSON.stringify(document)+", "+JSON.stringify(optionsOrCallback)+")")


            if(!callback) {

                callback = optionsOrCallback

                optionsOrCallback = {}

            }

            optionsOrCallback.safe = true

            collections[collection].update(selector, document, optionsOrCallback, function(err, savedDocument) {

                if(err) return callback(err, undefined)

                if(savedDocument === 1) {
                    callback(undefined, document)
                } else {
                    callback(undefined, savedDocument)
                }

            })

        } else {

            var err = new Error("No collection with name ["+collection+"]")

            if(callback) callback(err, undefined)
            else optsOrCallback(err, undefined)

        }
    }

    /**
     *
     * @param collection the collection name in which to save the object
     * @param obj the object to insert or update
     * @param callback (err, obj)
     */
    this.save = function(collection, document, callback) {

        if(collections[collection]) {

            console.log(collection+".save("+JSON.stringify(document)+", {safe: true})")


            collections[collection].save(document, {safe: true}, function(err, result) {

                if(err) return callback(err, undefined)

                if(result === 1) callback(undefined, document)

                else callback(undefined, result)

            })

        } else {

            var err = new Error("No collection with name ["+collection+"]")

            callback(err, undefined)

        }
    }

    /**
     *
     * @param collection the collection name in which to save the object
     * @param query the search query
     * @param options search options
     * @param callback (err, obj)
     */
    this.findOne = function(collection, query, optsOrCallback, callback) {

        if(collections[collection]) {

            if(callback) {

                console.log(collection+".findOne("+JSON.stringify(query)+", "+JSON.stringify(optsOrCallback)+")")

                collections[collection].findOne(query, optsOrCallback, callback)

            } else {

                console.log(collection+".findOne("+JSON.stringify(query)+")")

                collections[collection].findOne(query, optsOrCallback)

            }

        } else {

            var err = new Error("No collection with name ["+collection+"]")
            if(callback) callback(err, undefined)
            else optsOrCallback(err, undefined)

        }
    }

    /**
     *
     * @param collection the collection name in which to save the object
     * @param query the search query
     * @param options search options
     * @param callback (err, obj)
     */
    this.find = function(collection, query, fields_or_options_or_callback, options_or_callback, callback) {

        if(collections[collection]) {

            if(callback) {

                console.log(collection+".find("+JSON.stringify(query)+", "+JSON.stringify(fields_or_options_or_callback)+", "+JSON.stringify(options_or_callback)+")")

                collections[collection].find(query, fields_or_options_or_callback, options_or_callback).toArray(callback)

            } else if(options_or_callback) {

                console.log(collection+".find("+JSON.stringify(query)+")")

                collections[collection].find(query, fields_or_options_or_callback).toArray(options_or_callback)

            } else {

                console.log(collection+".find("+JSON.stringify(query)+")")

                collections[collection].find(query).toArray(fields_or_options_or_callback)

            }

        } else {

            var err = new Error("No collection with name ["+collection+"]")

            if(callback) callback(err, undefined)
            else optsOrCallback(err, undefined)

        }
    }

    /**
     *
     * @param collection the collection name in which to save the object
     * @param query the search query
     * @param sortOrder order of the matches
     * @param update replacement object
     * @param optsOrCallback search options
     * @param callback (err, obj)
     */
    this.findAndModify = function(collection, query, sortOrder, update, optsOrCallback, callback) {

        if(collections[collection]) {

            if(callback) {

                console.log(collection+".findAndModify("+JSON.stringify(query)+", "+JSON.stringify(optsOrCallback)+")")

                collections[collection].findAndModify(query, sortOrder, update, optsOrCallback, callback)

            } else {

                console.log(collection+".findAndModify("+JSON.stringify(query)+")")

                collections[collection].findAndModify(query, sortOrder, update, optsOrCallback)

            }

        } else {

            var err = new Error("No collection with name ["+collection+"]")

            if(callback) callback(err, undefined)
            else optsOrCallback(err, undefined)

        }
    }
}


//TODO Add indexes

var dbProvider = new Provider(
    config.database.name,
    config.database.host,
    config.database.port,
    config.database.user,
    config.database.password,
    function() {
        var runner = new ParallelRunner()
        runner.add(dbProvider.loadCollection, config.usersCollection, [
            { index: {login: 1}, options: {unique: true} }
        ])
        runner.add(dbProvider.loadCollection, "bugs", [
           // { index: {login: 1}, options: {unique: true} }
        ])
        runner.add(dbProvider.loadCollection, "ideas", [
           // { index: {login: 1}, options: {unique: true} }
        ])
        runner.add(dbProvider.loadCollection, "news", [
          //  { index: {login: 1}, options: {unique: true} }
        ])
        runner.run(function() {
            module.exports.Event.emit('ready')
        })
    })

module.exports = {
    DB:    dbProvider,
    Event: new EventEmitter()
}


