var App = function(){

};

App.prototype.init = function(){ 
    //delegates the click handler to our .username divs
  $('#chats').delegate('.username','click',function(){
    app.addFriend();
  });

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

App.prototype.addMessage = function(message) {
  var newMessage = $("<div class='chat'></div>");
  
  newMessage.append("<div class='username'>"+JSON.stringify(message.username)+"</div>")
  newMessage.append("<div id='message'>"+JSON.stringify(message.text)+"</div>");
  
  $('#chats').append(newMessage);

};

App.prototype.addRoom = function(roomName) {
  $('#roomSelect').append("<div>"+roomName+"</div>");
};

App.prototype.addFriend = function() {
  
};

App.prototype.handleSubmit = function() {
  
};




$(document).ready(function(){
  var app = new App();
  app.init();
});


