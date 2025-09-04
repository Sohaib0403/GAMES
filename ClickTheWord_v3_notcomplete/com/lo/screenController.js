/*-- Screen 1 Functions : Starts --*/
var DragVal;
function GenerateScreens(){
	try{
		var DvScr1 = document.getElementById("DvScr1");
		GData.ArrQStatus = [];
		for(var i=0; i<GData.MaxScreen; i++){
			GData.ArrQStatus.push(false);
			var QScreenDiv = document.createElement("div");
			QScreenDiv.setAttribute("id", "DvQuesScrn"+i);			
			QScreenDiv.className = "ClsQuesScrnCont";
			QScreenDiv.classList.add("ClsContDrag"+GData.JData[i].ArrOpt.length);
			DvScr1.appendChild(QScreenDiv);			

			var QContDiv = document.createElement("div");
			QContDiv.setAttribute("id", "DvQuesCont"+i);			
			QContDiv.className = "ClsQuesCont";
			QContDiv.style.backgroundImage = "url(" + GData.JData[i].Ques + ")";
			QScreenDiv.appendChild(QContDiv);

			var QStatusDiv = document.createElement("div");
			QStatusDiv.setAttribute("id", "DvQuesStatus"+i);			
			QStatusDiv.className = "ClsQuesStatus";
			QScreenDiv.appendChild(QStatusDiv);			

			for(var j=0; j<GData.JData[i].ArrOpt.length; j++){
				var dragdiv = document.createElement("div");
				dragdiv.setAttribute("id", "DvDrag"+i+"_"+j);	
				//dragdiv.setAttribute("data-value", Number(GData.JData[i].ArrOpt[j].ID));
				dragdiv.setAttribute("data-value", j);
				//dragdiv.setAttribute("data-isdrop", false);	
				dragdiv.setAttribute("data-status", GData.JData[i].ArrOpt[j].Status);			
				dragdiv.className = "ClsDrag";
				dragdiv.classList.add("ClsDrag"+j);
				dragdiv.innerHTML = GData.JData[i].ArrOpt[j].Text;
				dragdiv.onmousedown = function(e){OnWordMouseDown(e)};
				QScreenDiv.appendChild(dragdiv);
			}
		}	

		setTimeout(function(){
			LoadNextQues(); 
			UpdateNavBtn();
		},100);
		
	}
	catch(Err){DisplayError(Err);}
};

function fruitaudio(source){
	const audio = new Audio(`data/audio/fruits/${source}.mp3`);
	audio.play()
}

function OnWordMouseDown(e){
	//console.log(e.target.id);	
	var DragID = e.target.id;	
	DragVal = $("#"+DragID).attr("data-value");
	if($("#"+DragID).attr("data-status") == "true"){
		fruitaudio($("#"+DragID).text());
		$("#DvQuesStatus"+GData.CurrQuesScr).addClass("ClsCorrect" + DragVal);									
		// $("#DvWordBg"+DragVal).addClass("correct");
		GData.CorrectCount++;					
		AddStar();	
		DisableDrag();	
		$("#DvPrev, #DvNext").addClass("ClsDisableCont");	
	}
	else{
		DisableDrag();
		PlayIncorrectAud();
		// $("#DvWordBg"+DragVal).addClass("incorrect");
		$("#DvQuesStatus"+GData.CurrQuesScr).addClass("ClsIncorrect");
		$("#DvMessage").fadeIn( 500, function() {
			// Animation complete
			$("#DvPrev, #DvNext").addClass("ClsDisableCont");
			setTimeout(function(){
				$("#DvWordBg"+DragVal).removeClass("incorrect");
				$("#"+GData.CurrDropID).html("");
				$("#DvMessage").fadeOut(500)
				//$("#DvQuesScrn"+ GData.CurrQuesScr +" .ClsDrag").attr("data-isdrop", false);
				//$("#DvQuesScrn"+ GData.CurrQuesScr +" .ClsDrag").removeAttr("style");
				$("#DvQuesScrn"+GData.CurrQuesScr).removeClass("ClsDisableCont");	
				$("#DvPrev, #DvNext").removeClass("ClsDisableCont");
				GData.CurrDropID = null;
				EnableDrag();
			},GData.TimeDur);
		});		
	}
}

function DisableDrag(){
	$("#DvDrag"+GData.CurrQuesScr+"_0").addClass("ClsDisableCont");
	$("#DvDrag"+GData.CurrQuesScr+"_1").addClass("ClsDisableCont");
}

function EnableDrag(){
	$("#DvDrag"+GData.CurrQuesScr+"_0").removeClass("ClsDisableCont");
	$("#DvDrag"+GData.CurrQuesScr+"_1").removeClass("ClsDisableCont");
}

