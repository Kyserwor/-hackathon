var selectedRoom = 1;
var userId = 0;

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

updateRoomList();

var userList = new Vue({
  el: '#users',
  data: {
    users: 'Hello Vue!'
  }
});

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

var getNamesFromObjectArray = function(array, attribute) {
	var attributeArray = [];
	for (entry of array) {
  		attributeArray.push(entry[attribute]);
	}
	return attributeArray;
}

updateUserList();

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

var messages = [];

var messages = new Vue({
	el: '#messages',
	data: {
		messages: []
	}
})

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

createUser();

updateMessages();