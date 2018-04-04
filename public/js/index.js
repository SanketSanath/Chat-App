var socket= io();
socket.on('connect', function(){
	console.log('connected from server');
});

socket.on('disconnect', function(){
	console.log('disconnected from server');
});

socket.on('newMessage', function(msg){
	console.log(msg);
});