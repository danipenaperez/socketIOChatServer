var express = require('express');
var cors = require('cors');
var router = express.Router();
var app = express();
app.use(cors());
var port = 3001;//config.get('Socketio.port');
//var port_ssl = config.get('Socketio.port_ssl');

//Enable CORS
//express.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});


//Init socketIO Websocket Servers
var httpServer = require('http').createServer(express);
var httpio = require('socket.io')(httpServer);
httpServer.listen(port, function () {
    console.log('Socketio Websocket Server listening on *:' + port);
});

/**
* Main Entrance for socket connections
**/
httpio.on('connection', function (socket) {
	console.log("New socket on server");
    socket.on("subscribe", function (data) {
        console.log("subscribed for chatRoom "+data);
        addSocket(data, socket);

        shareMessage({
				        event: 'NewUser',
					    chatRoom: data,
					    content:'new user joined'
	    });
    });

    socket.on("disconnect", function (data) {
		console.log(data);
        //TODO: arreglar esto
        //deleteSocket(chatRoom, socket);
    });
});




/**
* Publish a message on chatRoom. 
*/
router.get('/', function(req, res, next) {
  var chatRoomId = req.params.chatRoomId;
  res.send(JSON.stringify(socketConnections));
});

/**
* Publish a message on chatRoom. 
*/
router.post('/:chatRoomId', publishMessage);






//Socket Maps
var socketConnections = {};
/**
* Add websocket subscription to the map list
**/
function addSocket(chatRoom, socket) {
    if (!socketConnections.hasOwnProperty(chatRoom)) {
        socketConnections[chatRoom] = [];
    }
    if (socketConnections[chatRoom].indexOf(socket.id) == -1) {
        socketConnections[chatRoom].push(socket.id);
		console.log("Current chat persons "+ socketConnections[chatRoom].length);
    }
}

/**
* Delete websocket subscription to the map list
**/
function deleteSocket(chatRoom, socketId) {
    if (socketConnections.hasOwnProperty(chatRoom)) {
        var chatRoomSocketsArray = socketConnections[chatRoom];

        var socketIndex = chatRoomSocketsArray.indexOf(socketId);

        if (socketIndex != -1) {
            chatRoomSocketsArray.splice(socketIndex, 1);
        }
		console.log("Current chat persons "+ socketConnections[chatRoom].length);
    }
}
/**
* Receive a HTTP request that contains a Device Event.
* Look for all websockets listener for the chatRoom and publish on it 
* the received event. This service not cache any event so the event is forwarded and then lost.
*/
function publishMessage(req, res) {
    var data = req.body;
    
    shareMessage (data);
	
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end();
}

function shareMessage(data){
	var activeSockets = [];
	var eventName = data.event;
    var chatRoom = data.chatRoom;
	console.log("Received event for " + chatRoom+ " and eventInfo ->" + JSON.stringify(data));
	if (socketConnections[chatRoom]) {
        var chatRoomSocketsArray = socketConnections[chatRoom];
        for (var i = 0; i < chatRoomSocketsArray.length; i++) {
            var socketToSend = [];

            if(httpio.sockets.connected[chatRoomSocketsArray[i]]){
                socketToSend.push(httpio.sockets.connected[chatRoomSocketsArray[i]]);
            }
            //if(httpio2.sockets.connected[chatRoomSocketsArray[i]]){
             //   socketToSend.push(httpio2.sockets.connected[chatRoomSocketsArray[i]]);
            //}
            
			for(var j = 0; j< socketToSend.length; j++){
                socketToSend[j].emit(eventName, data);
				activeSockets.push(socketToSend[j].id);
            }
        }
        socketConnections[chatRoom] = activeSockets;
    }else{
      console.log("Not exist an active subscriptor for this device "+ chatRoom+ " , event lost.");
    }
}

module.exports = router;