var myversion;
$(document).ready(function () {


		updategame();

	// device detection
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
		IsDevice = true;
	}

	resizeHandler();
	function updategame() {
		setTimeout(() => {
			document.ontouchmove = function (e) { };
			RegisterEvents();
			InitActivity();
		}, 1000);
	}

});

/*-- Document Ready Ends --*/

/*-- Common Variables : Starts --*/
var originalRuler, wrapperRulerLeft;
var IsDevice = false; //initiate as false
var TotalScr = 3;
var ZoomFact = 1;
var totalCtr = 0;
var IsServer = false;
var GData = {
	"CurrScrNo": 0,
	"JData": null,
	"BoxInSeq": 3,
	"Row": 3,
	"Col": 3,
	"BoxW": 0,
	"BoxH": 0,
	"PlayerNo": 1,
	"IsGameComp": false,
	"FillBoxID": "",
	"MoveTimeVal": 0,
	"MoveTime": 0,
	"MovetimeFact": 50,
	"CP": { "SX": 0, "SY": 0, "EX": 0, "EY": 0 },
	"WinningPlayer": 0,
	"CanvasID": "",
	"CNTXT": null,
	"Clr1": "#a31521",
	"Clr2": "#a31521",
	"LineW": 16
};
/*-- Common Variables : Ends --*/

/*-- Common Framework Functions Starts --*/
function RegisterEvents() {
	$(window).resize(function () { resizeHandler(); });
	$(window).on("orientationchange", function (event) { resizeHandler(); });
	$("div").mousedown(function (e) { });
	$("html").mousedown(function (e) { });

	/*-- Screen 0 --*/
	$("#ResetGame").mousedown(function (e) { ResetFourInARowActivity(); });
	$("#AudGameEnd").on("ended", function (event) { OnAudGameEnded(); });
};

/*-- Game Functions : Starts --*/
function InitActivity() {
	ShowDiv("DvScr0");
	if (location.hostname === '') { IsServer = false; } else { IsServer = true; }
	GData.JData = JSON.parse(JSON.stringify(word_data));
	// ShuffleArray(GData.JData);

	var ColCount = 0;
	var RowCount = 0;

	for (var i = 0; i < GData.JData.length; i++) {
		var DataObj = {
			"RowNo": 0,
			"ColNo": 0,
			"Left": 0,
			"Top": 0,
			"Height": 0,
			"Width": 0,
			"CX": 0,
			"CY": 0
		};
		if (ColCount > GData.Col - 1) {
			ColCount = 0;
			RowCount++;
		}

		if (RowCount > GData.Row - 1) {
			RowCount = 0;
		}
		var NC1 = "ClsR" + RowCount;
		var NC2 = "ClsC" + ColCount;

		var NewBox = document.createElement('div');
		NewBox.setAttribute('id', 'Box_' + RowCount + "_" + ColCount);
		NewBox.classList.add('ClsBox', NC1, NC2,);
		// NewBox.textContent = GData.JData[i].question_set[0].Text;
		//NewBox.textContent = 'Box_'+RowCount+"_"+ColCount;
		DataObj.RowNo = RowCount;
		DataObj.ColNo = ColCount;
		NewBox.addEventListener('click', function handleClick(event) { OnBoxClick(event); });
		$("#GameCont").append(NewBox);
		DataObj.Left = $("#" + 'Box_' + RowCount + "_" + ColCount)[0].offsetLeft;
		DataObj.Top = $("#" + 'Box_' + RowCount + "_" + ColCount)[0].offsetTop;
		DataObj.Height = $("#" + 'Box_' + RowCount + "_" + ColCount)[0].clientHeight;
		DataObj.Width = $("#" + 'Box_' + RowCount + "_" + ColCount)[0].clientWidth;
		DataObj.CX = DataObj.Left + (DataObj.Width / 2);
		DataObj.CY = DataObj.Top + (DataObj.Height / 2);
		GData.Height = $("#" + 'Box_' + RowCount + "_" + ColCount)[0].clientHeight;
		GData.Width = $("#" + 'Box_' + RowCount + "_" + ColCount)[0].clientWidth;
		NewBox.setAttribute('data-info', JSON.stringify(DataObj));
		ColCount++;
	}
	$("#Player2").addClass("ClsDisableCont");
	GData.CanvasID = document.getElementById('GameCanvas');
	GData.CNTXT = GData.CanvasID.getContext("2d");
}

