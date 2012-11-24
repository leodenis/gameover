/**
 * S'occupe de l'animation de transition entre chaque question
 * @param Objet : html -> zone de rendu// texte-> texte a animé// template -> zone de rendu// render ->fonction de rendu de la question view 
 * delay -> définit le temps d'attente avant la transition
 * @author Kévin La Rosa & Léo Denis
 * @requires  backbones.js
 */
app.Helpers.animation = function(options){
	//templating et injection dom ok
	options.that.$el.html(_.template(options.template,options.variables));

    var texte = document.getElementById("changetexte");
    texte.className="played";
     
     

	setTimeout(function(){
		//supprime l'animation et bascule vers la question de destination
		$('#question > h1').remove();
		//lance la question 
		options.render(options.that);  	
	},options.delay);
}

/**
 * S'occupe de dire si l'utilisateur a commencé à jouer au jeux réponse boléen
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Helpers.userIsPlaying = function(options){
	return app.users.get('1').attributes.gameStart;
}

/**
 * Récupère l'useragent de l'utilisateur
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Helpers.getUserAgent = function(options){
	return app.users.get('1').attributes.userAgent;
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
	
	//création de ma street View
	app.street.exploration = new google.maps.StreetViewPanorama(document.getElementById(options.idStreet), options.streetOptions);
	
	if(_.isObject(options.mapOptions.center)){
		//Création de ma carte
		app.map.carte = new google.maps.Map(document.getElementById(options.idMap),options.mapOptions);
		//Je lie la carte à l'exploration
		app.map.carte.setStreetView(app.street.exploration);
	}else{
		$('#'+options.idMap).hide();
	}
	
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
	                 title: marker.title,
	                 icon : marker.icon
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
	userCurrent = app.users.get('1').attributes;
	//je cherche les étapes débloquées
	etapes = _.where(userCurrent.etapes,{unLock:true});
	//je recupère le dernier objet
	lastEtape= _.last(etapes);
	if( level <=lastEtape.id )
		return true
	else
		console.log('L\'utilisateur n\'a pas encore débloquer le level'+level);
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
	userCurrent = app.users.get('1').attributes;
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
	app.users.get('1').attributes.etapes[question].unLock = true;
	// Enregistre son edition dans le localstorage
	app.users.get('1').save();
}


/**
 * Récupère la question en cours (visionée !)
 * @author Mathieu Dutto
 * @requires  backbones.js
 */
app.Helpers.getCurrentQuestion = function(){ 
	 // currentPage = la page visionnée
	 currentPage = Backbone.history.fragment;
	 if(currentPage == null || currentPage == '') {
	 	return 0; //page d'accueil
	 }
	 currentQuestion = currentPage.substring(5); // enleve le mot etape
	 return parseInt(currentQuestion); //retourne le numéro parsé de l'étape
}
	
/**
 * Gère la progression du fil d'ariane en ajoutant et enlevant des classes css
 * @author Mathieu Dutto
 * @arguments : int -> dernière question débloquée int -> question en cours (vue)
 * @requires  backbones.js
 */
app.Helpers.filAriane = function(lastQuestionUnlock,currentQuestion){
	if(app.Helpers.userIsPlaying()==false){
		// si l'utilisateur n'est pas en train de jouer
		$('#filAriane').addClass('hidden'); // cacher le fil d'ariane
	} else {
		$('#filAriane').removeClass('hidden');
		// incrémente les id pour correspondre aux indices des positions des <a>
		lastQuestionUnlock=lastQuestionUnlock+2;
		// enlève les classes
		for(i=2;i<=11;i++) {
			$('#filAriane > a:nth-of-type('+i+')').removeClass('done').removeClass('doing');
		}
		// ajoute classe "done" de la première à la dernière question débloquée
		for(i=2;i<=lastQuestionUnlock;i++) {
			$('#filAriane > a:nth-of-type('+i+')').addClass('done');
		}
		// ajoute classe "doing"
		$('#filAriane > a:nth-of-type('+(currentQuestion+1)+')').addClass('doing');
	}
}

/**
 * Affiche la bulle d'info
 * @author Mathieu Dutto
 * @requires  backbones.js
 */
