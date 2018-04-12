const http= require('http');
const path= require('path');
const express= require('express');
const socketIO= require('socket.io');

const {generateMessage}= require('./utils/message.js');
const {isRealString}= require('./utils/isRealString.js');
const {Users}= require('./utils/users.js');

const port= process.env.PORT || 3000;
const publicPath= path.join(__dirname, '../public');
const app= new express();
var server= http.createServer(app);
var io= socketIO(server);
var users= new Users();

app.use(express.static(publicPath));


io.on('connection', function(socket){
	console.log('new user');

	socket.on('createMessage', function(msg){
		console.log(msg);
		socket.broadcast.emit('newMessage', generateMessage(msg.from, msg.text, msg.type));
	});

	socket.on('join', function(params, callback){
		if(!isRealString(params.name) || !isRealString(params.room)){
			return callback('Name and Room name are required.');
		}
		
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updatePeople', users.getUserList(params.room));

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app', 'message'));
		socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined`, 'message'));
		callback();

	});

	socket.on('disconnect', function(){
		var user= users.removeUser(socket.id);

		if(user){
			io.to(user.room).emit('updatePeople', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left the room`, 'message'));
		}
		console.log('user disconnected');
	});
});

server.listen(port, function(){
	console.log(`server is up on port ${port}`);
});