/*-- Drawing Functions : Starts --*/
function DrawLine() {
	GData.CNTXT.beginPath();
	GData.CNTXT.lineCap = "round";
	if (GData.WinningPlayer == 1) {
		GData.CNTXT.strokeStyle = GData.Clr1;
	}
	else if (GData.WinningPlayer == 2) {
		GData.CNTXT.strokeStyle = GData.Clr2;
	}
	GData.CNTXT.lineWidth = GData.LineW
	GData.CNTXT.moveTo(GData.CP.SX, GData.CP.SY);
	GData.CNTXT.lineTo(GData.CP.EX, GData.CP.EY);
	GData.CNTXT.stroke();
}

function ClearDrawing() {
	GData.CNTXT.clearRect(0, 0, GData.CanvasID.width, GData.CanvasID.height);
}
/*-- Drawing Functions : Ends --*/

/*-- Box Functions : Starts --*/
function OnBoxClick(e) {
	$("#GameCont").addClass("ClsBlockCont");
	var BoxObj = JSON.parse($("#" + e.target.id).attr("data-info"));
	//console.log(BoxObj);	
	var SelectedBoxID = "";
	if (
		$("#Box_" + BoxObj.RowNo + "_" + BoxObj.ColNo).hasClass("ClsP1") == false &&
		$("#Box_" + BoxObj.RowNo + "_" + BoxObj.ColNo).hasClass("ClsP2") == false
	) {
		SelectedBoxID = "Box_" + BoxObj.RowNo + "_" + BoxObj.ColNo;
		//GData.MoveTime = (GData.MovetimeFact * i) + GData.MovetimeFact;		
	}
	//console.log(SelectedBoxID);

	if (SelectedBoxID != "") {
		GData.FillBoxID = SelectedBoxID;
	}

	//console.log(BoxObj.ColNo)
	$("#AudClick")[0].currentTime = 0;
	$("#AudClick")[0].play(); // Play Audio Click	
	if (
		$("#" + GData.FillBoxID).hasClass("ClsP1") == false &&
		$("#" + GData.FillBoxID).hasClass("ClsP2") == false
	)
		$("#" + GData.FillBoxID).addClass("ClsP" + GData.PlayerNo);
	totalCtr++;

	SwitchPlayer();
	$("#GameCont").removeClass("ClsBlockCont");

	if (ValidateHorizontalBox() == true) { }
	else if (ValidateVerticalBox() == true) { }
	else if (ValidateDiagonalDownBox() == true) { }
	else if (ValidateDiagonalUpBox() == true) { }
}

/*-- Box Functions : Ends --*/

/*-- Player Functions : Starts --*/
function SwitchPlayer() {
	if (GData.IsGameComp == false) {
		if (GData.PlayerNo == 1) {
			GData.PlayerNo = 2;
			$("#Player2").removeClass("ClsDisableCont");
			$("#Player1").addClass("ClsDisableCont");
		}
		else if (GData.PlayerNo == 2) {
			GData.PlayerNo = 1;
			$("#Player1").removeClass("ClsDisableCont");
			$("#Player2").addClass("ClsDisableCont");
		}
	}
}