app.Helpers.showHelp = function(){
	var textInfos = new Array (
		'Le 21 Décembre 2012 correspondrait à la fin d’un cycle du calendrier maya et marquerait, selon les spécialistes, un grand changement dans la conscience mondiale et le début d’une ère nouvelle. Plongeant la terre dans un chaos le plus total.',
		'Une planète appelée Nibiru entrera en collision avec la Terre. Ce qui entraînera un cataclysme détruisant toute forme de vie sur terre.',
		'Un programme informatique pouvant prédire le futur en utilisant les discussions sur internet, nommé Web bot nous indiquent que 2012 sera perturbé par un énorme choc. Tellement intense qu’il affectera personnellement presque tous les Humains sur Terre.',
		'Le 21 Décembre 2012 se produira également une inversion du champ magnétique terrestre, déclenché par une éruption solaire massive. Cette éruption solaire libérerait autant d\'énergie que cent milliards de bombes nucléaires. Cette croyance est soutenue par les astrologues les plus performants. Le champ magnétique terrestre s\'affaiblit depuis de nombreuses années ce qui donnerait bientôt naissance à l’inversion des pôles magnétiques de la Terre.',
		'Des événements comme des tsunamis, des tremblements de terre, des éruptions de super-volcans et d\'autres phénomènes catastrophiques devraient également survenir en 2012.',
		'Le village Bugarach, est un lieu de refuge pour la fin du monde de 2012. Cette affirmation s\'appuierait sur un ancien texte datant du passage d\'Attila, surnommé « le fléau de Dieu » écrit à Lemud, le 4 mai 451. Date à laquelle les Huns auraient enterré le « trésor de l\'Apocalypse » sur les bords de la Nied, après avoir brûlé Metz (7 avril). Ce mystérieux trésor protégerait les survivants de la fin du monde. Ainsi, quiconque se trouverait à proximité du « trésor de l\'Apocaypse » serait épargné par la fin du monde.'
	);
	$('#question h2 + div').addClass('shown').text(textInfos[Math.round(Math.random()*textInfos.length)]);
}

/**
 * Cache la bulle d'info
 * @author Mathieu Dutto
 * @requires  backbones.js
 */
app.Helpers.hideHelp = function(){
	$('#question h2 + div.shown').removeClass('shown');
}


/**
 * Renvoie une question sur la fin du monde
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 */
app.Helpers.getOneInfo = function(){
var textInfos = new Array (
		'Le 21 Décembre 2012 correspondrait à la fin d’un cycle du calendrier maya et marquerait, selon les spécialistes, un grand changement dans la conscience mondiale et le début d’une ère nouvelle. Plongeant la terre dans un chaos le plus total.',
		'Une planète appelée Nibiru entrera en collision avec la Terre. Ce qui entraînera un cataclysme détruisant toute forme de vie sur terre.',
		'Un programme informatique pouvant prédire le futur en utilisant les discussions sur internet, nommé Web bot nous indiquent que 2012 sera perturbé par un énorme choc. Tellement intense qu’il affectera personnellement presque tous les Humains sur Terre.',
		'Le 21 Décembre 2012 se produira également une inversion du champ magnétique terrestre, déclenché par une éruption solaire massive. Cette éruption solaire libérerait autant d\'énergie que cent milliards de bombes nucléaires. Cette croyance est soutenue par les astrologues les plus performants. Le champ magnétique terrestre s\'affaiblit depuis de nombreuses années ce qui donnerait bientôt naissance à l’inversion des pôles magnétiques de la Terre.',
		'Des événements comme des tsunamis, des tremblements de terre, des éruptions de super-volcans et d\'autres phénomènes catastrophiques devraient également survenir en 2012.',
		'Le village Bugarach, est un lieu de refuge pour la fin du monde de 2012. Cette affirmation s\'appuierait sur un ancien texte datant du passage d\'Attila, surnommé « le fléau de Dieu » écrit à Lemud, le 4 mai 451. Date à laquelle les Huns auraient enterré le « trésor de l\'Apocalypse » sur les bords de la Nied, après avoir brûlé Metz (7 avril). Ce mystérieux trésor protégerait les survivants de la fin du monde. Ainsi, quiconque se trouverait à proximité du « trésor de l\'Apocaypse » serait épargné par la fin du monde.'
	);
	return textInfos[Math.floor(Math.random() * textInfos.length) + 1];
	
}
