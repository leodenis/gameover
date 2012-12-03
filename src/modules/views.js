/**
 * View du loader
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 */
app.Views.loader = Backbone.View.extend({
	el : '#loader',
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		this.templateLoader  = $('#templateLoader').html()
		//Déclaration du noeud html de destination
		this.noeud
		//Déclaration des events du footer
		//Gestion de la mise en pause ou non du son ambiant
		//Optiomisation -> changement de l'image sur le bouton en fonction de l'element
		$('#optionSon').bind('click',function(){
				if(app.Assets.sounds.ambiant.paused == true){
					app.Assets.sounds.ambiant.play();
					$(this).removeClass('muted');
					$(this).attr('title','Couper le son');
				}else{
					app.Assets.sounds.ambiant.pause();
					$(this).addClass('muted');
					$(this).attr('title','Activer le son');
				}
		});
		
		$('#resetGame').bind('click',function(){
				app.Helpers.reinitialize();
		});

		// Compteur dans le header !!!
			var note = $('#note'),
			ts = new Date("December 21, 2012") ;
			newYear = true;
			if((new Date()) > ts){
				ts = (new Date()).getTime() + 10*24*60*60*1000;
				newYear = false;
			}
			$('#countdown').countdown({
				timestamp	: ts,
				callback	: function(days, hours, minutes, seconds){
					
					var message = "";
					message += days + " day" + ( days==1 ? '':'s' ) + ", ";
					message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
					message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
					message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br />";
					
					if(newYear){
						message += "avant la fin du monde!";
					}
					else {
						message += "left to 10 days from now!";
					}
					
					note.html(message);
				}
			}).toggleClass('show');

		//Lancement du rendu de chargement si ce n'est pas un iphone ou ipad
		if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPad/i))){
			// Initialisation du router, c'est lui qui va instancier nos vues
    		app.router = new app.Router();
    		//Met en route la surveillance de l'url
    		Backbone.history.start();
    		console.log('mobile');
		}else{
			this.LoaderRender();
		}
		

	},

	// Chargements des ressources Videos & sons & images
	LoaderRender : function() {
		var i = 0;
		var data = [];
		var loaderAnimation = $("#loader").toggleClass('show').LoaderAnimation();
		$.html5Loader({
            getFilesToLoadJSON:"assets/json/confLoader.json",
            onBeforeLoad:       function () {},
            onComplete:         function () {

            	console.log(app.Assets.files);

            	app.Assets.images = {
					porsche : app.Assets.files[0],
					renault : app.Assets.files[1],
					bunker : app.Assets.files[2],
					ritz : app.Assets.files[3],
					rue : app.Assets.files[4],
					apocalysme : app.Assets.files[5],
				}
				app.Assets.sounds = {
					ambiant : app.Assets.files[8],
					boum : app.Assets.files[6],
					tranquille : app.Assets.files[7]
				};
				//Configuration du Son ambiant
				app.Assets.sounds.ambiant.loop = true;
				app.Assets.sounds.ambiant.volume = 0.1;
				app.Assets.sounds.boum.volume = 0.1;
				app.Assets.sounds.tranquille.volume = 0.1;
				//supprime le loader
				console.log('loader chargé');
				$('#loader').remove();
				// Initialisation du router, c'est lui qui va instancier nos vues
	    		app.router = new app.Router();
	    		//Met en route la surveillance de l'url
	    		Backbone.history.start();
            },
            onElementLoaded:    function ( obj, elm) { 
            	app.Assets.files.push(elm);
            },
            onUpdate:function ( percentage ) {loaderAnimation.update}      
		}); 
	}
});


