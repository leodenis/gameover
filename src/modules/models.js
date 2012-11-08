app.Models.user = Backbone.Model.extend({
	
		defaults: {
			id:1,
			userAgent:'?',
			version:'?',
			videoWatch: false,
			gameStart:false,
			etapes:[
				{id:0,unLock:true,point:0},
				{id:1,unLock:false,point:0},
				{id:2,unLock:false,point:0},
				{id:3,unLock:false,point:0},
				{id:4,unLock:false,point:0},
				{id:5,unLock:false,point:0},
				{id:6,unLock:false,point:0},
				{id:7,unLock:false,point:0},
				{id:8,unLock:false,point:0},
				{id:9,unLock:false,point:0},
				{id:10,unLock:false,point:0},
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