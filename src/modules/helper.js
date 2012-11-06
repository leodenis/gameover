/**
 * S'occupe de l'animation de transition entre chaque question
 * @param Objet : html -> zone de rendu// texte-> texte a animé// template -> zone de rendu// render ->fonction de rendu de la question view 
 * delay -> définit le temps d'attente avant la transition
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Helpers.animation = function(options){
	options.html.html(_.template($('#introAnimation').html(),{introQuestion : options.texte}));
	setTimeout(function(){
		//supprime l'animation et bascule vers la question de destination
		$('#question > h1').remove();
		options.render(options.html);  	
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
console.log(options);
	//Création de ma carte
	carte = new google.maps.Map(document.getElementById(options.idMap),options.mapOptions);
	//création de ma street View
	exploration = new google.maps.StreetViewPanorama(document.getElementById(options.idStreet), options.streetOptions);
	//Je lie la carte à l'exploration
	carte.setStreetView(exploration);
	//Création des points sur la streetView
	var i = 0;
	var marker = [];
	_.each(options.markersMap, function(marker){ 
		console.log(marker);
		marker[i] = new google.maps.Marker({
                 position: marker.position,
                 map:exploration,
                 title: marker.title
             });
		i++
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
	