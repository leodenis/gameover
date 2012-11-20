/**
 * S'occupe de l'animation de transition entre chaque question
 * @param Objet : html -> zone de rendu// texte-> texte a animé// template -> zone de rendu// render ->fonction de rendu de la question view 
 * delay -> définit le temps d'attente avant la transition
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Helpers.animation = function(options){
	options.that.$el.html(_.template($('#introAnimation').html(),{introQuestion : options.texte}));
	setTimeout(function(){
		//supprime l'animation et bascule vers la question de destination
		$('#question > h1').remove();
		options.render(options.that);  	
	},options.delay);
}

/**
 * S'occupe de dire si l'utilisateur a commencé à jouer au jeux réponse boléen
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Helpers.userIsPlaying = function(options){
	return app.users.get("1").attributes.gameStart;
}

/**
 * Création d'une map reliée avec sa streetwiew avec posibilité d'appliqué un guide sur la map
 * @param : Objet ->
 * @author Kévin La Rosa
 * @requires  backbones.js, Gmap V3
 */
app.Helpers.RenderStreetMapMode = function(options){
	
	delete app.map.carte ;
	delete  app.street.exploration;
	
	//Création de ma carte
	app.map.carte = new google.maps.Map(document.getElementById(options.idMap),options.mapOptions);
	//création de ma street View
	app.street.exploration = new google.maps.StreetViewPanorama(document.getElementById(options.idStreet), options.streetOptions);
	//Je lie la carte à l'exploration
	app.map.carte.setStreetView(app.street.exploration);
	
	//Création des points sur la streetView avec leurs évenements
	if(_.isObject(options.markersStreet[0])){
		var i = 0;
		var j = 0;
		var markerStreet = [];
		var markerStreetEvent = [];
		_.each(options.markersStreet, function(marker){ 
			markerStreet[i] = new google.maps.Marker({
	                 position: marker.position,
	                 map:app.street.exploration,
	                 title: marker.title
	             });
			
	        _.each(marker.events, function(thisEvent){ 
	        	google.maps.event.addListener(markerStreet[j], thisEvent.eventMarker,thisEvent.functionMarker);  	
	        	j++;
	        });     
			i++;
		});
	}
	
	
	//Création des points sur la streetView avec leurs évenements
	if(_.isObject(options.markersMap[0])){
		var x = 0;
		var o = 0;
		var markerMap = [];
		var markerMapEvent = [];
		_.each(options.markersMap,function(marker){
			markerMap[o] = new google.maps.Marker({
                position: marker.position, 
                map: app.map.carte, 
                title:marker.title
            });
			_.each(marker.events, function(thisEvent){ 
	        	google.maps.event.addListener(markerMap[x], thisEvent.eventMarker,thisEvent.functionMarker);  	
	        	x++;
	        });  
	        o++;   			
		})
		
	}
	
	//Mise en place d'un guide sur la map
	if(!_.isUndefined(options.streetGuide.depart)){
		//Définition du guide
		directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();
		//https://developers.google.com/maps/documentation/javascript/reference#DirectionsRendererOptions
		//voir pour empêcher l'utilisateur de sortir de la zone de directionDisplay'
		directionsDisplay.setMap(app.map.carte);
		directionsDisplay.suppressMarkers = true;
		var request = {
	     	origin: options.streetGuide.depart,           
	     	destination: options.streetGuide.arriver, 
	     	provideRouteAlternatives: false,  // empêche des route alternative
	     	travelMode: google.maps.DirectionsTravelMode.WALKING // mode de marche
		}
		
		 directionsService.route(request, function(result, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	      		directionsDisplay.setDirections(result);
	      		
	    	}
	  	});
	}

}
/**
 * Vrai ou faux suivant si l'utilisateur a débloqué la question qu'il souhaite lancer
 * @author Kévin La Rosa
 * @arguments : int -> level
 * @requires  backbones.js
 */
app.Helpers.questionIsUnlock = function (level){
	//Récupère les infos de l'utilisateur
	userCurrent = app.users.get("1").attributes;
	//je cherche les étapes débloquées
	etapes = _.where(userCurrent.etapes,{unLock:true});
	//je recupère le dernier objet
	lastEtape= _.last(etapes);
	if( level <=lastEtape.id )
		return true
	else
		console.log("L'utilisateur n'a pas encore débloquer le level"+level);
		return false;
}
/**
 * Récupére la dernier question unlock
 * @author Kévin La Rosa
 * @arguments : int -> level
 * @requires  backbones.js
 */
app.Helpers.getLastQuestUnlock = function (){
	//Récupère les infos de l'utilisateur
	userCurrent = app.users.get("1").attributes;
	//je cherche les étapes débloquées
	etapes = _.where(userCurrent.etapes,{unLock:true});
	//je recupère le dernier objet
	lastEtape= _.last(etapes);
	return lastEtape.id;
}

/**
 * Débloquer une question
 * @author Kévin La Rosa
 * @arguments : int -> level à débloquer
 * @requires  backbones.js
 */
app.Helpers.unlockQuestion = function(question){
	// Débloque la question
	app.users.get("1").attributes.etapes[question].unLock = true;
	// Enregistre son edition dans le localstorage
	app.users.get("1").save();
}


/**
 * Récupère la question en cours (visionée !)
 * @author Mathieu Dutto
 * @requires  backbones.js
 */
app.Helpers.getCurrentQuestion = function(){ 
	 // currentPage = la page visionnée
	 currentPage = Backbone.history.fragment;
	 currentQuestion = currentPage.substring(5); // enleve le mot etape
	 return parseInt(currentQuestion);
}
	
/**
 * Gère la progression du fil d'ariane en ajoutant et enlevant des classes css
 * @author Mathieu Dutto
 * @arguments : int -> dernière question débloquée int -> question en cours (vue)
 * @requires  backbones.js
 */
app.Helpers.filAriane = function(lastQuestionUnlock,currentQuestion){
	// incrémente les id pour correspondre aux indices de position
	lastQuestionUnlock++;
	
	// enlève les classes
	for(i=1;i<=10;i++) {
		$("footer > span:nth-of-type(1) a:nth-of-type("+i+")").removeClass("done").removeClass("doing");
	}
	// ajoute classe "done" de la première 
	for(i=1;i<=lastQuestionUnlock;i++) {
		$("footer > span:nth-of-type(1) a:nth-of-type("+i+")").addClass("done");
	}
	// ajoute classe "doing"
	$("footer > span:nth-of-type(1) a:nth-of-type("+currentQuestion+")").addClass("doing");
}
