var socket= io();
var name= get('name');

socket.on('connect', function(){
	// console.log('connected from server');
	var params= {
		name: get('name'),
		room: get('room'),
	};

	socket.emit('join', params, function(err){
		if(err){
			alert(err);
			window.location.href="/";
		} else {
			
		}
	});
});

socket.on('updatePeople', (users)=>{
	// console.log(users);
	var ol= document.createElement('ol');
	users.forEach(function(user){
		var li= document.createElement('li');
		li.innerText= user;
		ol.appendChild(li);
	});
	var users= document.getElementById('users');

	try{
		users.removeChild(users.firstChild); 
	} catch(e){
		// console.log(e);
	}
	// users.innerHTML= ol;
	users.appendChild(ol);
});

socket.on('disconnect', function(){
	console.log('disconnected from server');
});

socket.on('newMessage', function(msg){
	var style= {
		primary: '#f4f4f4',
		text: '#000',
		title: '#6b6b6b',
		float: 'left'
	}
	append_msg(msg, style);
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
			from: name,
			text,
			createdAt: new Date().getTime(),
			type
		};
		
		socket.emit('createMessage', msg);
		//change name for your browser
		msg.from= 'You';
		var style= {
			primary: '#4874ba',
			text: '#e8f8f9',
			title: '#d9fafc',
			float: 'right'
		}
		append_msg(msg, style);

		document.getElementById('message').value= '';
}

//append message
function append_msg(msg, style){

	var template, html;
	 if(msg.type==='message'){
		template= document.getElementById('message_template').textContent;

		html= ejs.render(template,{
			text: msg.text,
			from: msg.from,
			createdAt: moment(msg.createdAt).format('HH:mm a'),
			col_bg: style.primary,
			col_title: style.title,
			col_text: style.text,
			float: style.float
		});
	}
	else if(msg.type==="location"){
		template= document.getElementById('location_template').textContent;
		
		html= ejs.render(template,{
			text: 'My Location',
			url: msg.text,
			from: msg.from,
			createdAt: moment(msg.createdAt).format('HH:mm a'),
			col_bg: col.primary,
			col_title: style.title,
			col_text: style.text,
			float: style.float
		});
	}

	document.getElementById('messages').insertAdjacentHTML('beforeend', html);
	scrollToBottom();
}


function scrollToBottom(){
	//Selectors
	var messages= document.querySelector("#messages");
	var newMessage= messages.lastElementChild;

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
		newMessage.scrollIntoView();
	}
}


//url decode

function get(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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

