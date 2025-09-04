/*-- Document Ready Starts --*/
$(document).ready(function () {


	// device detection
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
		IsDevice = true;
	}
	//console.log(IsDevice);
	$(window).resize(resizeHandler);
	resizeHandler();

	setTimeout(() => {
		document.ontouchmove = function (e) { };
		RegisterEvents();
		InitActivity();
	}, 1500);
});
/*-- Document Ready Ends --*/

/*-- Common Variables : Starts --*/
var originalRuler, wrapperRulerLeft;
var IsDevice = false; //initiate as false
var TotalScr = 3;
var ZoomFact = 1;
var IsServer = false;

var modeSelection = 0;
var diceArray = [1, 2, 3, 4, 5, 6];
var selectedPlayerArr = [];
var selectedPlayerCtr = 0;

var playerMoveArray = [
	{
		"bottom": "20px",
		"left": "53px"
	}, {
		"bottom": "20px",
		"left": "175px"
	},
	{
		"bottom": "20px",
		"left": "330px"
	}, {
		"bottom": "20px",
		"left": "485px"
	},
	{
		"bottom": "20px",
		"left": "640px"
	}, {
		"bottom": "142px",
		"left": "640px"

	}, {
		"bottom": "142px",
		"left": "485px"
	},
	{
		"bottom": "142px",
		"left": "330px"
	}, {
		"bottom": "142px",
		"left": "175px"
	},
	{
		"bottom": "142px",
		"left": "53px"
	}, {
		"bottom": "260px",
		"left": "53px"
	}, {
		"bottom": "260px",
		"left": "175px"
	},
	{
		"bottom": "260px",
		"left": "330px"
	}, {
		"bottom": "260px",
		"left": "485px"
	},
	{
		"bottom": "260px",
		"left": "640px"
	}, {
		"bottom": "370px",
		"left": "640px"

	}, {
		"bottom": "370px",
		"left": "485px"
	},
	{
		"bottom": "370px",
		"left": "330px"
	}, {
		"bottom": "370px",
		"left": "175px"
	},
	{
		"bottom": "370px",
		"left": "53px"
	}, {
		"bottom": "488px",
		"left": "53px"
	}, {
		"bottom": "488px",
		"left": "175px"
	},
	{
		"bottom": "488px",
		"left": "330px"
	}, {
		"bottom": "488px",
		"left": "485px"
	},
	{
		"bottom": "488px",
		"left": "640px"
	}
]



var D = {
	"CurrScrNo": 0,
	"JD": null,
	"MaxScreen": 0,
	"CurrQuesScr": 0,
	"DragLmt": { "MinX": 0, "MinY": 0, "MaxX": 1708, "MaxY": 710 },
	"CorrectCount": 0,
	"QMarks": 10, "MistakeCount": 0,
	"Score": 0,
	"ArrQStatus": [],
	"TimeDur": 250,
	"XYD": [{ "X": 150, "Y": 120 }, { "X": 577, "Y": 120 }, { "X": 1004, "Y": 120 }],
	"OID": { "FDragID": null, "FDropID": null, "SDragID": null, "SDropID": null },
	"CurrDragXY": { "X": null, "Y": null },
	"AnsStr": { "C": "012", "C2": "120", "V": "" }
};
/*-- Common Variables : Ends --*/

