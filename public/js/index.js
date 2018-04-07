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

	var text= document.getElementById('message').value.trim();
	if(text){
		//call function
		emit_msg(text, 'message');
	}
});

var send_location= document.querySelector('#send_location');
send_location.addEventListener('click', function(event){
	event.preventDefault();
	if(!navigator.geolocation){
		return alert('Geolocation is not supported by your browser');
	}

	send_location.innerHTML= "Sending location...";
	send_location.disabled= true;
	
	navigator.geolocation.getCurrentPosition(function(position){
		send_location.disabled= false;
		send_location.innerHTML= 'Send location';
		var text= `https://www.google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}`;
		emit_msg(text, 'location');
	}, function(){
		send_location.disabled= false;
		send_location.innerHTML= 'Send location';
		alert('Unable to fetch location. Try changing http connection to https connection.');
	}); 
});


//call message emmiter
function emit_msg(text, type){
	var msg= {
			from: 'User',
			text,
			createdAt: new Date().getTime(),
			type
		};
		
		socket.emit('createMessage', msg);
		//change name for your browser
		msg.from= 'You';
		var col= {
			primary: '#4874ba',
			text: '#fff'
		}
		append_msg(msg, col);

		document.getElementById('message').value= '';
}

//append message
function append_msg(msg, col){
	// message.style.color= col.text;
	// message.style.background= col.primary;
	// //set color of </a> tags
	// document.getElementById('messages').appendChild(message);
	var template, html;
	 if(msg.type==='message'){
		template= document.getElementById('message_template').textContent;

		html= ejs.render(template,{
			text: msg.text,
			from: msg.from,
			createdAt: moment(msg.createdAt).format('HH:mm a')
		});
	}
	else if(msg.type==="location"){
		template= document.getElementById('location_template').textContent;
		
		html= ejs.render(template,{
			text: 'My Location',
			url: msg.text,
			from: msg.from,
			createdAt: moment(msg.createdAt).format('HH:mm a')
		});
	}

	document.getElementById('messages').insertAdjacentHTML('beforeend', html);
	scrollToBottom();
}


function scrollToBottom(){
	//Selectors
	var messages= document.querySelector("ol");
	var newMessage= document.querySelector('ol').lastElementChild;

	//Heights
	var clientHeight= messages.clientHeight;
	var scrollTop= messages.scrollTop;
	var scrollHeight= messages.scrollHeight;
	var newMessageHeight= newMessage.offsetHeight;
	var lastMessageHeight=0;

	if(newMessage.previousElementSibling){
		lastMessageHeight= newMessage.previousElementSibling.offsetHeight;
	}

	if(clientHeight+ scrollTop+ newMessageHeight+ lastMessageHeight>= scrollHeight){
		console.log('should scroll');
		newMessage.scrollIntoView();
	}
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

