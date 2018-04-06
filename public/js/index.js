var socket= io();
socket.on('connect', function(){
	console.log('connected from server');
});

socket.on('disconnect', function(){
	console.log('disconnected from server');
});

socket.on('newMessage', function(msg){
	var col= {
		primary: '#fff',
		text: '#000'
	}
	append_msg(msg, col);
	notifyMe();
});

document.querySelector('#submit').addEventListener("click",function(event){
	event.preventDefault();

	var text= document.getElementById('message').value;
	if(text){
		//call function
		emit_msg(text);
	}
});

document.querySelector('#send_location').addEventListener('click', function(event){
	event.preventDefault();
	if(!navigator.geolocation){
		return alert('Geolocation is not supported by your browser');
	}

	navigator.geolocation.getCurrentPosition(function(position){
		var text= `<a target="_blank" href="https://www.google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}">My Current Location</a>`;
		emit_msg(text);
	}, function(){
		alert('Unable to fetch location');
	}); 
});


//call message emmiter
function emit_msg(text){
	var msg= {
			from: 'User',
			text: text,
			createdAt: new Date().getTime()
		};
		
		socket.emit('createMessage', msg);
		//change name for your browser
		msg.from= 'You';
		var col= {
			primary: '#5c6bc0',
			text: '#fff'
		}
		append_msg(msg, col);

		document.getElementById('message').value= '';
}

//append message
function append_msg(msg, col){
	var message= document.createElement("li");
	message.innerHTML= msg.from+": "+msg.text;
	message.style.color= col.text;
	message.style.background= col.primary;
	//set color of </a> tags
	document.getElementById('messages').appendChild(message);
}

//notification
function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
        var options = {
                body: "New Message!",
                dir : "ltr"
             };
          var notification = new Notification("Hi there",options);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    
      if (permission === "granted") {
        var options = {
              body: "New Message!",
              dir : "ltr"
          };
        var notification = new Notification("Hi there",options);
      }
    });
  }
}