/*-- Common Framework Functions Starts --*/
function RegisterEvents() {
	$(window).resize(function () { resizeHandler(); });
	$(window).on("orientationchange", function (event) { resizeHandler(); });
	$("div").mousedown(function (e) { });
	$("html").mousedown(function (e) { });

	$("#DvInitBtn").mousedown(function (e) {
		//$("#AudInit")[0].play();		
		HideDiv("DvInitialScreen");
	});

	/*-- Screen 0 --*/


	$("#DvStartBtn").mousedown(function (e) {
		LoadScreen(1);
		playbgm();
	});

	$("#UserVsUser").mousedown(function (e) {
		modeSelection = 1;
		LoadScreen(2);
	});

	$("#UserVsComputer").mousedown(function (e) {
		modeSelection = 2;
		LoadScreen(2);
	});


	$("#playBtn").mousedown(function (e) {
		LoadScreen(3);
		if (modeSelection == 2) {
			if (selectedPlayerArr[0] == "blue") {
				selectedPlayerArr[1] = "red";
			}
			if (selectedPlayerArr[0] == "red") {
				selectedPlayerArr[1] = "blue";
			}
			if (selectedPlayerArr[0] == "yellow") {
				selectedPlayerArr[1] = "red";
			}
			if (selectedPlayerArr[0] == "green") {
				selectedPlayerArr[1] = "red";
			}

			$("#gameplayer" + 2).addClass("" + selectedPlayerArr[1]);
			$("#runPlayer" + 2).addClass("" + selectedPlayerArr[1]);
		}
		$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		pausebgm();
	});

	$("#backBtn").mousedown(function (e) {
		LoadScreen(1);
		$("#player1").removeClass("selected");
		$("#player2").removeClass("selected");
		$("#player3").removeClass("selected");
		$("#player4").removeClass("selected");

		$("#gameplayer1").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer2").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer3").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer4").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");

		selectedPlayerCtr = 0;

	});

	$("#DvPrev, #DvNext").mousedown(function (e) { LoadNextScreen(e) });
	$("#DvCheck").mousedown(function (e) { CheckAnswer(); })
	$("#replay").mousedown(function (e) { ReplayActivity(); });
	$("#restart").mousedown(function (e) { RestartActivity(); });


	$("#dice").mousedown(function (e) { clickToRoll(); });
	$(".selectplayer").mousedown(function (e) {
		selectplayer($(this).attr("val"));
		$(this).addClass("selected");
	});


	$("#AudCorrect").on('ended', function () {
		OnAudioEndedCall();
	});

	$("#AudIncorrect").on('ended', function () {
		OnAudioEndedCall();
	});
};

/*-- Game Functions : Starts --*/
function InitActivity() {
	LoadScreen(0);
	if (location.hostname === '') { IsServer = false; } else { IsServer = true; }
	// D.JD = JSON.parse(JSON.stringify(Word_data));
	// D.MaxScreen = D.JD.length;
	// for(var i=0; i<D.MaxScreen; i++){
	// 	ShuffleArray(D.JD[i].Affixes);
	// }
	// ShuffleArray(D.JD);	
	// GenerateScreens();
	//LoadScreen(2);	
}

function HideAllScreen() {
	try {
		for (var i = 0; i < TotalScr; i++) {
			HideDiv("DvScr" + i);
		}
	}
	catch (Err) { DisplayError(Err); }
}

function LoadScreen(ScrNo) {
	// $("#AudInit")[0].play();	
	HideAllScreen();
	switch (ScrNo) {
		case 0:
			ShowDiv("DvScr0"); D.CurrScrNo = 0;
			break;
		case 1:
			ShowDiv("DvScr1"); D.CurrScrNo = 1;
			break;
		case 2:
			ShowDiv("DvScr2"); D.CurrScrNo = 2;
			break;
		case 3:
			ShowDiv("DvScr3"); D.CurrScrNo = 3;
			createMainGame();
			break;
		case 4:
			ShowDiv("DvScr4"); D.CurrScrNo = 4;
			break;
	}
}


function createMainGame() {
	//console.log(gamedata.length);

	for (var i = 1; i <= 25; i++) {

		$("<div/>", {
			'id': 'box_' + i,
			'class': 'mybox'
		}).appendTo('#board');

		try {
			$("<div/>", {
				'id': 'textbox_' + i,
				'class': 'textmybox',
				'html': baseWord_data[(i - 1)]["question_set"][0]["Text"]
			}).appendTo('#box_' + i);
		} catch (error) {

		}


	}
}

