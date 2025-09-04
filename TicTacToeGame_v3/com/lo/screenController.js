/*-- Screen 1 Functions : Starts --*/

function AddStar() {
	try {
		$("#DvStar"+GData.CurrQCount).removeClass("ClsStarDisable").addClass("ClsStarEnable");		
	}
	catch (Err) { DisplayError(Err); }
};

function ResetStar() {
	try {
		for(var i=0; i<GData.MaxStars; i++){
			$("#DvStar"+i).removeClass("ClsStarEnable").addClass("ClsStarDisable");
			$("#DvBtnEnter").removeClass("ClsShow").addClass("ClsHide");
			$("#DvBtnClear").removeClass("ClsShow").addClass("ClsHide");
		}				
	}
	catch (Err) { DisplayError(Err); }
};

function OnGameComplete() {
	try {
		PlayGameEndAud();
		$("#DvBtnClear").removeClass("ClsShow").removeClass("ClsHide").removeClass("ClsDisableCont").addClass("ClsHide");
		$("#DvBtnEnter").removeClass("ClsShow").removeClass("ClsHide").removeClass("ClsDisableCont").addClass("ClsHide");
		$("#DvFlag").removeClass("ClsHide").addClass("ClsShow");	
		$("#DvQuesCont").addClass("ClsDisableCont");
		

	}
	catch (Err) { DisplayError(Err); }
};



/*--Ques Function : Starts--*/
function ResetCurrQues() {
	try {	
		$(".ClsQBtn").removeClass("ClsDisable").addClass("ClsEnable");
		$(".ClsAnsBtn").html("");
		GData.StepCounter = 0;
		$("#DvBtnClear").removeClass("ClsShow").removeClass("ClsHide").addClass("ClsDisableCont");
		$("#DvBtnEnter").removeClass("ClsShow").removeClass("ClsHide").addClass("ClsDisableCont");		
	}
	catch (Err) { DisplayError(Err); }
}

function LoadFirstQues() {
	try {	
		if(GData.CurrQCount == 0){
			ResetCurrQues();
			for(var i=0; i<GData.JData[GData.CurrQCount].Affixes.length; i++){
				$("#DvQuesBtn"+i).attr("data-value",GData.JData[GData.CurrQCount].Affixes[i].Text);
				$("#DvQuesBtn"+i).html(GData.JData[GData.CurrQCount].Affixes[i].Text);
			}			
			$("#DvImgCont").css("background-image", "url('" + GData.JData[GData.CurrQCount].Image + "')");
		}
	}
	catch (Err) { DisplayError(Err); }
}



function LoadNextQues() {
	try {		
		if(GData.CurrQCount < GData.MaxQCount - 1){
			ResetCurrQues();
			GData.CurrQCount++;						
			for(var i=0; i<GData.JData[GData.CurrQCount].Affixes.length; i++){
				$("#DvQuesBtn"+i).attr("data-value",GData.JData[GData.CurrQCount].Affixes[i].Text);
				$("#DvQuesBtn"+i).html(GData.JData[GData.CurrQCount].Affixes[i].Text);
			}
			
			$("#DvImgCont").css("background-image", "url('" + GData.JData[GData.CurrQCount].Image + "')");

		}		
		else if(GData.CurrQCount == GData.MaxQCount - 1){
			OnGameComplete();			
		}

	}
	catch (Err) { DisplayError(Err); }
}

function SelectData(e) {
	try {
		var DataSelected = $("#"+e.target.id).attr("data-value");
		$("#DvAnsBtn" + GData.StepCounter).html(DataSelected);
		$("#"+e.target.id).removeClass("ClsEnable").addClass("ClsDisable");
		if(GData.StepCounter <= GData.MaxStepCounter - 1){
			GData.StepCounter++;
			if(GData.StepCounter > 0){
				$("#DvBtnClear").removeClass("ClsDisableCont").addClass("ClsShow");
			}
			if(GData.StepCounter == GData.MaxStepCounter){
				$("#DvBtnEnter").removeClass("ClsDisableCont").addClass("ClsShow");
			}
		}		
	}
	catch (Err) { DisplayError(Err); }
}

/*--Ques Function : Ends--*/

/*--Audio Function : Starts--*/
function PlayCorrectAud() {$("#DvCoverDiv").removeClass("ClsHide").addClass("ClsShow"); $("#AudCorrect")[0].play(); }
function PlayIncorrectAud() {$("#DvCoverDiv").removeClass("ClsHide").addClass("ClsShow"); $("#AudIncorrect")[0].play(); }
function PlayGameEndAud() {$("#DvCoverDiv").removeClass("ClsHide").addClass("ClsShow"); $("#AudGameEnd")[0].play(); }

function OnAudCorrEnded() {$("#DvCoverDiv").removeClass("ClsShow").addClass("ClsHide"); LoadNextQues();}
function OnAudInCorrectEnded() {$("#DvCoverDiv").removeClass("ClsShow").addClass("ClsHide");}
function OnAudGameEnded() {$("#DvCoverDiv").removeClass("ClsShow").addClass("ClsHide");}

/*--Audio Function : Ends--*/

/*--Result Function : Starts--*/
function CheckResult() {
	try {		
		$("#DvBtnEnter").removeClass("ClsShow").addClass("ClsDisableCont");	
		var ResWord = "";
		for(var i=0; i<GData.MaxStepCounter; i++){
			ResWord = ResWord + $("#DvAnsBtn"+i).html();
		}

		if(ResWord == GData.JData[GData.CurrQCount].Word){
			AddStar();
			PlayCorrectAud();			
		}
		else{
			PlayIncorrectAud();
		}
	}
	catch (Err) { DisplayError(Err); }
};
/*--Result Function : Ends--*/

/*-- Reset Function : Starts --*/
function ResetActivity() {
	try {		
		ResetStar();
		$("#DvFlag").removeClass("ClsShow").addClass("ClsHide");
		
		for(var i=0; i<GData.MaxScreen; i++){
			ShuffleArray(GData.JData[i].Affixes);
		}
		ShuffleArray(GData.JData);
		ResetCurrQues();
		GData.CurrQCount = 0;
		LoadFirstQues();		
		$("#DvCoverDiv").removeClass("ClsShow").addClass("ClsHide");
		$("#DvQuesCont").removeClass("ClsDisableCont");

	}
	catch (Err) { DisplayError(Err); }
}
/*-- Reset Function : Ends --*/

/*-- Screen 1 functions : ends --*/