const http= require('http');
const path= require('path');
const express= require('express');
const socketIO= require('socket.io');

const port= process.env.PORT || 3000;
const publicPath= path.join(__dirname, '../public');
const app= new express();
var server= http.createServer(app);
var io= socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
	console.log('new user');
	socket.on('disconnect', ()=>{
		console.log('user disconnected');
	});
});

server.listen(port, ()=>{
	console.log(`server is up on port ${port}`);
});