/**
 * View de l'accueil
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 */
app.Views.home = Backbone.View.extend({
	el : '#accueil',
	
	events: {
		'click #etape1': 'launchGame',
	},
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		if($('#question:visible').length){	  	
	  		$('#question:visible').removeClass('show').empty();
	  	}
	  	if($('#div:visible').length){	  		
	  		$('#div:visible').removeClass('show').empty();
	  	}
		//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());	
		// On cache les div courante
		$('body > div:visible').removeClass('show');
		// On affiche la div accueil
		$('#accueil').toggleClass('show');
		// Déclaration des templates
		this.templateAccueil = $('#templateAccueil').html();
	
		// Déclaration de référance 
		var renderAccueil = this.renderAccueil;
		//On lance la vidéo si l'utilisateur n'a jamais vu celle-ci
		if(app.users.get('1').attributes.videoWatch == false){	
			//app.Assets.sounds.ambiant.stop();
			this.loaderVideo();
		}else{
			this.renderAccueil()
			if(app.Assets.sounds.ambiant.pause == true){
				app.Assets.sounds.ambiant.play();
			}
			
		}
		
		
	},
	

	loaderVideo : function() {
		app.Assets.videos.intro =  $('<video>');
		if (Modernizr.video) {
		  if(Modernizr.video.webm == 'probably' || Modernizr.video.webm == 'maybe') {
		  		app.Assets.videos.intro.attr('src','assets/video/intro.webm');
		  }else {
		  	if (Modernizr.video.ogg == 'probably'|| Modernizr.video.ogg == 'maybe') {
		    	app.Assets.videos.intro.attr('src','assets/video/intro.ogg');
		   	}else{ 
				if (Modernizr.video.h264 =='probably'|| Modernizr.video.h264 == 'maybe'){
		   			app.Assets.videos.intro.attr('src','assets/video/intro.mp4');
		   		}
		   	}
		  }
		   	
		} else {
			//proposer du flash !!
		}
		app.Assets.videos.intro.volume = 0.3;
		//Crée son aparation avec animation css
		app.Assets.videos.intro.bind('canplaythrough',function(){
			console.log('ici');
			app.Assets.videos.intro[0].play();
			app.Assets.videos.intro.className ='played';
		});
		$('#videoIntro').toggleClass('show').html(app.Assets.videos.intro);
		var that = this;
		app.Assets.videos.intro.bind('ended',function(){
			$('#videoIntro').removeClass('show').empty();
			app.users.get('1').attributes.videoWatch = 'true';
			app.users.get('1').save();
		 	that.renderAccueil();
		 	app.Assets.sounds.ambiant.play();
		})
		
	},
	
	renderAccueil: function(){	
		accueilHTML = _.template($('#templateAccueil').html(),{});
		$('#accueil').html(accueilHTML);
		//Valeur a récupérer par une requête ajax
		var oui = 45;
 		var non = 55;
 		var chang = document.getElementById('commentaire');
        chang.className="played"
        //paramètre du sondage
		paramChart = {
	                 chart: {
	                    renderTo: 'container_sondage',
	                     plotBorderWidth: 0,
	                     plotShadow: false
	                 },
	                 title: {
	                     text: ''
	                 },
	                 tooltip: {
	                     pointFormat: '{series.name}: <b>{point.percentage}%</b>',
	                     percentageDecimals: 1
	                 },
	                 plotOptions: {
	                     pie: {
	                         allowPointSelect: false,
	                         cursor: 'pointer',
	                         dataLabels: {
	                             enabled: false,
	                             color: '#FFFFFF',
	                             connectorColor: '#FFFFFF',
	                             formatter: function() {
	                                 return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
	                             }
	                            
	                         }
	                     }
	                 },
	                 series: [{
	                 type: 'pie',
	                 name: 'Survival',
	                 data: [
	               
	                     {
	                         name: 'oui',
	                         color:'#3c3b36',
	                         y: oui,
	                  
	                     },
	                     {
	                         name: 'non',
	                        color:'#a6a094',
	                         y: non,
	                     
	                     }
	                 ]
	                 }]
	             };	

	    // génere un sondage
		app.Helpers.renderCharts(paramChart);
		console.log('Accueil chargé');
		

	},
	// evenement lors du click du lancement de l'application
	launchGame: function(){
		// Renvoie l'utilisateur sur sa dernière question débloquer si il a déjà commencer a jouer
		if(app.Helpers.userIsPlaying()){
			app.router.routeQuestion(app.Helpers.getLastQuestUnlock());
		}else{
			// change le statut de l'utilisateur en mode game
			app.users.get("1").set({gameStart:true});
			//enregistre son statut dans le localstorage
			app.users.get("1").save();
			//root vers l'intro du jeux
			app.router.navigate('etape1', true);
		}
	}
	
}); 

/**
 * ETAPE 1 : View du début du jeu
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 * @A faire : Styliser la view, notice de l'action, revoir le blocage sur la streetView
 */