function selectplayer(val) {


	if (modeSelection == 1) {
		selectedPlayerArr[selectedPlayerCtr] = val;
		$("#gameplayer" + (selectedPlayerCtr + 1)).addClass("" + selectedPlayerArr[selectedPlayerCtr]);
		$("#runPlayer" + (selectedPlayerCtr + 1)).addClass("" + selectedPlayerArr[selectedPlayerCtr]);
		selectedPlayerCtr++;

		if (selectedPlayerCtr >= 2) {
			// console.log("play active")
			$("#playBtn").addClass("activeBtn");
		}
	}

	if (modeSelection == 2) {
		selectedPlayerCtr = 0;

		selectedPlayerArr[selectedPlayerCtr] = val;

		$("#player1").removeClass("selected");
		$("#player2").removeClass("selected");
		$("#player3").removeClass("selected");
		$("#player4").removeClass("selected");

		$("#gameplayer1").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer2").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer3").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#gameplayer4").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");

		$("#runPlayer1").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#runPlayer2").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#runPlayer3").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#runPlayer4").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");


		$("#gameplayer" + (selectedPlayerCtr + 1)).addClass("" + selectedPlayerArr[selectedPlayerCtr]);
		$("#runPlayer" + (selectedPlayerCtr + 1)).addClass("" + selectedPlayerArr[selectedPlayerCtr]);
		selectedPlayerCtr++;

		if (selectedPlayerCtr >= 1) {
			// console.log("play active")
			$("#playBtn").addClass("activeBtn");
		}
	}


}

var activePlayers = 0;
var playerEndval1 = 0;
var playerEndval2 = 0;
var playerEndval3 = 0;
var playerEndval4 = 0;
function clickToRoll() {

	$("#dice").addClass("stopClick");
	playAudDiceRoll();

	$("#dice").addClass("myimage");

	activePlayers++;
	ShuffleArray(diceArray);
	// console.log(selectedPlayerArr.length + "----" + diceArray[0]);

	if (activePlayers <= selectedPlayerArr.length) {
		// console.log("gameplayer" + activePlayers);
		$("#runPlayer" + activePlayers).show();
	} else {
		activePlayers = 1;
		// console.log("gameplayer" + activePlayers);
	}

	$("#gameplayer" + activePlayers).hide();

	if (activePlayers == 1) {
		playerEndval1 = playerEndval1 + diceArray[0];

	}
	if (activePlayers == 2) {
		playerEndval2 = playerEndval2 + diceArray[0];
	}
	if (activePlayers == 3) {
		playerEndval3 = playerEndval3 + diceArray[0];
	}
	if (activePlayers == 4) {
		playerEndval4 = playerEndval4 + diceArray[0];
	}

	// $("#activeplayer").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");

	// $("#activeplayer").addClass("" + selectedPlayerArr[activePlayers - 1]);

	movePlayerFn();

}

