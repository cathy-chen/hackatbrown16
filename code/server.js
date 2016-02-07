// var app = require('express')();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


var w_nodes = [];
w_nodes.push(['a', []]);
w_nodes.push(['f', []]);

function contains(a, obj) {
	if (a.length != 0) {
	    for (var i = 0; i < a.length; i++) {
	        if ((a[i])[0] === obj) {
	            return true;
	        }
	    }
	    return false;
	}
	else false;
}

function get_parents(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if ((a[i])[0] === obj) {
            return (a[i])[1];
        }
    }
    return false;
}

function parse(clientout) {
	// Takes in a list from server of format [action, node, node or null]
	if (clientout[0] == 'newvertex') {
		var a = contains(w_nodes, clientout[1]);
		if (!a) {
			newNode(clientout[1]);
			w_nodes.push([clientout[1],[]]);
		}
	}
	else if (clientout[0] == 'newedge') {
		console.log("Parse: we are in newedge")

		console.log(w_nodes)
		if (contains(w_nodes, clientout[1])) {
			console.log("1")

			var parents = get_parents(w_nodes, clientout[1]);
			if ((!contains(parents, clientout[2])) && (contains(w_nodes, clientout[2]))) {
				console.log("2")
				newConnect(clientout[1], clientout[2]);

			}
		}
		// [1] is from (child), [2] is to (parent)

	}
	else if (clientout[0] == 'increment') {
		increment(clientout[1]);
		console.log("we win", clientout[1])
	}
	else {
		console.log('error');
	}
}


function newNode(name) {
	// Creates a new node
	console.log('node', name);
    io.emit('data', ['newvertex', name], { will: 'be received by everyone'});
    console.log('I should be sending ', ['newnode', name]);
}

function newConnect(from,to) {
	// Creates a new connection
	console.log('newConnect', from, to);
    io.emit('data', ['newedge', from, to], { will: 'be received by everyone'});
    console.log('I should be sending ', ['increment', from, to]);
}

function increment(name){
	//changes the mass of a node
	console.log('are we here yet', name);
    	io.emit('data', ['increment', name], { will: 'be received by everyone'});
    	console.log('I should be sending ', ['increment', name]);
}

/*
parse(['newvertex','pizza'])
parse(['newvertex','pizza'])
parse(['newvertex','pasta'])
parse(['newvertex','corn'])
parse(['newedge','pizza','pasta'])
parse(['increment','pizza'])*/

io.on('connection', function(socket){
  socket.on('input', function(msg) {
    parse(msg);
    console.log('Please ', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
