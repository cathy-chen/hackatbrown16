
var w_nodes = [];

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
		if (contains(w_nodes, clientout[1])) {
			var parents = get_parents(w_nodes, clientout);
			if (!contains(parents, clientout[2])) {
				newConnect(clientout[1], clientout[2]);

			}
		}

		// [1] is from (child), [2] is to (parent)

	}
	else if (clientout[0] == 'increment') {
		increment(clientout[1]);
	}
	else {
		console.log('error');
	}
}


function newNode(name) {
	// Creates a new node
	console.log('node', name);
}

function newConnect(from,to) {
	// Creates a new connection
	console.log('newConnect', from, to);
}

function increment(name){
	//changes the mass of a node
	console.log('node', name);
}

parse(['newvertex','pizza'])
parse(['newvertex','pizza'])
parse(['newvertex','pasta'])
parse(['newvertex','corn'])
parse(['newedge','pizza','pasta'])