function ShowFailBoard() {

	if (totalCtr == 9 && GData.WinningPlayer == 0) {

		setTimeout(function(){
			if (totalCtr == 9 && GData.WinningPlayer == 0) {
				$("#GameCont").addClass("ClsBlockCont");
				$("#Player1, #Player2, #IconPlayer1, #IconPlayer2").addClass("ClsHide");
				$("#WinningBoard, #ResetGame").removeClass("ClsHide");
				$("#WinPlayer" + Number(GData.WinningPlayer)).removeClass("ClsHide");
				$(".ClsIconMoveBox").addClass("ClsHide");
				$("#AudGameEnd")[0].play();
				$("#ResetGame").removeClass("ClsDisableCont");
			}
			
		}, 400)
	}
}

function ShowWinningBoard() {
	$("#GameCont").addClass("ClsBlockCont");
	$("#Player1, #Player2, #IconPlayer1, #IconPlayer2").addClass("ClsHide");
	$("#WinningBoard, #ResetGame").removeClass("ClsHide");
	$("#WinPlayer" + Number(GData.WinningPlayer)).removeClass("ClsHide");
	//$(".ClsIconBox,.ClsIconMoveBox").removeClass("ClsIconP1").removeClass("ClsIconP2");
	$(".ClsIconMoveBox").addClass("ClsHide");
	DrawLine();
	$("#AudGameEnd")[0].play();
	// setTimeout(function () {
	// 	$(".ClsWinAnim").removeClass("ClsHide");
	// 	setTimeout(function () {
	// 		$(".ClsWinAnim").addClass("ClsHide");
	// 		$("#ResetGame").removeClass("ClsDisableCont");
	// 		restartGif();
	// 	}, 3250);
	// }, 100);
	setTimeout(function () {
		const gifUrl = "assets/images/celebration.gif";
		const $img = $(".ClsWinAnim");
	
		// 🔄 Force reload by updating the src with a unique timestamp
		$img.attr("src", gifUrl + "?t=" + Date.now());
		$img.removeClass("ClsHide");
	
		setTimeout(function () {
		  $img.addClass("ClsHide");
		  $("#ResetGame").removeClass("ClsDisableCont");
		}, 3100);
	
	  }, 100);
}

function restartGif() {
	var $el = $('.ClsWinAnim');
	var bg = $el.css('background-image');
	$el.css('background-image', 'none'); // Temporarily remove it
	setTimeout(function () {
	  $el.css('background-image', bg); // Re-apply it
	}, 50); // Small delay to force re-render
  }

function ValidateHorizontalBox() {
	var ColCount = 0;
	var RowCount = 0;
	var IsPlayer1 = true;
	var IsPlayer2 = true;
	for (var i = 0; i < GData.JData.length; i++) {
		IsPlayer1 = true;
		IsPlayer2 = true;
		if (ColCount > GData.Col - 1) {
			ColCount = 0;
			RowCount++;
		}

		if (RowCount > GData.Row - 1) {
			RowCount = 0;
		}

		var SelectedStartBox = $("#Box_" + RowCount + "_" + ColCount);
		var StartBoxObj = JSON.parse($("#Box_" + RowCount + "_" + ColCount).attr("data-info"));
		GData.CP.SX = StartBoxObj.CX;
		GData.CP.SY = StartBoxObj.CY;

		if (ColCount + (GData.BoxInSeq - 1) < GData.Col) {
			//console.log($("#Box_" + RowCount + "_" + (ColCount + GData.BoxInSeq - 1)));
			var EndBoxObj = JSON.parse($("#Box_" + RowCount + "_" + (ColCount + (GData.BoxInSeq - 1))).attr("data-info"));
			GData.CP.EX = EndBoxObj.CX;
			GData.CP.EY = EndBoxObj.CY;

			var TempArr1 = [];
			var TempArr2 = [];

			for (var j = 0; j < GData.BoxInSeq; j++) {
				if ($("#Box_" + RowCount + "_" + (ColCount + j)).hasClass("ClsP1")) {
					TempArr1.push(true);
				}
				else {
					TempArr1.push(false);
				}

				if ($("#Box_" + RowCount + "_" + (ColCount + j)).hasClass("ClsP2")) {
					TempArr2.push(true);
				}
				else {
					TempArr2.push(false);
				}
			}
			//console.log(TempArr1, TempArr2);

			for (var k = 0; k < TempArr1.length; k++) {
				if (TempArr1[k] == false) {
					IsPlayer1 = false;
				}
			}

			for (var n = 0; n < TempArr2.length; n++) {
				if (TempArr2[n] == false) {
					IsPlayer2 = false;
				}
			}
			//console.log(IsPlayer1, IsPlayer2);			
			if (IsPlayer1 == true) {
				GData.WinningPlayer = 1;
				//console.log("Player 1 Wins");
				//break;
			}
			else if (IsPlayer2 == true) {
				GData.WinningPlayer = 2;
				//console.log("Player 2 Wins");
				//break;
			}
			else {
				GData.WinningPlayer = 0;
			}
		}
		else {
			//console.log("Here");
			IsPlayer1 = false;
			IsPlayer2 = false;
		}

		if (IsPlayer1 == true || IsPlayer2 == true) {
			if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
				break;

			}
		}
		ColCount++;
	}

	if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
		ShowWinningBoard();
		return true;
	}
	else {
		ShowFailBoard();
		return false;
	}
}