app.Views.etape1 = Backbone.View.extend({
	el : '#question',
	
	events: {
		'click .nextQuestion': 'nextQuestion',
		'click #btnHelp': 'showHelp',
		'click .shown': 'hideHelp'
	},
	// Fonction appelée automatiquement lors de l'instanciation de la vue
	initialize : function() {
		if(app.Assets.sounds.ambiant.pause == true){
			app.Assets.sounds.ambiant.play();
		}
		// Controle que nous n'ayons pas l'accueil de chargé
	  	if($('#accueil:visible').length){
	  		$('#accueil:visible').removeClass('show').empty();
	  	}
	  	if($('#end:visible').length){	  		
	  		$('#end:visible').removeClass('show').empty();
	  	}
	  	//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
	  	//Affiche la zone de rendu
	  	this.$el.attr('class','show');
	  	// Lance l'animation d'introduction (Voir par la création d'un template html)
	  	AnimationParam = {
			variables : {
	  			introQuestion : 'Nous sommes 24 jours avant la fin du monde, les mayas avaient raison',
	  			introQuestion2: 'Tout le monde est affolé !',
	  			introQuestion3: 'Tu décides de partir te réfugier dans un endroit ou tu seras en sécurité',
	  			introQuestion4: 'Quel sera ton choix ?'

	  		},
	  		template: $('#introAnimation').html(),
	  		render: this.renderIntro,
	  		delay: 7500,
	  		that : this
	  	}
	  	app.Helpers.animation(AnimationParam);
	},
	
	//Attention prend en paramètre that qui est le this courant appelé depuis un objet étranger

	renderIntro : function (that){
		app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
		//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
		//Recupère le html générer avec le template
		template = _.template($('#templateStreetView').html(),{"titreQuestion":"Recherchez le médium le plus proche afin qu’il vous prédise le futur... "});
		that.$el.html(template);		
		// Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.867116,2.399231),
				zoom : 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP, // type de map
				styles: [   { "featureType": "landscape", "stylers": [ { "color": "#808080" } ] }, // les terres en gris
                            { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, // Cache les points d'interet ( Hopital,Ecole ect...)
                            { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] }, // Nom : ville, arondissement : non visible
                            { "featureType": "road", "stylers": [ { "color": "#c0c0c0" } ] }, // Route en gris clair
                            { "featureType": "road", "elementType": "labels", "stylers": [ {  "visibility": "off" } ] }, // label des routes non visible
                            { "featureType": "transit", "stylers": [ { "visibility": "off" } ] } // Transport non affiche
                        ],
				streetViewControl: true,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				disableDoubleClickZoom: true,
			},
			streetOptions : {
				
				adresseControl : true,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.866818,2.399524),
                pov : {
                	heading: 550, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
                    //controler de direction
                    panControl: true,
                    // controler de direction par clavier
                    keyboardShortcuts: true,
                    //bloque le changement d'adresse
                    addressControl:false,
                    scrollwheel:false,
                    //bloque le click and go
                    clickToGo:true,
                    //bloque le clique du sol
                    linksControl:true
			},
			markersStreet : [
					{
						title : 'voyance',
						position : new google.maps.LatLng(48.867058,2.399065),
						events: [
							{
								eventMarker : 'click',
								functionMarker : that.popupInfo
								
							}
						],
					},
			],
			markersMap : [
			],
		
			streetGuide : {
				depart : new google.maps.LatLng(48.866818,2.399524),
				arriver : new google.maps.LatLng(48.867404,2.398934),
		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
	
	//Evenement qui réagit au click sur le marker en face de la voyante
	popupInfo : function(){
		new Messi('Nos « ancêtres », les Mayas, qui en savaient plus que nous sur la puissance des astres nous ont dévoilés leurs secrets.', {
			title: 'Commencer l\'aventure',
			modal: true,
			buttons: [{
					id: 0, 
					label: 'Oui', 
					val: 'O'
			},
			{
					id: 1, 
					label: 'Non', 
					val: 'N'
			}],
			callback: function(val) { 
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('8');
					app.router.navigate('etape2', true);
				}
			},
			
		});
	},
	
	showHelp : function(){
		//affiche aide
		app.Helpers.showHelp();
	},
	
	hideHelp : function(){
		//cache aide
		app.Helpers.hideHelp();
	},
	
	nextQuestion : function(){
		$(this.el).remove();
		app.Helpers.unlockQuestion('1');
		app.router.navigate('etape2', true);

	}
}); 


/**
 * View question qui sert de classe mère aux questions enfants.
 * @author Kévin La Rosa & Tom Forlini & Mathieu Dutto
 * @requires  backbones.js
 */
app.Views.question = Backbone.View.extend({
	
	//Zone de rendering
	el : '#question',
	
	events: {
		'click .nextQuestion': 'nextQuestion',
		'click #btnHelp': 'showHelp',
		'click .shown': 'hideHelp'
	},
	
	
	// Fonction qui est appelé automatiquement lors de l'instanciation des vues questions
	initialize : function() {
		if(app.Assets.sounds.ambiant.pause == true){
			app.Assets.sounds.ambiant.play();
		}
		this.$el.html(' ');
		// Controle que nous n'ayons pas l'accueil en non hide
	  	if($('#accueil:visible').length){
	  		$('#accueil:visible').removeClass('show').empty();
	  	}
	  	if($('#end:visible').length){	  		
	  		$('#end:visible').removeClass('show').empty();
	  	}
	  	//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
		
	  	//Affiche la zone de rendu si on vient de l'accueil
	  	this.$el.attr('class','show');
	  	//Affiche la question
	  	this.render();
	},
	
	render : function(){
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#template').html(),{'titreQuestion':'à faire'});
		zoneRendu.html(template);
		return this;
	},
	
	showHelp : function(){
		//affiche aide
		app.Helpers.showHelp();
	},
	
	hideHelp : function(){
		//cache aide
		app.Helpers.hideHelp();
	},
	
	nextQuestion : function(){
		nextQuestion = (app.Helpers.getCurrentQuestion()+1);
		app.Helpers.unlockQuestion(nextQuestion);
		app.router.routeQuestion(nextQuestion);
	}

});





/**
 * ETAPE 2 : 
 * @author Kévin La Rosa & Mathieu dutto
 * @requires  backbones.js
 */
