/*-- Data Variable and Data Structure : Starts --*/
/*-- Common Variables : Starts --*/
var IsDevice = false; //initiate as false
var TotalScr = 1;
var CanvasWidth = 460;
var CanvasHeight = 460;
var GData = { 
  "CurrScrNo":0, "ArrQues":[], "QuesCount":0, "MaxQues":0,
  "QuesArr" : [
		{"QuesH":"1", "QuesM":"00", "AngH":210, "AngM":180},
		{"QuesH":"1", "QuesM":"30", "AngH":210, "AngM":0},
		{"QuesH":"2", "QuesM":"00", "AngH":240, "AngM":180},
		{"QuesH":"2", "QuesM":"30", "AngH":240, "AngM":0},
		{"QuesH":"3", "QuesM":"00", "AngH":270, "AngM":180},
		{"QuesH":"3", "QuesM":"30", "AngH":270, "AngM":0},
		{"QuesH":"4", "QuesM":"00", "AngH":300, "AngM":180},
		{"QuesH":"4", "QuesM":"30", "AngH":300, "AngM":0},
		{"QuesH":"5", "QuesM":"00", "AngH":330, "AngM":180},
		{"QuesH":"5", "QuesM":"30", "AngH":330, "AngM":0},
		{"QuesH":"6", "QuesM":"00", "AngH":0, "AngM":180},
		{"QuesH":"6", "QuesM":"30", "AngH":0, "AngM":0},
		{"QuesH":"7", "QuesM":"00", "AngH":30, "AngM":180},
		{"QuesH":"7", "QuesM":"30", "AngH":30, "AngM":0},
		{"QuesH":"8", "QuesM":"00", "AngH":60, "AngM":180},
		{"QuesH":"8", "QuesM":"30", "AngH":60, "AngM":0},
		{"QuesH":"9", "QuesM":"00", "AngH":90, "AngM":180},
		{"QuesH":"9", "QuesM":"30", "AngH":90, "AngM":0},
		{"QuesH":"10", "QuesM":"00", "AngH":120, "AngM":180},
		{"QuesH":"10", "QuesM":"30", "AngH":120, "AngM":0},
		{"QuesH":"11", "QuesM":"00", "AngH":150, "AngM":180},
		{"QuesH":"11", "QuesM":"30", "AngH":150, "AngM":0},
		{"QuesH":"12", "QuesM":"00", "AngH":180, "AngM":180},
		{"QuesH":"12", "QuesM":"30", "AngH":180, "AngM":0}
	],
	"AnsArr":{"AngH":0, "AngM":0}
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