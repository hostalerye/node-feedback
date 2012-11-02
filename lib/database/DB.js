var mongo           = require('mongodb')
var ConfigManager   = require('../config/ConfigManager.js')
var confMgr         = new ConfigManager()
var logger          = require('../util/Logger.js').getLogger("DB")
var EventEmitter    = require('events').EventEmitter
var ParallelRunner  = require('serial').ParallelRunner

Provider = function(name, host, port, user, password, callback) {
    var self = this

    this.db = new mongo.Db(name, new mongo.Server(host, port, {auto_reconnect : true, poolSize : 30}), {native_parser:false})

    this.db.open(function(err) {

        if (err) throw(err)

        self.db.authenticate(user, password, function(err, result) {

            if (err) throw err

            logger.info("authentication: "+result)
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

        logger.info('Loading collection ['+name+']')

        self.db.collection(name, function(err, collection) {

            if (err) throw err

            collections[name] = collection
            logger.info('Collection ['+name+'] loaded')


            if(indexes) {
//                logger.debug(">> Creating indexes on collection ["+name+"]")

                for(var i = 0 ; i < indexes.length ; i++) {

                    collection.ensureIndex(indexes[i].index, indexes[i].options, function(err, indexName) {

                        if (err) throw err

                        logger.debug("Created index [" + indexName + "] on collection ["+name+"]")

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

            logger.debug(collection+".update("+JSON.stringify(selector)+", "+JSON.stringify(document)+", "+JSON.stringify(optionsOrCallback)+")")


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

            logger.debug(collection+".save("+JSON.stringify(document)+", {safe: true})")


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

                logger.debug(collection+".findOne("+JSON.stringify(query)+", "+JSON.stringify(optsOrCallback)+")")

                collections[collection].findOne(query, optsOrCallback, callback)

            } else {

                logger.debug(collection+".findOne("+JSON.stringify(query)+")")

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

                logger.debug(collection+".find("+JSON.stringify(query)+", "+JSON.stringify(fields_or_options_or_callback)+", "+JSON.stringify(options_or_callback)+")")

                collections[collection].find(query, fields_or_options_or_callback, options_or_callback).toArray(callback)

            } else if(options_or_callback) {

                logger.debug(collection+".find("+JSON.stringify(query)+")")

                collections[collection].find(query, fields_or_options_or_callback).toArray(options_or_callback)

            } else {

                logger.debug(collection+".find("+JSON.stringify(query)+")")

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

               logger.debug(collection+".findAndModify("+JSON.stringify(query)+", "+JSON.stringify(optsOrCallback)+")")

               collections[collection].findAndModify(query, sortOrder, update, optsOrCallback, callback)

           } else {

               logger.debug(collection+".findAndModify("+JSON.stringify(query)+")")

               collections[collection].findAndModify(query, sortOrder, update, optsOrCallback)

           }

       } else {

           var err = new Error("No collection with name ["+collection+"]")

           if(callback) callback(err, undefined)
           else optsOrCallback(err, undefined)

       }
   }
}


/* User
    {
        plan: {
            name: 'micro',
            collaborators: 1,
            space: 614400,
            private_repos: 5
        },
        gravatar_id: '93e1240529de2f0a28ae50d814204b9a',
        company: 'Goellan',
        name: 'Nicolas Herment',
        created_at: '2011/09/10 14:49:14 -0700',
        location: 'Paris, France',
        disk_usage: 5228,
        collaborators: 0,
        public_repo_count: 9,
        public_gist_count: 5,
        blog: '',
        following_count: 0,
        id: 1041426,
        owned_private_repo_count: 4,
        private_gist_count: 0,
        type: 'User',
        permission: null,
        total_private_repo_count: 4,
        followers_count: 2,
        login: 'nherment',
        email: '',
        emails: []
    }
 *
 */


var dbProvider = new Provider(confMgr.getConfig("database.name"),
                              confMgr.getConfig("database.host"),
                              confMgr.getConfig("database.port"),
                              confMgr.getConfig("database.user"),
                              confMgr.getConfig("database.password"),
                              function() {

                                  var runner = new ParallelRunner()

                                  runner.add(dbProvider.loadCollection, 'users', [
                                      { index: {login: 1}, options: {unique: true} }
                                  ])

                                  runner.add(dbProvider.loadCollection, 'repositories', [
                                      { index: {'owner.login': 1, name:1}, options: {unique: true} }
                                  ])

                                  runner.add(dbProvider.loadCollection, 'buildjobs', [
                                      { index: {commitSha: 1, user: 1, repository: 1}, options: {unique: true} }
                                  ])

                                  runner.add(dbProvider.loadCollection, 'work_queue', [
                                      { index: {commitSha: 1, user: 1}, options: {unique: false} }
                                  ])

                                  runner.add(dbProvider.loadCollection, 'work_queue_archive', [
                                      { index: {commitSha: 1, user: 1}, options: {unique: false} }
                                  ])

                                  runner.add(dbProvider.loadCollection, 'commit', [
                                      { index: {owner: 1, repoName: 1, sha: 1}, options: {unique: true} }
                                  ])

                                  runner.add(dbProvider.loadCollection, 'ssh', [
                                      { index: {'repository.owner': 1, 'repository.name': 1}, options: {unique: true} }
                                  ])

                                  runner.run(function() {

                                      module.exports.Event.emit('ready')

                                  })

                              })

module.exports = {
        DB:    dbProvider,
    c: {
            Repository: {
                Status: {
                    INSTALLING          : "Installing",
                    INSTALLED           : "Installed",
                    INSTALLATION_FAILED : "Installation Failed",
                    UNINSTALL_FAILED    : "Uninstall Failed",
                    SCHEDULED           : "Scheduled",
                    TESTING             : "Testing",
                    TESTED              : "Tested",
                    SSH_ERROR           : "Permission denied (publicKey)",
                    SYNC_FAILED         : "Synchronization with remote repository failed",
                    DEPENDENCIES_ERROR  : "Error while installing dependencies",
                    SSH_KEY_ERROR       : "Invalid SSH Key",
                    VIOLATIONS          : "Violations",
                    TESTS_FAILED        : "Tests Failed",
                    NOT_ALLOWED         : "Need a subsciption to run tests"
                }
            },
            Commit: {
                Status: {
                    SCHEDULED           : "Scheduled",
                    TESTING             : "Testing",
                    TESTED              : "Tested",
                    SSH_ERROR           : "Permission denied (publicKey)",
                    SYNC_FAILED         : "Synchronization with remote repository failed",
                    DEPENDENCIES_ERROR  : "Error while installing dependencies",
                    SSH_KEY_ERROR       : "Invalid SSH Key",
                    VIOLATIONS          : "Violations",
                    TESTS_FAILED        : "Tests Failed",
                    NOT_ALLOWED         : "Need a subsciption to run tests"
                }
            }
        },
    Event: new EventEmitter()
}