app.Views.etape2 = app.Views.question.extend({

	render : function (){
		//Recupère le html générer avec le template
		accueilHTML = _.template($('#templateStreetView').html(),{'titreQuestion':'Vous devez déguerpir en vitesse, volez une voiture dans une concession proche.'});
		this.$el.html(accueilHTML);
		//Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.851287,2.276246),
				zoom : 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP, // type de map
				styles: [   { "featureType": "landscape", "stylers": [ { "color": "#808080" } ] }, // les terres en gris
                            { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, // Cache les points d'interet ( Hopital,Ecole ect...)
                            { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] }, // Nom : ville, arondissement : non visible
                            { "featureType": "road", "stylers": [ { "color": "#c0c0c0" } ] }, // Route en gris clair
                            { "featureType": "road", "elementType": "labels", "stylers": [ {  "visibility": "off" } ] }, // label des routes non visible
                            { "featureType": "transit", "stylers": [ { "visibility": "off" } ] } // Transport non affiche
                        ],
				streetViewControl: true,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				disableDoubleClickZoom: true,
			},
			streetOptions : {
				
				adresseControl : true,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.852630,2.286480),
                pov : {
                	heading: 550, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
                    //controler de direction
                    panControl: true,
                    // controler de direction par clavier
                    keyboardShortcuts: true,
                    //bloque le changement d'adresse
                    addressControl:false,
                    scrollwheel:false,
                    //bloque le click and go
                    clickToGo:true,
                    //bloque le clique du sol
                    linksControl:true
			},
			markersStreet : [
				{
						title : 'Concession Porsche',
						position : new google.maps.LatLng(48.851190,2.276290),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
						],
				},{
						title : 'Concession Renault',
						position : new google.maps.LatLng(48.852630,2.286480),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
								]
				}
			
			],
			markersMap : [
					{
						title : 'Concession Porsche',
						position : new google.maps.LatLng(48.851287,2.276246),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.moveStreet
								
							}
						],
					},{
						title : 'Concession Renault',
						position : new google.maps.LatLng(48.852701,2.286263),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.moveStreet
								
									}
								]
						}
			],
		
		streetGuide : {

		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
	
	nextQuestion : function(){
		app.Helpers.unlockQuestion('2');
		app.router.navigate('etape3', true);
	},
	
	//Evenement qui place la streetView sur le marker map ciblé
	moveStreet: function(marker){
		console.log(marker.latLng);
		app.street.exploration.setPosition(new google.maps.LatLng(marker.latLng.$a,marker.latLng.ab));
	},
	
	//Evenement de confirmation après avoir cliquer sur un marker d'une view
	confirmQuestion: function(marker){
		//console.log(Messi);
		var pos = marker.latLng.$a;
		var lat = marker.latLng.ab;
		var options = {
			modal: true,
			closeButton: true,
			buttons: [{
					id: 0, 
					label: 'Oui', 
					val: 'O'
			},
			{
					id: 1, 
					label: 'Non', 
					val: 'N'
			}],
			
		}
		if(pos == 48.85119 && lat == 2.2762900000000172){
			options.title = 'Vous souhaitez voler une Porsche ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape3', true);
				}
			}
			new Messi(app.Assets.images.porsche,options);
		}else{
			options.title = 'Vous souhaitez voler un kangoo ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape3', true);
				}
			}
			new Messi(app.Assets.images.renault,options);
		}
	}
});


/**
 * ETAPE 3 : 
 * @author Tom Forlini
 * @requires backbones.js
 */
