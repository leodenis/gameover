app.Models.user = Backbone.Model.extend({
	
		defaults: {
			id:1,
			userAgent:'?',
			version:'?',
			videoWatch: false,
			gameStart:false,
			etape:[
				{id:1,unlock:false,point:0},
				{id:2,unlock:false,point:0},
				{id:3,unlock:false,point:0},
				{id:4,unlock:false,point:0},
				{id:5,unlock:false,point:0},
				{id:6,unlock:false,point:0},
				{id:7,unlock:false,point:0},
				{id:8,unlock:false,point:0},
				{id:9,unlock:false,point:0},
				{id:10,unlock:false,point:0},
			],
			totalPoint:0
		},
		initialize : function User(){
			console.log("Modèle de l'utilisateur initialisé");
			this.bind("error", function(model, error){
        		console.log( error );
        		console.log(model);
    		});
		}
			
});