function ValidateVerticalBox() {
	var ColCount = 0;
	var RowCount = 0;
	var IsPlayer1 = true;
	var IsPlayer2 = true;
	for (var i = 0; i < GData.JData.length; i++) {
		IsPlayer1 = true;
		IsPlayer2 = true;
		if (ColCount > GData.Col - 1) {
			ColCount = 0;
			//RowCount++;
		}

		if (RowCount > GData.Row - 1) {
			RowCount = 0;
			ColCount++;
		}

		var SelectedStartBox = $("#Box_" + RowCount + "_" + ColCount);
		var StartBoxObj = JSON.parse($("#Box_" + RowCount + "_" + ColCount).attr("data-info"));
		GData.CP.SX = StartBoxObj.CX;
		GData.CP.SY = StartBoxObj.CY;

		if (RowCount + (GData.BoxInSeq - 1) < GData.Row) {
			//console.log($("#Box_" + RowCount + "_" + (ColCount + GData.BoxInSeq - 1)));
			var EndBoxObj = JSON.parse($("#Box_" + (RowCount + (GData.BoxInSeq - 1)) + "_" + ColCount).attr("data-info"));
			GData.CP.EX = EndBoxObj.CX;
			GData.CP.EY = EndBoxObj.CY;

			var TempArr1 = [];
			var TempArr2 = [];

			for (var j = 0; j < GData.BoxInSeq; j++) {
				if ($("#Box_" + (RowCount + j) + "_" + ColCount).hasClass("ClsP1")) {
					TempArr1.push(true);
				}
				else {
					TempArr1.push(false);
				}

				if ($("#Box_" + (RowCount + j) + "_" + ColCount).hasClass("ClsP2")) {
					TempArr2.push(true);
				}
				else {
					TempArr2.push(false);
				}
			}
			//console.log(TempArr1, TempArr2);

			for (var k = 0; k < TempArr1.length; k++) {
				if (TempArr1[k] == false) {
					IsPlayer1 = false;
				}
			}

			for (var n = 0; n < TempArr2.length; n++) {
				if (TempArr2[n] == false) {
					IsPlayer2 = false;
				}
			}
			//console.log(IsPlayer1, IsPlayer2);			
			if (IsPlayer1 == true) {
				GData.WinningPlayer = 1;
				//console.log("Player 1 Wins");
				//break;
			}
			else if (IsPlayer2 == true) {
				GData.WinningPlayer = 2;
				//console.log("Player 2 Wins");
				//break;
			}
			else {
				GData.WinningPlayer = 0;
			}
		}
		else {
			//console.log("Here");
			IsPlayer1 = false;
			IsPlayer2 = false;
		}

		if (IsPlayer1 == true || IsPlayer2 == true) {
			if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
				break;

			}
		}
		RowCount++;
	}

	if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
		ShowWinningBoard();
		return true;
	}
	else {
		ShowFailBoard();
		return false;
	}
}