app.Views.etape3 = app.Views.question.extend({
	
	render : function (){
		//Définition des variables à passer
		image1 = {'url':'mac-gyver.jpg','alt':'livre Que ferait Mac Gyver ?','titre':'Livre : Que ferait Mac Gyver ?','description':'Le livre pour savoir ce que ferait Mac Gyver dans toutes les situations les plus périeuses. Les astuces du maître de la survie !'};
		image2 = {'url':'ipad3.png','alt':'iPad 3','titre':'Tablette tactile : iPad 3','description':'Le dernier iPad : le plus puissant et la tablette la plus pratique au monde. Un maximum d\outils en un seul objet !'};

		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateWebGl').html(),{'titreQuestion':'La place manque dans cette voiture, quel objet choisissez-vous pour survivre ?','image1':image1,'image2':image2});
		this.$el.html(template);

		var camera_livre, camera_ipad, scene_livre, scene_iPad, renderer_livre, renderer_ipad;
		var particleLight_livre, particleLight_ipad, pointLight;
		var dae;


		livre_MacGyver();
		iPad_Apple();

		$('#choix1').bind('click',function(){
				app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
				app.Helpers.unlockQuestion('3');
				app.router.navigate('etape4', true);
		});
		$('#choix2').bind('click',function(){
				app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
				app.Helpers.unlockQuestion('3');
				app.router.navigate('etape4', true);
		});

		function livre_MacGyver(){
			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( 'assets/models/Untitled.dae', function ( collada ) {

				dae = collada.scene;
				//dae.rotation.z = -Math.PI/2;
				dae.updateMatrix();

				// Scale-up the model so that we can see it:
				dae.scale.x = dae.scale.y = dae.scale.z = 40;

				init_livre();
				animate_livre();

			} );
		}		
		function init_livre() {
		    camera_livre = new THREE.OrthographicCamera(
			      	window.innerWidth / -2,   // Left
			      	window.innerWidth / 2,    // Right
			      	window.innerHeight / 2,   // Top
		     		window.innerHeight / -2,  // Bottom
			      	-2000,            // Near clipping plane
			      	1000 );           // Far clipping plane
			scene_livre = new THREE.Scene();
			scene_livre.add( dae );
			scene_livre.add( new THREE.AmbientLight( 0xcccccc ) );
			renderer_livre = new THREE.WebGLRenderer();
			renderer_livre.setSize( window.innerWidth/2.2, window.innerHeight/2.2 );
			$('#elements1').html( renderer_livre.domElement ) ;
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function animate_livre() {
			requestAnimationFrame( animate_livre );
			var timer = Date.now() * 0.0005;
			camera_livre.position.x = Math.cos( timer ) * 10;
			camera_livre.position.y = 2;
			camera_livre.position.z = Math.sin( timer ) * 10;
			camera_livre.lookAt( scene_livre.position );
			renderer_livre.render( scene_livre, camera_livre );
		}
		function iPad_Apple(){
			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( 'assets/models/Apple iPad.dae', function ( collada ) {

				dae = collada.scene;
				skin = collada.skins[0];

				// Scale-up the model so that we can see it:
				dae.scale.x = dae.scale.y = dae.scale.z = 45;
				dae.updateMatrix();

				init_iPad();
				animate_iPad();
			} );
		}
		function init_iPad() {
		    camera_ipad = new THREE.OrthographicCamera(
			      	window.innerWidth / -2,   // Left
			      	window.innerWidth / 2,    // Right
			      	window.innerHeight / 2,   // Top
		     		window.innerHeight / -2,  // Bottom
			      	-2000,            // Near clipping plane
			      	1000 );           // Far clipping plane



			scene_iPad = new THREE.Scene();
			scene_iPad.add( dae );

			particleLight_ipad = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
			scene_iPad.add( particleLight_ipad );
			scene_iPad.add( new THREE.AmbientLight( 0xcccccc ) );

			var directionalLight = new THREE.DirectionalLight(0xeeeeee);
			directionalLight.position.x = Math.random() - 0.5;
			directionalLight.position.y = Math.random() - 0.5;
			directionalLight.position.z = Math.random() - 0.5;
			directionalLight.position.normalize();
			scene_iPad.add( directionalLight );

			pointLight = new THREE.PointLight( 0xffffff, 3 );
			pointLight.position = particleLight_ipad.position;
			scene_iPad.add( pointLight );

			renderer_ipad = new THREE.WebGLRenderer();
			renderer_ipad.setSize( window.innerWidth/2.2, window.innerHeight/2.2 );

			$('#elements2').html( renderer_ipad.domElement ) ;
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function animate_iPad() {
			requestAnimationFrame( animate_iPad );

			var timer = Date.now() * 0.0005;

			camera_ipad.position.x = Math.cos( -timer ) * 10;
			camera_ipad.position.y = 2;
			camera_ipad.position.z = Math.sin( -timer ) * 10;

			camera_ipad.lookAt( scene_iPad.position );

			particleLight_ipad.position.x = Math.sin( timer * 4 ) * 3009;
			particleLight_ipad.position.y = Math.cos( timer * 5 ) * 4000;
			particleLight_ipad.position.z = Math.cos( timer * 4 ) * 3009;

			renderer_ipad.render( scene_iPad, camera_ipad );
		}
		function onWindowResize() {
			var width = window.innerWidth;
			var height = window.innerHeight;

			var ratioW = width/3;
			var ratioH = height/3;

			camera_livre.aspect = width / height;
			camera_livre.updateProjectionMatrix();

			camera_ipad.aspect = width / height;
			camera_ipad.updateProjectionMatrix();

			renderer_livre.setSize( ratioW, ratioH );
			renderer_ipad.setSize( ratioW, ratioH );
		}
	},
});

/**
 * ETAPE 4 : 
 * @author Mathieu Dutto
 * @requires backbones.js
 */
app.Views.etape4 = app.Views.question.extend({
	render : function (){
		//Définition des variables à passer
		video1 = {'url':'23608259','titre':'Un chat mais pas que..','description':''};
		video2 = {'url':'5169262','titre':'Un perroquet mais pas que...','description':''};
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateVideos').html(),{'titreQuestion':'La solitude peut tuer ! Choisissez-vous un animal de compagnie qui vous remontera le moral.','video1':video1,'video2':video2});
		this.$el.html(template);
		
		app.Helpers.videosVimeo();
	},
});

/**
 * ETAPE 5 : 
 * @author Mathieu Dutto
 * @requires backbones.js
 */
app.Views.etape5 = app.Views.question.extend({
	render : function (){
		//Définition des variables à passer
		video1 = {'url':'35132562','titre':'Will Smith - I am a Legend','description':''};
		video2 = {'url':'3431743','titre':'Chuck Norris','description':''};
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateVideos').html(),{'titreQuestion':'Les conseils de quelle star préféreriez-vous entendre pour vous préparer à la fin du monde ?','video1':video1,'video2':video2});
		this.$el.html(template);
		
		app.Helpers.videosVimeo();
	},
});

/**
 * ETAPE 6 : 
 * @author Kevin La Rosa
 * @requires backbones.js
 */
app.Views.etape6 = app.Views.question.extend({
	
	render: function(){
		//Recupère le html générer avec le template
		accueilHTML = _.template($('#templateStreetView').html(),{'titreQuestion':'Vous semblez fatigué. Trouvez donc un endroit pour passer la nuit. Vous pouvez choisir entre un Bunker, un Hôtel 5* ou l’arche la plus proche de votre position.'});
		this.$el.html(accueilHTML);
		//Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.867903,2.329117),
				zoom : 11,
				mapTypeId: google.maps.MapTypeId.ROADMAP, // type de map
				styles: [   { "featureType": "landscape", "stylers": [ { "color": "#808080" } ] }, // les terres en gris
                            { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, // Cache les points d'interet ( Hopital,Ecole ect...)
                            { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] }, // Nom : ville, arondissement : non visible
                            { "featureType": "road", "stylers": [ { "color": "#c0c0c0" } ] }, // Route en gris clair
                            { "featureType": "road", "elementType": "labels", "stylers": [ {  "visibility": "off" } ] }, // label des routes non visible
                            { "featureType": "transit", "stylers": [ { "visibility": "off" } ] } // Transport non affiche
                        ],
				streetViewControl: true,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				disableDoubleClickZoom: true,
			},
			streetOptions : {
				
				adresseControl : true,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.867903,2.329117),
                pov : {
                	heading: 650, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
                    //controler de direction
                    panControl: true,
                    // controler de direction par clavier
                    keyboardShortcuts: true,
                    //bloque le changement d'adresse
                    addressControl:false,
                    scrollwheel:false,
                    //bloque le click and go
                    clickToGo:true,
                    //bloque le clique du sol
                    linksControl:true
			},
			markersStreet : [
				{
						title : 'Ritz hotel 5 étoiles',
						position : new google.maps.LatLng(48.86796,2.328900),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
						],
				},{
						title : 'Bunker',
						position : new google.maps.LatLng(48.868050,2.27053),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
								]
				}
			
			],
			markersMap : [
					{
						title : 'Ritz hotel 5 étoiles',
						position : new google.maps.LatLng(48.867903,2.329117),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.moveStreet
								
							}
						],
					},{
						title : 'Bunker',
						position : new google.maps.LatLng(48.867961,2.271100),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.moveStreet
								
									}
								]
						}
			],
		
		streetGuide : {

		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
		//Evenement qui place la streetView sur le marker map ciblé
	moveStreet: function(marker){
		console.log(marker.latLng);
		app.street.exploration.setPosition(new google.maps.LatLng(marker.latLng.$a,marker.latLng.ab));
	},
	
		//Evenement de confirmation après avoir cliquer sur un marker d'une view
	confirmQuestion: function(marker){
		var pos = marker.latLng.$a;
		var lat = marker.latLng.ab;
		var options = {
			closeButton: true,
			modal: true,
			buttons: [{
					id: 0, 
					label: 'Oui', 
					val: 'O'
			},
			{
					id: 1, 
					label: 'Non', 
					val: 'N'
			}],
			
		}
		console.log(marker);
		if(pos == 48.86796 && lat == 2.328899999999976){
			options.title = 'Vous souhaitez dormir dans un hôtel 5 étoiles ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
					app.router.navigate('etape7', true);
				}
			}
			new Messi(app.Assets.images.ritz,options);
		}else{
			options.title = 'Vous souhaitez dormir dans un bunker ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('6');
					app.router.navigate('etape7', true);
				}
			}
			new Messi(app.Assets.images.bunker,options);
		}
	}

	
});

