(function($){
			// écoute l'évènement Ready pour chaque vidéo sur la page
            var vimeoPlayers = document.querySelectorAll('iframe'), player;

            for (var i = 0, length = vimeoPlayers.length; i < length; i++) {
                player = vimeoPlayers[i];
                $f(player).addEvent('ready', ready);
            }
            
	        function ready(player_id) {
	        	
	            // garde une référence à Froogalopp pour cette vidéo (player_id)
	            var player = $f(player_id);
                
                // parametres définis au début
                var colorValue = "9ecc3d";
                player.api('setColor', colorValue);
                var volumeVal = 0.5;
                player.api('setVolume', volumeVal);
			}
})(jQuery);