function ValidateDiagonalDownBox() {
	var ColCount = 0;
	var RowCount = 0;
	var IsPlayer1 = true;
	var IsPlayer2 = true;
	for (var i = 0; i < GData.JData.length; i++) {
		IsPlayer1 = true;
		IsPlayer2 = true;
		if (ColCount > GData.Col - 1) {
			ColCount = 0;
			RowCount++;
		}

		if (RowCount > GData.Row - 1) {
			RowCount = 0;
		}

		var SelectedStartBox = $("#Box_" + RowCount + "_" + ColCount);
		var StartBoxObj = JSON.parse($("#Box_" + RowCount + "_" + ColCount).attr("data-info"));
		GData.CP.SX = StartBoxObj.CX;
		GData.CP.SY = StartBoxObj.CY;

		if (ColCount + (GData.BoxInSeq - 1) < GData.Col && RowCount + (GData.BoxInSeq - 1) < GData.Row) {
			//console.log($("#Box_" + RowCount + "_" + (ColCount + GData.BoxInSeq - 1)));
			var EndBoxObj = JSON.parse($("#Box_" + (RowCount + (GData.BoxInSeq - 1)) + "_" + (ColCount + (GData.BoxInSeq - 1))).attr("data-info"));
			GData.CP.EX = EndBoxObj.CX;
			GData.CP.EY = EndBoxObj.CY;

			var TempArr1 = [];
			var TempArr2 = [];

			for (var j = 0; j < GData.BoxInSeq; j++) {
				if ($("#Box_" + (RowCount + j) + "_" + (ColCount + j)).hasClass("ClsP1")) {
					TempArr1.push(true);
				}
				else {
					TempArr1.push(false);
				}

				if ($("#Box_" + (RowCount + j) + "_" + (ColCount + j)).hasClass("ClsP2")) {
					TempArr2.push(true);
				}
				else {
					TempArr2.push(false);
				}
			}
			//console.log(TempArr1, TempArr2);

			for (var k = 0; k < TempArr1.length; k++) {
				if (TempArr1[k] == false) {
					IsPlayer1 = false;
				}
			}

			for (var n = 0; n < TempArr2.length; n++) {
				if (TempArr2[n] == false) {
					IsPlayer2 = false;
				}
			}
			//console.log(IsPlayer1, IsPlayer2);			
			if (IsPlayer1 == true) {
				GData.WinningPlayer = 1;
				//console.log("Player 1 Wins");
				//break;
			}
			else if (IsPlayer2 == true) {
				GData.WinningPlayer = 2;
				//console.log("Player 2 Wins");
				//break;
			}
			else {
				GData.WinningPlayer = 0;
			}
		}
		else {
			//console.log("Here");
			IsPlayer1 = false;
			IsPlayer2 = false;
		}

		if (IsPlayer1 == true || IsPlayer2 == true) {
			if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
				break;

			}
		}
		ColCount++;
	}

	if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
		ShowWinningBoard();
		return true;
	}
	else {
		ShowFailBoard();
		return false;
	}
}