app.Views.etape7 = app.Views.question.extend({

	render : function (){
		//Définition des variables à passer
		image1 = {'url':'mac-gyver.jpg','alt':'gun','titre':'Pistolet semi-automatique E-45','description':'Choisissez le pistolet à 11 coups'};
		image2 = {'url':'ipad3.png','alt':'cut','titre':'Couteau','description':'Choisissez le couteau utile et perène !!!'};

		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateWebGl').html(),{'titreQuestion':'BLA BLA ?','image1':image1,'image2':image2});
		this.$el.html(template);

		var camera_gun, camera_cut, scene_gun, scene_cut, renderer_gun, renderer_cut;
		var particleLight_gun, particleLight_cut, pointLight;
		var dae;


		cut();
		gun();

		$('#choix1').bind('click',function(){
				app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
				app.Helpers.unlockQuestion('7');
				app.router.navigate('etape8', true);
		});
		$('#choix2').bind('click',function(){
				app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
				app.Helpers.unlockQuestion('7');
				app.router.navigate('etape8', true);
		});

		function gun(){
			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( 'assets/models/projet PST2.dae', function ( collada ) {

				dae = collada.scene;
				//dae.rotation.z = -Math.PI/2;
				dae.updateMatrix();

				// Scale-up the model so that we can see it:
				dae.scale.x = dae.scale.y = dae.scale.z = 0.5;

				init_gun();
				animate_gun();

			} );
		}		
		function init_gun() {
		    camera_gun = new THREE.OrthographicCamera(
			      	window.innerWidth / -2,   // Left
			      	window.innerWidth / 2,    // Right
			      	window.innerHeight / 2,   // Top
		     		window.innerHeight / -2,  // Bottom
			      	-2000,            // Near clipping plane
			      	1000 );           // Far clipping plane
			scene_gun = new THREE.Scene();
			scene_gun.add( dae );
			scene_gun.add( new THREE.AmbientLight( 0xcccccc ) );
			renderer_gun = new THREE.WebGLRenderer();
			renderer_gun.setSize( window.innerWidth/2.2, window.innerHeight/2.2 );
			$('#elements1').html( renderer_gun.domElement ) ;
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function animate_gun() {
			requestAnimationFrame( animate_gun );
			var timer = Date.now() * 0.0005;
			camera_gun.position.x = Math.cos( timer ) * 10;
			camera_gun.position.y = 2;
			camera_gun.position.z = Math.sin( timer ) * 10;
			camera_gun.lookAt( scene_gun.position );
			renderer_gun.render( scene_gun, camera_gun );
		}
		function cut(){

			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = false;
			loader.load( 'assets/models/shlass 3.dae', function ( collada ) {

				dae = collada.scene;
				skin = collada.skins[ 0 ];

				// Scale-up the model so that we can see it:
				dae.scale.x = dae.scale.y = dae.scale.z = 0.5;
				dae.updateMatrix();

				init_cut();
				animate_cut();

			} );
		}
		function init_cut() {
		    camera_cut = new THREE.OrthographicCamera(
			      	window.innerWidth / -2,   // Left
			      	window.innerWidth / 2,    // Right
			      	window.innerHeight / 2,   // Top
		     		window.innerHeight / -2,  // Bottom
			      	-2000,            // Near clipping plane
			      	1000 );           // Far clipping plane



			scene_cut = new THREE.Scene();
			scene_cut.add( dae );

			particleLight_cut = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
			scene_cut.add( particleLight_cut );
			scene_cut.add( new THREE.AmbientLight( 0xcccccc ) );

			var directionalLight = new THREE.DirectionalLight(0xeeeeee);
			directionalLight.position.x = Math.random() - 0.5;
			directionalLight.position.y = Math.random() - 0.5;
			directionalLight.position.z = Math.random() - 0.5;
			directionalLight.position.normalize();
			scene_cut.add( directionalLight );

			pointLight = new THREE.PointLight( 0xffffff, 3 );
			pointLight.position = particleLight_cut.position;
			scene_cut.add( pointLight );

			renderer_cut = new THREE.WebGLRenderer();
			renderer_cut.setSize( window.innerWidth/2.2, window.innerHeight/2.2 );

			$('#elements2').html( renderer_cut.domElement ) ;
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function animate_cut() {
			requestAnimationFrame( animate_cut );

			var timer = Date.now() * 0.0005;

			camera_cut.position.x = Math.cos( -timer ) * 10;
			camera_cut.position.y = 2;
			camera_cut.position.z = Math.sin( -timer ) * 10;

			camera_cut.lookAt( scene_cut.position );

			particleLight_cut.position.x = Math.sin( timer * 4 ) * 3009;
			particleLight_cut.position.y = Math.cos( timer * 5 ) * 4000;
			particleLight_cut.position.z = Math.cos( timer * 4 ) * 3009;

			renderer_cut.render( scene_cut, camera_cut );
		}
		function onWindowResize() {
			var width = window.innerWidth;
			var height = window.innerHeight;

			var ratioW = width/3;
			var ratioH = height/3;

			camera_gun.aspect = width / height;
			camera_gun.updateProjectionMatrix();

			camera_cut.aspect = width / height;
			camera_cut.updateProjectionMatrix();

			renderer_gun.setSize( ratioW, ratioH );
			renderer_cut.setSize( ratioW, ratioH );
		}
	},	
});

app.Views.etape8 = app.Views.question.extend({

	render : function (){
		//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
		//Recupère le html générer avec le template
		template = _.template($('#templateStreetView').html(),{"titreQuestion":"Entendez-vous ? Je crois que l’heure à sonner... Choisissez la direction dans laquelle vous souhaitez partir."});
		this.$el.html(template);		
		// Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				
			},
			streetOptions : {
				
				adresseControl : false,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.851885,2.421000),
                pov : {
                	heading: 450, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
				streetViewControl: false,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				//controler de direction
                panControl: false,
                // controler de direction par clavier
                keyboardShortcuts: false,
  				disableDoubleClickZoom: true,
  				//bloque le click and go
                clickToGo:false,
                //bloque le clique du sol
                linksControl:false
			},
			markersStreet : [
					{
						title : 'Partir à gauche',
						position : new google.maps.LatLng(48.851960,2.421070),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.popupInfo
								
							}
						],
					},
					{
						title : 'Partir à droite',
						position : new google.maps.LatLng(48.85185,2.421125),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.popupInfo
								
							}
						],
					}
			],
			markersMap : [
			],
		
			streetGuide : {

			}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
	
	nextQuestion : function(){
		$(this.el).remove();
		app.Helpers.unlockQuestion('1');
		app.router.navigate('etape2', true);

	},
	
	popupInfo : function(marker){
		var pos = marker.latLng.$a;
		var lat = marker.latLng.ab;
		var options = {
			modal: true,
			closeButton: true,
			buttons: [{
					id: 0, 
					label: 'Oui', 
					val: 'O'
			},
			{
					id: 1, 
					label: 'Non', 
					val: 'N'
			}],
			
		}
		if(pos == 48.85196 && lat == 2.421069999999986){
			app.Assets.sounds.boum.play();
		 	options.title = 'Vous comptez aller à droite ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape9', true);
				}
			}
			new Messi(app.Assets.images.apocalysme,options);
			
		}else{
			app.Assets.sounds.tranquille.play();
			options.title = 'Vous comptez aller à gauche ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape9', true);
				}
			}
			new Messi(app.Assets.images.rue,options);
		 	
		 }
	}

	
});

