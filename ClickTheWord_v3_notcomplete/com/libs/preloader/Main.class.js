function AddImagesToPreload(){
	try{
		for(var i=0; i<JData.length; i++){
			if(JData[i].Ques != ""){					
				var NewPreloadObj = {"source": JData[i].Ques,"type": "IMAGE","size": 1032};					
				filesPreloader.files.push(NewPreloadObj);
			}
		}
		//console.log(filesPreloader.files);
	}
	catch(Err){console.log(Err);}
};


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

		AddImagesToPreload();

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