// setInterval(function () {element.innerHTML += "Hello"}, 1000);
var blankarr = [];
var playerEnd
function movePlayerFn() {

	if (activePlayers == 1) {
		playerEnd = playerEndval1;
	}
	if (activePlayers == 2) {
		playerEnd = playerEndval2;
	}
	if (activePlayers == 3) {
		playerEnd = playerEndval3;
	}
	if (activePlayers == 4) {
		playerEnd = playerEndval4;
	}

	var num = (playerEnd - diceArray[0]);

	for (var i = num; i < playerEnd; i++) {
		// console.log(i);

		blankarr[(i - num)] = i;

		// console.log(blankarr[(i - num)]);


	}
	setTimeout(function () {
		$("#dice").removeClass("stopClick");
		$("#dice").removeClass("myimage").hide();
		$("#mydice").show();

		$("#mydice_1").hide();
		$("#mydice_2").hide();
		$("#mydice_3").hide();
		$("#mydice_4").hide();
		$("#mydice_5").hide();
		$("#mydice_6").hide();

		$("#mydice_" + diceArray[0]).show();

		mymovement();
	}, 1000);

}
var moveCtr = 0;
function mymovement() {
	playAudlandsoundRoll();
	$("#runPlayer" + activePlayers).removeClass("myAlhpa");

	$("#runPlayer" + activePlayers).animate({
		left: playerMoveArray[blankarr[moveCtr]]["left"],
		bottom: playerMoveArray[blankarr[moveCtr]]["bottom"],
		zIndex: 2
	}, 1000, "linear", function () {
		moveCtr++;
		if (moveCtr >= blankarr.length) {

			if (playerEndval1 == 9 || playerEndval2 == 9 || playerEndval3 == 9 || playerEndval4 == 9
				|| playerEndval1 == 14 || playerEndval2 == 14 || playerEndval3 == 14 || playerEndval4 == 14
				|| playerEndval1 == 24 || playerEndval2 == 24 || playerEndval3 == 24 || playerEndval4 == 24) {

				if (playerEndval1 == 9) {
					playerEndval1 = 3;
					mydownmovement(2);
				}
				if (playerEndval2 == 9) {
					playerEndval2 = 3;
					mydownmovement(2);
				}
				if (playerEndval3 == 9) {
					playerEndval3 = 3;
					mydownmovement(2);
				}
				if (playerEndval4 == 9) {
					playerEndval4 = 3;
					mydownmovement(2);
				}

				if (playerEndval1 == 14) {
					playerEndval1 = 8;
					mydownmovement(7);
				}
				if (playerEndval2 == 14) {
					playerEndval2 = 8;
					mydownmovement(7);
				}
				if (playerEndval3 == 14) {
					playerEndval3 = 8;
					mydownmovement(7);
				}
				if (playerEndval4 == 14) {
					playerEndval4 = 8;
					mydownmovement(7);
				}

				if (playerEndval1 == 24) {
					playerEndval1 = 16;
					mydownmovement(15);
				}
				if (playerEndval2 == 24) {
					playerEndval2 = 16;
					mydownmovement(15);
				}
				if (playerEndval3 == 24) {
					playerEndval3 = 16;
					mydownmovement(15);
				}
				if (playerEndval4 == 24) {
					playerEndval4 = 16;
					mydownmovement(15);
				}


			} else {
				if (playerEndval1 == 5 || playerEndval2 == 5 || playerEndval3 == 5 || playerEndval4 == 5
					|| playerEndval1 == 10 || playerEndval2 == 10 || playerEndval3 == 10 || playerEndval4 == 10
					|| playerEndval1 == 13 || playerEndval2 == 13 || playerEndval3 == 13 || playerEndval4 == 13) {

					if (playerEndval1 == 5) {
						playerEndval1 = 15;
						myupmovement(14);
					}
					if (playerEndval2 == 5) {
						playerEndval2 = 15;
						myupmovement(14);
					}
					if (playerEndval3 == 5) {
						playerEndval3 = 15;
						myupmovement(14);
					}
					if (playerEndval4 == 5) {
						playerEndval4 = 15;
						myupmovement(14);
					}

					if (playerEndval1 == 10) {
						playerEndval1 = 20;
						myupmovement(19);
					}
					if (playerEndval2 == 10) {
						playerEndval2 = 20;
						myupmovement(19);
					}
					if (playerEndval3 == 10) {
						playerEndval3 = 20;
						myupmovement(19);
					}
					if (playerEndval4 == 10) {
						playerEndval4 = 20;
						myupmovement(19);
					}

					if (playerEndval1 == 13) {
						playerEndval1 = 23;
						myupmovement(22);
					}
					if (playerEndval2 == 13) {
						playerEndval2 = 23;
						myupmovement(22);
					}
					if (playerEndval3 == 13) {
						playerEndval3 = 23;
						myupmovement(22);
					}
					if (playerEndval4 == 13) {
						playerEndval4 = 23;
						myupmovement(22);
					}




				} else {
					moveCtr = 0;
					blankarr = [];
					$("#dice").show();
					$("#dice_1").hide();
					$("#dice_2").hide();
					$("#dice_3").hide();
					$("#dice_4").hide();
					$("#dice_5").hide();
					$("#dice_6").hide();
					$("#dice_" + diceArray[0]).show();
					$("#mydice").hide();
					$("#activeplayer").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
					$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
					$("#runPlayer" + activePlayers).addClass("myAlhpa");
					if (activePlayers == selectedPlayerArr.length) {
						activePlayers = 0;
						$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
					}
					if (modeSelection == 2) {
						if (activePlayers == 1) {
							clickToRoll();
						}
					}
				}

			}

		} else {

			if (blankarr[moveCtr] >= 24) {
				$("#runPlayer" + activePlayers).animate({
					left: playerMoveArray[24]["left"],
					bottom: playerMoveArray[24]["bottom"],
					zIndex: 2
				}, 1000, "linear", function () {

					var mystr = $("#runPlayer" + activePlayers).attr("class");

					mystr = mystr.toLowerCase().replace(/\b[a-z]/g, function (letter) {
						return letter.toUpperCase();
					});

					$("#runPlayer" + 1).removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
					$("#runPlayer" + 2).removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
					$("#runPlayer" + 3).removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
					$("#runPlayer" + 4).removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");

					$("#DvText4").html("").html(mystr);
					playsgameCompleteAudio();
					$("#clicktoroll").hide();
					$("#dice").hide();
					$("#mydice").hide();
					$("#nowplaying").hide();
					$("#activeplayerouter").addClass('scoreplr');

					LoadScreen(4);

				});

			} else {
				mymovement();
			}

		}

	});

}

