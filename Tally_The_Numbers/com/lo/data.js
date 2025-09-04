/*-- Data Variable and Data Structure : Starts --*/
/*-- Common Variables : Starts --*/
var IsDevice = false; //initiate as false
var TotalScr = 1;
var CanvasWidth = 425;
var CanvasHeight = 113;

var GData = { 
	"CurrScrNo":0, "QuesCount":0, "MaxQues":0,
	"QuesArr1" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
	"QuesArr2" : [12,16,20,8],
	"SelectedQID":0,
	"DivLineWidth":5,
	"IsRandom":false,
	"BoxW":425,
	"BoxH":113,
	"BoxL":2,
	"BoxT":[2,128,254,380]
};
var ZoomFact = 1;
/*Common Variables : Ends*/

// Show/hide Div
function ShowDiv(DivID) {
	$("#" + DivID).css('display','block');
}

function HideDiv(DivID) {
	$("#" + DivID).css('display','none');
}