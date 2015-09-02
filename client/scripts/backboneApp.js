
//Singular Message
var Message = Backbone.Model.extend({
	url: 'https://api.parse.com/1/classes/chatterbox',
	defaults: {
		username: '',
		text: ''
	}
});

var MessageView = Backbone.View.extend({

	initialize: function(){
		this.model.on('change', this.render, this);
	},

	template: _.template('<div class="chat" data-id="<%- objectId %>"> \
							<div class="username"><%- username %></div> \
							<div class="text"><%- text %></div> \
							</div>'),
	render: function(){
		var roomInSelect = false;
		var context = this;
		$('#roomSelect').children().each(function(ind,val){
			if(context.model.attributes.roomname === val.innerText){
				roomInSelect = true;
			}
		})

		if(!roomInSelect && this.model.attributes.roomname){
			$('#roomSelect').append( $("<option>").text( this.model.attributes.roomname ) );
		}

		this.$el.html(this.template(this.model.attributes));
		return this.$el;
	}

});

//Collections of messages
var Messages = Backbone.Collection.extend({
	model: Message,
	url: 'https://api.parse.com/1/classes/chatterbox',

	parse: function(response, options){
		var results = [];
		for(var i = response.results.length - 1; i >=0; i--){
			results.push(response.results[i]);
		}
		return results;
	}

});

var MessagesView = Backbone.View.extend({
	initialize: function(){
		this.collection.on('sync', this.render, this);
		this.onscreenMessages = {};
	},
	render: function(){
		this.collection.forEach(this.renderMessage, this);
	},
	renderMessage: function(message){
		if(!this.onscreenMessages[message.attributes.objectId]){
			var messageView = new MessageView({model:message});
			$('#chats').prepend(messageView.render());
			this.onscreenMessages[message.attributes.objectId] = true;
		}
	}
});

var messages = new Messages;
var messagesView  = new MessagesView({collection: messages});

$(document).ready(function(){
	$('#send').delegate('.submit','click', function(){
    	var username = window.location.search.substring(10);
    	var newMessage = $("#newMessage").val();
    	var roomname = $("#newRoom").val();
  		var message = {
    		username: username,
    		text: newMessage,
    		roomname: roomname
  		};
    	messages.create(message);
  	});
	setInterval(function(){
		messages.fetch({data: {order: '-createdAt'}});
	}, 500)
});