function AddStar(){
	try{			
		$('#DvContStar').toggleClass('PlayZoomIn');
		setTimeout(function(){
			$('#DvContStar').toggleClass('PlayZoomIn');
			GData.ArrQStatus[GData.CurrQuesScr] = true;
			UpdateNavBtn();	
			GData.CurrDropID = null;
			$("#DvPrev, #DvNext").removeClass("ClsDisableCont");
		},1500);		
	}
	catch(Err){DisplayError(Err);}
};

/*--Ques Function : Starts--*/
function LoadNextQues(){
	try{
		HideAllQuestion();
		ShowDiv("DvQuesScrn"+GData.CurrQuesScr);
	}
	catch(Err){DisplayError(Err);}
}


function LoadNextScreen(e){
	try{
		if(e.target.id == "DvPrev"){
			$("#DvWordBg"+DragVal).removeClass("correct");
			GData.CurrQuesScr--;
			LoadNextQues();
		}
		else if(e.target.id == "DvNext"){
			$("#DvWordBg"+DragVal).removeClass("correct");
			if(GData.CurrQuesScr == GData.MaxScreen - 1){
				PlayGameEndAud();
				LoadScreen(2);											
				//UpdateResult();			
			}
			else{
				GData.CurrQuesScr++;
				LoadNextQues();
			}
		}	
		UpdateNavBtn();
	}
	catch(Err){DisplayError(Err);}
};
/*--Ques Function : Ends--*/

/*--Navigation Function : Starts--*/
function HideAllQuestion(){
	try{
		for(var i=0; i<GData.MaxScreen; i++){
			HideDiv("DvQuesScrn"+i); 
		}
	}
	catch(Err){DisplayError(Err);}	
}
function UpdateNavBtn(){
	try{
		if(GData.MaxScreen == 1){
			HideDiv("DvPrev"); HideDiv("DvNext");
			return;
		}
		$("#DvPrev, #DvNext").addClass("ClsDisable");	
		if(GData.CurrQuesScr > 0){
			$("#DvPrev").removeClass("ClsDisable");			
		}		

		if(GData.CurrQuesScr >= 0 && GData.CurrQuesScr <= GData.MaxScreen-1 && GData.ArrQStatus[GData.CurrQuesScr]){			
			$("#DvNext").removeClass("ClsDisable");
		}		
	}
	catch(Err){DisplayError(Err);}
};
/*--Navigation Function : Ends--*/

/*--Audio Function : Starts--*/
// function PlayCorrectAud(){$("#AudCorrect")[0].play();}
function PlayIncorrectAud(){$("#AudIncorrect")[0].play();}
function PlayGameEndAud(){
	$("#AudGameEnd")[0].play();
}
/*--Audio Function : Ends--*/

/*--Result Function : Starts--*/
function UpdateResult(){
	try{
		// $("#DvTotalQues").html("Total Questions: "+GData.MaxScreen);
		// $("#CorrectAns").html("Correct Answers: "+GData.CorrectCount);
		// $("#IncorrectAns").html("Incorrect Answers: "+(GData.MaxScreen - GData.CorrectCount));

		// HideDiv("DvFantastic"); HideDiv("DvMessage");
		// $("#DvMessage").html("");
		// if(GData.CorrectCount == 0){
		// 	ShowDiv("DvMessage");
		// 	$("#DvMessage").html(GData.ArrMsg[0]);
		// }
		// else if(GData.CorrectCount < (GData.MaxScreen/2)){
		// 	ShowDiv("DvMessage");
		// 	$("#DvMessage").html(GData.ArrMsg[1]);
		// }
		// else if(GData.CorrectCount >= (GData.MaxScreen/2)){
		// 	ShowDiv("DvFantastic");
		// }

	}
	catch(Err){DisplayError(Err);}
};
/*--Result Function : Ends--*/

/*-- Reset Function : Starts --*/
function ResetActivity(){
    try{
		$("#DvPrev, #DvNext").removeClass("ClsDisableCont");
        $(".ClsQuesScrnCont").removeClass("ClsDisableCont");
        $(".ClsDrop").html("");
        $(".ClsDrag").removeAttr("style");
		$(".ClsDrag").removeClass("ClsDisableCont");
        $(".ClsQuesStatus").removeClass("ClsCorrect0").removeClass("ClsCorrect1");
        GData.CorrectCount = 0;
        GData.CurrQuesScr = 0;
        //$("#DvContStar").html("");
        $(".ClsQuesScrnCont").remove();
        ShuffleArray(GData.JData);	
	    GenerateScreens();		
        setTimeout(function(){
            LoadScreen(1);
        },100);
        
    }
	catch(Err){DisplayError(Err);}
}
/*-- Reset Function : Ends --*/

/*-- Screen 1 functions : ends --*/