
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.issues = function(req, res){
  res.render('issues', { title: 'Express issues' })
};

exports.issue = function(req, res){
  res.render('issue', { title: 'Issue title' })
};
