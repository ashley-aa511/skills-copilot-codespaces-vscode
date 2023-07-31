// Create web server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 8080;
var io = require('socket.io')(server);
var fs = require('fs');

// Create web server
server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

// Set up Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routing
app.get('/', function(req, res) {
  res.render('index');
});

// Socket.IO
io.on('connection', function(socket) {
  // Load previous comments
  fs.readFile('comments.json', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var comments = JSON.parse(data);
      socket.emit('load comments', comments);
    }
  });

  // Listen to a new comment
  socket.on('new comment', function(comment) {
    // Save a new comment
    fs.readFile('comments.json', 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        var comments = JSON.parse(data);
        comments.push(comment);
        fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
          if (err) {
            console.log(err);
          } else {
            io.emit('new comment', comment);
          }
        });
      }
    });
  });
});
