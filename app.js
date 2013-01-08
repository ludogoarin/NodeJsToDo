
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express()
  , server = require('http').createServer(app);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var mongoConnection = 'mongodb://localusr:localpwd@localhost:27017/nodejstodo';

app.get('/', routes.index);

// tasklist test app
var TaskList = require('./routes/tasklist');
var taskList = new TaskList(mongoConnection);

app.get('/tasks', taskList.list.bind(taskList));
app.post('/tasks/add', taskList.add.bind(taskList));
app.post('/tasks/complete', taskList.complete.bind(taskList));

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});