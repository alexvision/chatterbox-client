var App = function(){
  this.currentMessages = {};
  this.currentRooms = {};
  this.currentRoom = "All";
  this.friends = [];
};

App.prototype.init = function(){ 
  
  app.fetch('https://api.parse.com/1/classes/chatterbox');
  setInterval(function(){
    app.fetch('https://api.parse.com/1/classes/chatterbox');
  },800);

};

App.prototype.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

App.prototype.fetch = function(url) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: url,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for(var i = 0; i < data.results.length; i++){
        app.addMessage(data.results[i]);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch messages');
    }
  }, 'text');
};

App.prototype.clearMessages = function() {
  $('#chats').empty();
};

App.prototype.addMessage = function(message, reload) {

  if(app.currentMessages[message.objectId] === undefined || reload){
    app.currentMessages[message.objectId] = message;

    if(message.roomname === app.currentRoom || app.currentRoom === "All"){
      var newMessage = $("<div class='chat'></div>");
      newMessage.append("<div class='username'>"+escaper(message.username)+"</div>")
      newMessage.append("<div id='message'>"+escaper(message.text)+"</div>");
      newMessage.append("<div id='room'>"+escaper(message.roomname)+"</div>");
      escaper(message.text);
      $('#chats').prepend(newMessage);
    }
  }

  if(app.currentRooms[message.roomname] === undefined){

    app.currentRooms[message.roomname] = message.roomname
    app.addRoom(message.roomname);
  }

};

App.prototype.addRoom = function(roomname) {
  if(roomname !== undefined){
    var room = $("<option></option>").attr("value", roomname).text(roomname);
    $('#roomSelect').append(room);
  }
};

App.prototype.addFriend = function(friend) {
  app.friends.push(friend[0].innerText);
  debugger;
  $('.username').each(function(ind,val){
    if(val.innerText === friend[0].innerText){
      $(this).toggleClass(".friends");
    }
  });
};

App.prototype.handleSubmit = function() {
  var username = window.location.search.substring(10);
  var newMessage = $("#newMessage").val();
  var room = $("#newRoom").val();
  var message = {
    username: username,
    text: newMessage,
    room: room
  }
  app.send(message);
};

App.prototype.roomFilter = function(roomname){
  app.clearMessages();
  for(var key in app.currentMessages){
    if (app.currentMessages[key].roomname === roomname || app.currentRoom === "All"){
      app.addMessage(app.currentMessages[key], true);
    }
  }
};

var escaper = function(string){
  if(string !== undefined && string !== null){
    string = string.replace(/&/g,"&amp;");
    string = string.replace(/</g,"&lt;");
    string = string.replace(/>/g,"&gt;");
    string = string.replace(/"/g,"&quot;");
    string = string.replace(/'/g,"&#x27;");
    string = string.replace(/\//g,"&#x2F;");
    return string;
  }
  
};

var app = new App();
app.init();

$(document).ready(function(){
  $('#send').delegate('.submit','click', function(){
    app.handleSubmit();
  });
  
  //delegates the click handler to our .username divs
  $('#chats').delegate('.username','click',function(){
    app.addFriend($(this));
  });

  $("#roomSelect").change(function(){
    app.currentRoom = $("#roomSelect").val();
    app.roomFilter($("#roomSelect").val());
  });

});


