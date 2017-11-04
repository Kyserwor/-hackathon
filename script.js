var app = new Vue({
  el: '#rooms',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    createRoom: function () {
		$.ajax({
		   url: 'http://localhost:5000/rooms',
		   data: {
		      name: 'test'
		   },
		   error: function(e) {
		   		console.log("ERROR:")
		   		console.log(e);
		   },
		   dataType: 'json',
		   type: 'POST'
		});
    }
  }
})

function reqListener () {
  console.log(this.responseText);
  var res = JSON.parse(this.responseText)
  console.log(res);
  app.message = res.data;
}

var oReq = new XMLHttpRequest();
oReq.overrideMimeType("application/json");
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://localhost:5000/rooms");
oReq.send();