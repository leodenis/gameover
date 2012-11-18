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
 * Initialise le mode StreetView avec sa google map
 * @param : Objet ->
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Helpers.RenderStreetMapMode = function(options){
	
	if(carte && exploration){
		console.log(exploration);
		//exploration.panorama.setPosition(options.mapOptions.center);
	}
	console.log(carte);
	console.log(options);
	//Création de ma carte
	carte = new google.maps.Map(document.getElementById(options.idMap),options.mapOptions);
	//création de ma street View
	exploration = new google.maps.StreetViewPanorama(document.getElementById(options.idStreet), options.streetOptions);
	//Je lie la carte à l'exploration
	carte.setStreetView(exploration);
	//Création des points sur la streetView avec leurs évenements
	var i = 0;
	var j = 0;
	var markerStreet = [];
	var markerStreetEvent = [];
	_.each(options.markersStreet, function(marker){ 
		markerStreet[i] = new google.maps.Marker({
                 position: marker.position,
                 map:exploration,
                 title: marker.title
             });
		
        _.each(marker.events, function(thisEvent){ 
        		google.maps.event.addListener(markerStreet[i], thisEvent.eventMarker,thisEvent.functionMarker);  	
        	j++
        });     
		i++;
	});
	

	
	
	
	//Définition du guide
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	//https://developers.google.com/maps/documentation/javascript/reference#DirectionsRendererOptions
	//voir pour empêcher l'utilisateur de sortir de la zone de directionDisplay'
	directionsDisplay.setMap(carte);
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
	console.log(directionsService);

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
	if(  level <=lastEtape.id )
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
	return Backbone.history.fragment.charAt(1);
}
	
/**
 * Gère la progression du fil d'ariane en ajoutant et enlevant des classes css
 * @author Mathieu Dutto
 * @arguments : int -> dernière question débloquée int -> question en cours (vue)
 * @requires  backbones.js
 */
app.Helpers.filAriane = function(lastQuestionUnlock,currentQuestion){
	currentQuestion++;
	
	//enlève les classes "doing" et ajoute la classe "done" aux questions précédentes (précédentes à la question en cours) 
	for(i=1;i<=currentQuestion;i++) {
		$("footer > span:nth-of-type(1) a:nth-of-type("+i+")").removeClass("doing").addClass("done");
	}
	//enlève la classe "doing" aux questions suivantes (et débloquées) à la question en cours
	for(i=currentQuestion;i<=10;i++) {
		$("footer > span:nth-of-type(1) a:nth-of-type("+i+")").removeClass("doing");
	}
	//ajoute la classe en cours à la question en cours
	$("footer > span:nth-of-type(1) a:nth-of-type("+currentQuestion+")").addClass("doing");
}
