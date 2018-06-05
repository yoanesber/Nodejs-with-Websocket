<H2>Node Js Websocket</H2>

<p>
This simple project aims to develop a simple chat application using Node Js programming language that implement Websocket. The chat will accept all incoming messages and deliver that message to all other connections.
</p>

<p>

## Preparing application
You only need to do these once for all.
1. Make a folder for your application using command prompt:

   ```
   >> cd E:\
   >> E:>mkdir Nodejs_Websocket
   >> E:>cd Nodejs_Websocket
   >> E:\Nodejs_Websocket>
   ```

2. Create `package.json` file by running this script:

   ```
   >> E:\Nodejs_Websocket>npm init
   ```

3. Install `express` framework:

   ```
   >> E:\Nodejs_Websocket>npm install express --save

   (https://www.npmjs.com/package/express)
   ```

4. Install `websocket` :

   ```
   >> E:\Nodejs_Websocket>npm install websocket --save

   (https://www.npmjs.com/package/websocket)
   ```

5. Install `bootstrap` :

   ```
   >> E:\Nodejs_Websocket>npm install bootstrap --save

   (https://www.npmjs.com/package/bootstrap)
   ```

6. Next, we're going to create script/file will call from the command line to launch our application:

   ```
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
   ```

Above, you'll see we create an script/file as websocket server that listening for any incoming requests on port 3000. Save this script as `chat-server.js`.

6. Now, we're going to create chat interface and save this as `views/chat.ejs`:

   ```
   <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="/assets/bootstrap/dist/css/bootstrap.css">
        <title>Chat Apps</title>
    </head>
    <body>
        <main role="main">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div id="chat_output"></div>
                        <textarea class="form-control" id="chat_input" placeholder="Tekan <Enter> untuk mengirim pesan"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>

    <script src="https://code.jquery.com/jquery-1.11.3.js" type="text/javascript"></script>
    <script src="/assets/bootstrap/dist/js/bootstrap.js" type="text/javascript"></script>
    <script type="text/javascript">
    jQuery(function($){
        var websocket_server = new WebSocket("ws://localhost:3000/");
        websocket_server.onopen = function(e) {
            websocket_server.send(
                JSON.stringify({
                    'type':'open',
                    'user_id':'<%=user_id%>',
                    'chat_msg':''
                })
            );
        };
        
        websocket_server.onerror = function(e) {
            var json = JSON.parse(e.data);
            switch(json.type) {
                case 'open':
                    if(!json.is_it_me){
                        var new_user = $("<div>New user <a href='#' class='alert-link'>"+ json.user_id +"</a> just joined in this chat room, but there's something problem in it.</div>").addClass('alert alert-danger');
                        $('#chat_output').append(new_user);
                    }
                    else{
                        var my_user = $("<div>You just joined in this chat room, but there's something problem in it.</div>").addClass('alert alert-danger');
                        $('#chat_output').append(my_user);
                    }
                    break;
                case 'chat':
                    if(!json.is_it_me){
                        var new_chat = $("<div>There's something problem in sending the chat.</div>").addClass('alert alert-danger');
                        $('#chat_output').append(new_chat);
                    }
                    else{
                        var my_chat = $("<div>There's something problem in sending the chat.</div>").addClass('alert alert-danger');
                        $('#chat_output').append(my_chat);
                    }
                    break;
            }
        }
        websocket_server.onmessage = function(e){
            var json = JSON.parse(e.data);
            switch(json.type) {
                case 'open':
                    if(!json.is_it_me){
                        var new_user = $("<div>New user <a href='#' class='alert-link'>"+ json.user_id +"</a> just joined in this chat room.</div>").addClass('col-8 alert alert-secondary');
                        var div_right = $("<div class='col-4'>&nbsp;</div>");
                        var div_row = $("<div class='row'></div>").append(new_user).append(div_right);
                        $('#chat_output').append(div_row);
                    }
                    else{
                        var div_left = $("<div class='col-4'>&nbsp;</div>");
                        var my_user = $("<div>You just joined in this chat room.</div>").addClass('col-8 alert alert-primary');
                        var div_row = $("<div class='row'></div>").append(div_left).append(my_user);
                        $('#chat_output').append(div_row);
                    }
                    break;
                case 'chat':
                    if(!json.is_it_me){
                        var new_chat = $("<div><b><u>"+ json.user_id +" says:</u></b><br/>"+ json.msg +"</div>").addClass('col-6 alert alert-secondary');
                        var div_right = $("<div class='col-6'>&nbsp;</div>");
                        var div_row = $("<div class='row'></div>").append(new_chat).append(div_right);
                        $('#chat_output').append(div_row);
                    }
                    else{
                        var div_left = $("<div class='col-6'>&nbsp;</div>");
                        var my_chat = $("<div><b><u>You says:</u></b><br/>"+ json.msg +"</div>").addClass('col-6 alert alert-primary');
                        var div_row = $("<div class='row'></div>").append(div_left).append(my_chat);
                        $('#chat_output').append(div_row);
                    }
                    break;
            }
        }
        
        $('#chat_input').on('keyup',function(e){
            if(e.keyCode==13 && !e.shiftKey){
                var chat_msg = $(this).val();
                websocket_server.send(
                    JSON.stringify({
                        'type':'chat',
                        'user_id':'<%=user_id%>',
                        'chat_msg':chat_msg
                    })
                );
                $(this).val('');
            }
        });
    });
    </script>
   ```

7. Run the websocket server with the following command in your terminal:

   ```
   >> E:\Nodejs_Websocket>node chat-server
   ```

8. Now, we can run the interface server with the following command in your terminal:

   ```
   >> E:\Nodejs_Websocket>node index
   ```

9. And run `http://localhost:1337/` on your browser as user1 and open `http://localhost:1337/` on your other browser as user2. You'll see we've created chat apps for multi users.