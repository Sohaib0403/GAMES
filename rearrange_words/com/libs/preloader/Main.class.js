function MainM() {
	
	this.fullScreenC = false;
	this.boxAjuda = false;
}

MainM.prototype = {
	
	enterAjuda: function(){

		if(Main.boxAjuda){
			
			Main.boxAjuda = false;
			$('.instrucoes').fadeOut('slow');

		}
		else{
			
			Main.boxAjuda = true;
			$('.instrucoes').fadeIn('slow');

		}

	},

	initPreloader: function(){

		var loaderAnimation = $("#html5Loader").LoaderAnimation({
			onComplete: function() {
				$(".row").remove();
				ShowDiv("DvMainCont");
				//$('#DvMainCont').fadeIn('fast');								
				//hideNextNavigationButton();
				setTimeout(function(){
					//Show Div Here				
				},500);				
			}
		});

		$.html5Loader({
			filesToLoad: filesPreloader,
			onComplete: function() {				
			},
			onUpdate: loaderAnimation.update
		});

	}

}