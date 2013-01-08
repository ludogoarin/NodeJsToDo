

// client
var mongo = require('mongodb')
  , mongoClient = mongo.MongoClient
  , _ = require('underscore')._;

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('nodejstodo', server, {safe: true});

module.exports = TaskList;

function TaskList(connection) {
  //mongoClient.connect(connection, function(err, db) {
  //  if(err){ 
  //    console.log(err);
  //  } else {
      console.log('opened db connection');
      db.createCollection('tasks', function(err, collection) {});
  //  }
  //});
}

TaskList.prototype = {

  list: function(req, res) {
    var taskCollection = db.collection('tasks');
    //var items = taskCollection.find({}, {'sort':[['itemName', 1]]}).items;

    taskCollection.find({}, {'sort':[['itemName', 1]]}).toArray(function(err, items) {

      console.log("===================================================================================");        
      console.log(">> Items ordered by name ascending");        
      console.log("==================================================================================="); 

      res.render('tasks',{title: 'My ToDo List', tasks: items, activetab: 'tasks'})    
    });

    // close connection
    db.close();
  },

  add: function(req,res) {
    var item = req.body.item;
    var newTask = {
      itemName: item.name,
      itemCategory: item.category,
      itemCompleted: false,
      itemDate: new Date()
    };

    console.log("===================================================================================");        
    console.log(">> Add new item");        
    console.log("==================================================================================="); 

    var taskCollection = db.collection('tasks');
    taskCollection.insert(newTask, {w:1}, function(err, result) {});
    
    // close connection
    db.close();

    // redirect user
    res.redirect('/tasks');
  },

  complete: function(req,res) {
    var completedTasks = req.body.completedids;
    var allTasks = req.body.taskids;
    var taskCollection = db.collection('tasks');

    console.log("===================================================================================");        
    console.log(">> Update item to 'completed'");        
    console.log("==================================================================================="); 
    console.log(req.body);
    console.log('completedTasks: ' + completedTasks);
    console.log("==================================================================================="); 


    _.each(allTasks, function(taskId, i, list){
      var o_id = new BSON.ObjectID(taskId);
      var isCompleted = completedTasks == taskId || _.contains(completedTasks, taskId);
      console.log('list: ' + list);
      console.log('i: ' + i);
      console.log('isCompleted: ' + isCompleted);
      console.log('taskId: ' + taskId);
      console.log("==================================================================================="); 

      var conditions = { _id: o_id };
      var updates = { itemCompleted: isCompleted };

      taskCollection.update(conditions, { $set:updates }, {w:1}, function (err, result) {
        if(err) {
          throw err;
        }
        console.log('result: ' + result);
      });
    });
    
    // close connection
    db.close();

    // redirect user
    res.redirect('/tasks');
  }
}