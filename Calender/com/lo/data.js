/*-- Data Variable and Data Structure : Starts --*/
/*-- Common Variables : Starts --*/
var IsDevice = false; //initiate as false
var TotalScr = 1;
var GData = { 
  "CurrScrNo":0, "ArrQues":[], "QuesCount":0, "MaxQues":0,
  "QuesArr" : [
		{
			"QuesP1":"Today is ",
			"QuesP2":"",
			"QuesP3":" date. Can you tell me where today's date is written in the calendar?",
			"AnsObjID":0	
		},
		{
			"QuesP1":"Today is ",
			"QuesP2":"",
			"QuesP3":". Can you tell me where today's day is written in the calendar?",
			"AnsObjID":1	
		}
	],
	"AnsObj": {"Date":1, "Day":1, "AnsObjID":0},
	"ArrDay":["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
	"SelAnsObj":{"Answer":0, "QuesID":0, "SelectedID":""}
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