app.Views.etape9 = Backbone.View.extend({

	//Zone de rendering
	el : '#end',
	
	events: {

	},
	
	
	// Fonction qui est appelé automatiquement lors de l'instanciation
	initialize : function() {
		// Controle que nous n'ayons pas l'accueil de chargé
		console.log()
	  	if($('#accueil:visible').length){
	  		$('#accueil:visible').removeClass('show').empty();
	  	}
	  	
	  	console.log($('#question:visible'));
	  	if($('#question:visible').length){	  		
	  		$('#question:visible').removeClass('show').empty();
	  	}
	  	this.$el.toggleClass('show');
		this.render();
	},
	
	render : function(){
		console.log(app.Helpers.getCuid());
		score = app.Helpers.getScore();
		console.log(score);
		if(score <= 50){
			//push sur le serveur le score
			app.Helpers.SetResultSurvive(false);
			resultat = {
				resultatTitle : 'Aie ! la fin est proche pour toi', 
				resultatAnalyse: ''
			}
		}else{
			app.Helpers.SetResultSurvive(true);
			resultat = {
				resultatTitle : 'tu vas survivre champion !!', 
				resultatAnalyse: ''
			}
		}
		console.log(_.template($('#endTemplate').html(),resultat));
		this.$el.html(_.template($('#endTemplate').html(),resultat));
	}

	
});







