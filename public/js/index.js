var socket= io();
socket.on('connect', function(){
	console.log('connected from server');
});

socket.on('disconnect', function(){
	console.log('disconnected from server');
});

socket.on('newMessage', function(msg){
	console.log(msg);
	var message= document.createElement("li");
	message.innerHTML= msg.from+": "+msg.text;
	document.getElementById('messages').appendChild(message);
});

document.querySelector('button').addEventListener("click",function(event){
	event.preventDefault();
	emit_createMessage();
});

function emit_createMessage(){
	socket.emit('createMessage', {
		from: 'user',
		text: document.getElementById('message').value,
		createdAt: new Date().getTime()
	});
}
