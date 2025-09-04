$(document).ready(function () {

	updategame();

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
var IsServer = false;
var D = {
	"CurrScrNo": 0,
	"JD": null,
	"MaxScreen": 0,
	"CurrQuesScr": 0,
	"DragLmt": { "MinX": 0, "MinY": 0, "MaxX": 1600, "MaxY": 710 },
	"CorrectCount": 0,
	"QMarks": 10, "MistakeCount": 0,
	"Score": 0,
	"ArrQStatus": [],
	"TimeDur": 250,
	"XYD": [{ "X": 196, "Y": 76 }, { "X": 535, "Y": 76 }, { "X": 873, "Y": 76 }],
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
		HideDiv("DvInitialScreen");
	});

	/*-- Screen 0 --*/

	$("#DvStartBtn").mousedown(function (e) { LoadScreen(1); });
	$("#DvPrev, #DvNext").mousedown(function (e) { LoadNextScreen(e); });
	$("#DvCheck").mousedown(function (e) { CheckAnswer(); });
	$("#DvReplay").mousedown(function (e) { ResetActivity(); });

	$(".DvScrhome").mousedown(function (e) {
		ReloadGame();
	});

	$("#AudCorrect").on('ended', function () { OnAudioEndedCall(); });
	$("#AudIncorrect").on('ended', function () { OnAudioEndedCall(); });

	// Word click events to load different Word_data
	$("#DvWord1").mousedown(function () { LoadWordData(Word_data_1); });
	$("#DvWord2").mousedown(function () { LoadWordData(Word_data_2); });
	$("#DvWord3").mousedown(function () { LoadWordData(Word_data_3); });
	$("#DvWord4").mousedown(function () { LoadWordData(Word_data_4); });
	$("#DvWord5").mousedown(function () { LoadWordData(Word_data_5); });
};



function ReloadGame() {
    location.reload(); 
}


function LoadWordData(wordData) {
	try {
		D.JD = JSON.parse(JSON.stringify(wordData)); // Deep copy
		D.MaxScreen = D.JD.length;
		for (var i = 0; i < D.MaxScreen; i++) {
			ShuffleArray(D.JD[i].Affixes);
		}
		ShuffleArray(D.JD);
		GenerateScreens();
		LoadScreen(1); // Load first screen
	}
	catch (Err) {
		DisplayError(Err);
	}
}



/*-- Game Functions : Starts --*/
function InitActivity() {
	LoadScreen(0);
	if (location.hostname === '') { IsServer = false; } else { IsServer = true; }
	D.JD = JSON.parse(JSON.stringify(Word_data));
	D.MaxScreen = D.JD.length;
	for (var i = 0; i < D.MaxScreen; i++) {
		ShuffleArray(D.JD[i].Affixes);
	}
	ShuffleArray(D.JD);
	GenerateScreens();
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
		default:
			ShowDiv("DvScr3"); D.CurrScrNo = 0;
			break;
	}
}

function ShuffleArray(TempArr) {
	var currentIndex = TempArr.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = TempArr[currentIndex];
		TempArr[currentIndex] = TempArr[randomIndex];
		TempArr[randomIndex] = temporaryValue;
	}
};

/*-- Game Functions : Ends --*/

document.addEventListener('DOMContentLoaded', function () {});

function DisplayError(Err) {
	//console.log(Err);
}