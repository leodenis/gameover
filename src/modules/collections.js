app.Collections.users = Backbone.Collection.extend({
		model: app.Models.user,
		localStorage : new Store("user"),
		initialize : function() {
		}
	})