function ValidateDiagonalUpBox() {
	var ColCount = 0;
	var RowCount = 0;
	var IsPlayer1 = true;
	var IsPlayer2 = true;
	for (var i = 0; i < GData.JData.length; i++) {
		IsPlayer1 = true;
		IsPlayer2 = true;
		if (ColCount > GData.Col - 1) {
			ColCount = 0;
			RowCount++;
		}

		if (RowCount > GData.Row - 1) {
			RowCount = 0;
		}

		var SelectedStartBox = $("#Box_" + RowCount + "_" + ColCount);
		var StartBoxObj = JSON.parse($("#Box_" + RowCount + "_" + ColCount).attr("data-info"));
		GData.CP.SX = StartBoxObj.CX;
		GData.CP.SY = StartBoxObj.CY;

		if (ColCount - (GData.BoxInSeq - 1) >= 0 && RowCount + (GData.BoxInSeq - 1) < GData.Row) {
			//console.log($("#Box_" + RowCount + "_" + (ColCount + GData.BoxInSeq - 1)));
			var EndBoxObj = JSON.parse($("#Box_" + (RowCount + (GData.BoxInSeq - 1)) + "_" + (ColCount - (GData.BoxInSeq - 1))).attr("data-info"));
			GData.CP.EX = EndBoxObj.CX;
			GData.CP.EY = EndBoxObj.CY;

			var TempArr1 = [];
			var TempArr2 = [];

			for (var j = 0; j < GData.BoxInSeq; j++) {
				if ($("#Box_" + (RowCount + j) + "_" + (ColCount - j)).hasClass("ClsP1")) {
					TempArr1.push(true);
				}
				else {
					TempArr1.push(false);
				}

				if ($("#Box_" + (RowCount + j) + "_" + (ColCount - j)).hasClass("ClsP2")) {
					TempArr2.push(true);
				}
				else {
					TempArr2.push(false);
				}
			}
			//console.log(TempArr1, TempArr2);

			for (var k = 0; k < TempArr1.length; k++) {
				if (TempArr1[k] == false) {
					IsPlayer1 = false;
				}
			}

			for (var n = 0; n < TempArr2.length; n++) {
				if (TempArr2[n] == false) {
					IsPlayer2 = false;
				}
			}
			//console.log(IsPlayer1, IsPlayer2);			
			if (IsPlayer1 == true) {
				GData.WinningPlayer = 1;
				//console.log("Player 1 Wins");
				//break;
			}
			else if (IsPlayer2 == true) {
				GData.WinningPlayer = 2;
				//console.log("Player 2 Wins");
				//break;
			}
			else {
				GData.WinningPlayer = 0;
			}
		}
		else {
			//console.log("Here");
			IsPlayer1 = false;
			IsPlayer2 = false;
		}

		if (IsPlayer1 == true || IsPlayer2 == true) {
			if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
				break;

			}
		}
		ColCount++;
	}

	if (GData.WinningPlayer == 1 || GData.WinningPlayer == 2) {
		ShowWinningBoard();
		return true;
	}
	else {
		ShowFailBoard();
		return false;
	}
}

function ResetFourInARowActivity() {
	totalCtr = 0;
	GData.PlayerNo = 1;
	GData.IsGameComp = false;
	GData.FillBoxID = "";
	GData.MoveTime = GData.MoveTimeVal;
	GData.CP = { "SX": 0, "SY": 0, "EX": 0, "EY": 0 };
	GData.WinningPlayer = 0;
	$("#WinPlayer0").addClass("ClsHide");
	$("#WinPlayer1").addClass("ClsHide");
	$("#WinPlayer2").addClass("ClsHide");
	$(".ClsBox").removeClass("ClsP1").removeClass("ClsP2");
	$("#WinningBoard").addClass("ClsHide");
	$("#ResetGame").addClass("ClsHide").addClass("ClsDisableCont");
	$("#Player1, #Player2, #IconPlayer1, #IconPlayer2").removeClass("ClsHide");
	$("#Player1").removeClass("ClsDisableCont");
	$("#Player2").addClass("ClsDisableCont");
	//$(".ClsIconBox,.ClsIconMoveBox").removeClass("ClsIconP1").removeClass("ClsIconP2");
	$(".ClsIconMoveBox").addClass("ClsHide");
	$("#GameCont").removeClass("ClsBlockCont");
	ClearDrawing();
}
/*-- Player Functions : Ends --*/

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

function OnAudGameEnded() { }


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