/**
 * Page du site mobile avec gestion du gyroscope
 * @author Kévin La Rosa 
 * @requires  backbones.js
 */


app.Views.mobileExperience = Backbone.View.extend({
	
	//zone de rendering kIkou math ? a quand une intégration de accueilMobile  en Mquery. . . 
	el : '#accueilMobile',
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		$('#filAriane').addClass('hidden'); // cacher le fil d'ariane
		this.render();		
	},
	render : function(){		
		template = _.template($('#templateMobile').html(),{phrase:'kjjk'});
		this.$el.attr('style','show').html(template);
		//Controle si le navigateur peut utiliser le gyroscope
		if (typeof window.DeviceMotionEvent != 'undefined') {
			
	    // Définit la sensibilité du shake
	    var sensitivity = 20;
	
	    // variable de position
	    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
	
	    // ecoute pour bouger les evenement et update la position 
	    window.addEventListener('devicemotion', function (e) {
	        x1 = e.accelerationIncludingGravity.x;
	        y1 = e.accelerationIncludingGravity.y;
	        z1 = e.accelerationIncludingGravity.z;
	    }, false);
	
	    setInterval(function () {
	        var change = Math.abs(x1-x2+y1-y2+z1-z2);
	        if (change > sensitivity) {        	
				template = _.template($('#templateMobile').html(),{phrase:app.Helpers.getOneInfo()});
				$('#accueilMobile').html(template);
	        }
	
	        // Update new position
	        x2 = x1;
	        y2 = y1;
	        z2 = z1;
	    }, 150);
	}
	}	
});