function mydownmovement(val) {
	playAudlandsoundRoll();
	$("#runPlayer" + activePlayers).removeClass("myAlhpa");
	$("#runPlayer" + activePlayers).animate({
		left: playerMoveArray[val]["left"],
		bottom: playerMoveArray[val]["bottom"],
		zIndex: 2
	}, 1000, "linear", function () {
		$("#runPlayer" + activePlayers).addClass("myAlhpa");
		moveCtr = 0;
		blankarr = [];
		$("#dice").show();
		$("#dice_1").hide();
		$("#dice_2").hide();
		$("#dice_3").hide();
		$("#dice_4").hide();
		$("#dice_5").hide();
		$("#dice_6").hide();
		$("#dice_" + diceArray[0]).show();
		$("#mydice").hide();
		$("#activeplayer").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		if (activePlayers == selectedPlayerArr.length) {
			activePlayers = 0;
			$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		}
		if (modeSelection == 2) {
			if (activePlayers == 1) {
				clickToRoll();
			}
		}


	});
}
function myupmovement(val) {
	playAudlandsoundRoll();
	$("#runPlayer" + activePlayers).removeClass("myAlhpa");
	$("#runPlayer" + activePlayers).animate({
		left: playerMoveArray[val]["left"],
		bottom: playerMoveArray[val]["bottom"],
		zIndex: 2
	}, 1000, "linear", function () {
		$("#runPlayer" + activePlayers).addClass("myAlhpa");
		moveCtr = 0;
		blankarr = [];
		$("#dice").show();
		$("#dice_1").hide();
		$("#dice_2").hide();
		$("#dice_3").hide();
		$("#dice_4").hide();
		$("#dice_5").hide();
		$("#dice_6").hide();
		$("#dice_" + diceArray[0]).show();
		$("#mydice").hide();
		$("#activeplayer").removeClass("red").removeClass("blue").removeClass("yellow").removeClass("green");
		$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		if (activePlayers == selectedPlayerArr.length) {
			activePlayers = 0;
			$("#activeplayer").addClass("" + selectedPlayerArr[activePlayers]);
		}
		if (modeSelection == 2) {
			if (activePlayers == 1) {
				clickToRoll();
			}
		}
	});
}

var objPlayPauseMusic = document.createElement("audio");
objPlayPauseMusic.src = "assets/audios/bgm.mp3";
objPlayPauseMusic.addEventListener('ended', playbgm)

function playbgm() {
	objPlayPauseMusic.play();
}
function pausebgm() {
	objPlayPauseMusic.pause();
}

function playsgameCompleteAudio() {
	var objPlayMusic = document.createElement("audio");
	objPlayMusic.src = "assets/audios/winsound.wav";
	objPlayMusic.play();
}

function playAudDiceRoll() {
	var objDicePlayMusic = document.createElement("audio");
	objDicePlayMusic.src = "assets/audios/diceroll.wav";
	objDicePlayMusic.play();
}

function playAudlandsoundRoll() {
	var objlandsoundPlayMusic = document.createElement("audio");
	objlandsoundPlayMusic.src = "assets/audios/landsound.wav";
	objlandsoundPlayMusic.play();
}



function ShuffleArray(TempArr) {
	var currentIndex = TempArr.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = TempArr[currentIndex];
		TempArr[currentIndex] = TempArr[randomIndex];
		TempArr[randomIndex] = temporaryValue;
	}
	//return TempArr;
};



/*-- Game Functions : Ends --*/

document.addEventListener('DOMContentLoaded', function () {

});

function DisplayError(Err) {
	//console.log(Err);
}

/*
function FunctionName(){
	try{}
	catch(Err){DisplayError(Err);}
};
*/