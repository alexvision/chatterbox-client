var Message = Backbone.Model.extend({

	initialize: function(message,username,roomname){
		this.set("message",message);
		this.set("username", username);
		this.set("roomname", roomname)
	}
});

var MessageView = Backbone.View.extend({
	render: function(){
		var html = [
			'<div class="chat">',
				'<div class="username">',
					this.model.get("username"),
				'</div>',
				'<div class="message">',
					this.model.get("message"),
				'</div>',
			'</div>'
		].join('');

		this.$el.html(html);
	}
});

var Messages = Backbone.Collection.extend({
	model: Message
});

var MessagesView = Backbone.View.extend({
	initialize: function(){
		this.model.on("change", this.render, this);
	},
	render: function(){
		$('#chats').prepend(this.model.map(function(message){
			var messageView = new MessageView({model:message});
			return messageView.render();
		});
	}
});

