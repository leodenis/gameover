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
	console.log(options.idMap);
	//carte = new google.maps.Map(document.getElementById('question'),options.mapOptions);
	//CORIGER PROBLEME GMAO qui ne s'affiche pas
	
	//création de ma street View
	exploration = new google.maps.StreetViewPanorama(document.getElementById(options.idStreet), options.streetOptions);
	//Je lie la carte à l'exploration
	//carte.setStreetView(exploration);
	
	
	console.log(carte);
	
	
}