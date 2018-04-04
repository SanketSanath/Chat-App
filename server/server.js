const http= require('http');
const path= require('path');
const express= require('express');
const socketIO= require('socket.io');

const {generateMessage}= require('./utils/message.js');
const port= process.env.PORT || 3000;
const publicPath= path.join(__dirname, '../public');
const app= new express();
var server= http.createServer(app);
var io= socketIO(server);

app.use(express.static(publicPath));

io.on('connection', function(socket){
	console.log('new user');
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));
	
	socket.on('createMessage', function(msg){
		console.log(msg);
		io.emit('newMessage', generateMessage(msg.from, msg.text));
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

server.listen(port, function(){
	console.log(`server is up on port ${port}`);
});