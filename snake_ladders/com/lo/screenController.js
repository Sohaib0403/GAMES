/*-- Screen 1 Functions : Starts --*/
function GenerateScreens() {

};

/*--Result Function : Ends--*/

/*--Audio Function : Starts--*/
function PlayCorrectAud() { $("#AudCorrect")[0].play(); }
function PlayIncorrectAud() { $("#AudIncorrect")[0].play(); }
function PlayScoreEndAud() { $("#AudScoreSound")[0].play(); }
function OnAudioEndedCall() {
	$("#DvMainCont").removeClass("ClsDisable");
	//console.log("Here");

}
/*--Audio Function : Ends--*/

/*-- Replay Function : Starts --*/
function ReplayActivity() {
	try {

		$("#clicktoroll").show();
		
		$("#nowplaying").show();
		$("#activeplayerouter").removeClass('scoreplr');

		$("#DvScr4").hide();
		$("#gameplayer1").show();
		$("#gameplayer2").show();
		$("#gameplayer3").show();
		$("#gameplayer4").show();
		activePlayers = 0;
		playerEndval1 = 0;
		playerEndval2 = 0;
		playerEndval3 = 0;
		playerEndval4 = 0;
		moveCtr = 0;
		blankarr = [];
		$("#dice").show();
		$("#mydice").hide();
		$("#activeplayer").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		for (var i = 0; i < selectedPlayerArr.length; i++) {
			$("#runPlayer" + (i + 1)).addClass("" + selectedPlayerArr[i]);
			$("#runPlayer" + (i + 1)).hide();
		}

		$("#runPlayer1").css({
			"bottom": "-7px",
			"left": "-150px"
		})
		$("#runPlayer2").css({
			"bottom": "115px",
			"left": "-150px"
		})
		$("#runPlayer3").css({
			"bottom": "254px",
			"left": "-150px"
		})
		$("#runPlayer4").css({
			"bottom": "388px",
			"left": "-150px"
		})

		$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);

		$("#dice_1").show();
		$("#dice_2").hide();
		$("#dice_3").hide();
		$("#dice_4").hide();
		$("#dice_5").hide();
		$("#dice_6").hide();

	}
	catch (Err) { DisplayError(Err); }
}
/*-- Replay Function : Ends --*/

/*-- Reset Function : Starts --*/
function RestartActivity() {
	try {
		selectedPlayerArr = [];
		selectedPlayerCtr = 0;

		$("#clicktoroll").show();
		$("#nowplaying").show();
		$("#activeplayerouter").removeClass('scoreplr');

		$("#DvScr2").hide();
		$("#DvScr3").hide();
		$("#DvScr4").hide();
		$("#gameplayer1").show();
		$("#gameplayer2").show();
		$("#gameplayer3").show();
		$("#gameplayer4").show();
		activePlayers = 0;
		playerEndval1 = 0;
		playerEndval2 = 0;
		playerEndval3 = 0;
		playerEndval4 = 0;
		moveCtr = 0;
		blankarr = [];
		$("#dice").show();
		$("#mydice").hide();
		$("#activeplayer").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");

		$("#player1").removeClass("selected");
		$("#player2").removeClass("selected");
		$("#player3").removeClass("selected");
		$("#player4").removeClass("selected");

		$("#gameplayer1").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer2").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer3").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer4").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");

		$("#runPlayer1").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green").hide();
		$("#runPlayer2").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green").hide();
		$("#runPlayer3").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green").hide();
		$("#runPlayer4").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green").hide();


		$("#runPlayer1").css({
			"bottom": "-7px",
			"left": "-150px"
		})
		$("#runPlayer2").css({
			"bottom": "115px",
			"left": "-150px"
		})
		$("#runPlayer3").css({
			"bottom": "254px",
			"left": "-150px"
		})
		$("#runPlayer4").css({
			"bottom": "388px",
			"left": "-150px"
		})

		LoadScreen(1);

	}
	catch (Err) { DisplayError(Err); }
}
/*-- Reset Function : Ends --*/

/*-- Screen 1 functions : ends --*/