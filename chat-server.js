var express = require('express'),
    http = require('http');

var WebSocketServer = require('websocket').server;
var server = http.createServer(function (req, res) {
    // Nothing to do
});

server.listen(3000, function() {
    console.log((new Date()) + ' Server is listening on port 3000');
});

var clients = [];
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    connection.on('message', function(message) {
        if (message) {
            var data = JSON.parse(message.utf8Data);
            var type = data.type;

            switch(type){
                case 'open':
                    var user_id = data.user_id;
                    var chat_msg = '';
                    connection.sendUTF(JSON.stringify({
                        type    :type, 
                        msg     :chat_msg,
                        user_id :user_id,
                        is_it_me:true
                    }));

                    clients.forEach(function(client){
                        if(connection !== client){
                            client.sendUTF(JSON.stringify({
                                type    :type, 
                                msg     :chat_msg,
                                user_id :user_id,
                                is_it_me:false
                            }));
                        }
                    });
            
                    break;
                case 'chat':
                    var user_id = data.user_id;
                    var chat_msg = data.chat_msg;
                    connection.sendUTF(JSON.stringify({
                        type    :type, 
                        msg     :chat_msg,
                        user_id :user_id,
                        is_it_me:true
                    }));

                    clients.forEach(function(client){
                        if(connection !== client){
                            client.sendUTF(JSON.stringify({
                                type    :type, 
                                msg     :chat_msg,
                                user_id :user_id,
                                is_it_me:false
                            }));
                        }
                    });
                    
                    break;
            }
        }
    });

    connection.on('close', function(connection) {
        // console.log(connection);
    });
});