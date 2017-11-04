var selectedRoom = 1;
var userId = 0;
var messages = [];

var roomList = new Vue({
  el: '#rooms',
  data: {
    rooms: 'Hello Vue!',
    roomName: ''
  },
  methods: {
    createRoom: function () {
    	if (this.roomName != '' && getNamesFromObjectArray(this.rooms, 'name').indexOf(this.roomName) == -1) {
			$.ajax({
			   url: 'http://localhost:5000/rooms',
			   data: {
			      name: this.roomName
			   },
			   error: function(e) {
			   		console.log("ERROR:")
			   		console.log(e);
			   },
			   success: function() {
				console.log('Room created.');
				updateRoomList();
			   },
			   dataType: 'json',
			   type: 'POST'
			});
    	}
    }
  }
});

var userList = new Vue({
  el: '#users',
  data: {
    users: 'Hello Vue!'
  }
});

Vue.component('roomlist-room', {
  props: ['id', 'name'],
  template: '<li v-on:click="changeRoom">{{ name }}</li>',
  methods: {
  	changeRoom: function() {
  		selectedRoom = this.id;
  		leaveRoom();
  		joinRoom();
  	}
  }
})

var messages = new Vue({
	el: '#messages',
	data: {
		message: '',
		messages: []
	},
	methods: {
		sendMessage: function() {
			sendMessageAPI(selectedRoom, userId, this.message);
			updateMessages();
			this.message = '';
		}
	}
})

var updateRoomList = function() {
	$.ajax({
		url: 'http://localhost:5000/rooms',
		type: 'GET',
		dataType: 'json',
		success: function(res) {
	  		roomList.rooms = res.data.rooms;
			console.log(roomList.rooms);
		}
	});
};

var updateUserList = function() {
	$.ajax({
		url: 'http://localhost:5000/users/' + selectedRoom,
		type: 'GET',
		dataType: 'json',
		success: function(res) {
			console.log(res);
	  		userList.users = res.data.users;
		}
	});
};

var leaveRoom = function() {
	$.ajax({
		url: 'http://localhost:5000/rooms/' + selectedRoom + '/users',
		type: 'DELETE',
		dataType: 'json',
		data: {
			user_id: userId
		},
		success: function(res) {
			console.log(res);
	  		updateMessages();
		}
	});
}

var joinRoom = function() {
	$.ajax({
		url: 'http://localhost:5000/rooms/' + selectedRoom + '/users',
		type: 'POST',
		dataType: 'json',
		data: {
			user_id: userId
		},
		success: function(res) {
	  		updateMessages();
		}
	});	
}

var updateMessages = function() {
	$.ajax({
		url: 'http://localhost:5000/chats/' + selectedRoom,
		type: 'GET',
		dataType: 'json',
		success: function(res) {
			console.log(res);
	  		messages.messages = res.data.messages;
		}
	});
}

var createUser = function() {
	$.ajax({
		url: 'http://localhost:5000/users',
		type: 'POST',
		data: {
			name: 'jonas'
		},
		dataType: 'json',
		success: function(res) {
			console.log(res);
			userId = res.id;
		}
	});
}

var sendMessageAPI = function(roomId, userId, message) {
	$.ajax({
		url: 'http://localhost:5000/chats/' + roomId,
		type: 'POST',
		data: {
			user_id: userId,
			message: message
		},
		dataType: 'json',
		success: function(res) {
			console.log("message sent");
		}
	});
}

updateUserList();
updateRoomList();
createUser();
updateMessages();

var getNamesFromObjectArray = function(array, attribute) {
	var attributeArray = [];
	for (entry of array) {
  		attributeArray.push(entry[attribute]);
	}
	return attributeArray;
}