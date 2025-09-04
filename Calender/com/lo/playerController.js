/*-- Document Ready Starts --*/
$(document).ready(function() {		
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
		IsDevice = true;
	}	
	$(".row").remove();
	resizeHandler();		
	document.ontouchmove = function(e) {};		
	RegisterEvents();	
	RegisterScreenEvents();
	InitActivity();	
});
/*-- Document Ready Ends --*/

/*-- Common Framework Functions Starts --*/
function RegisterEvents(){	
	$(window).resize(function() {resizeHandler();});
	$(window).on("orientationchange", function( event ) {resizeHandler();});
	$("div").mousedown(function(e) {});
	$("html").mousedown(function(e) {});		
};

/*-- Game Functions : Starts --*/
function RegisterScreenEvents(){
	$("#DvCheckAns").mousedown(function(e){HandleCheckAns(e)});
    $("#DvNextQues").mousedown(function(e){HandleNextQues(e)});
    $("#DvReplay").mousedown(function(e){HandleReplay(e)});    
};

function InitActivity(){		
	LoadScreen(0);	
	//if (location.hostname === ''){IsServer = false;}else{IsServer = true;}	
	var date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
    document.getElementById("curMonth").innerHTML = months[month];
    document.getElementById("curYear").innerHTML = year;
    loadCalendarMonths();
    loadCalendarYears();
    loadCalendarDays();	
    ReadyQuestions();
    $(".day").mousedown(function(e){HandleDayMouseDown(e)});
    $(".dayName").mousedown(function(e){HandleDayNameMouseDown(e)});
}

function HideAllScreen(){
	for(var i=0; i<TotalScr; i++){
		HideDiv("DvScr"+i);
	}
}

function LoadScreen(ScrNo){	
	HideAllScreen();
	switch(ScrNo){
		case 0:
			ShowDiv("DvScr0"); GData.CurrScrNo = 0;
			break;		
		default:
			ShowDiv("DvScr0"); GData.CurrScrNo = 0;
			break;
	}
}

/*-- screen 0 functions : starts --*/

var months = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसंबर"];
var startYear = 2000;
var endYear = 2020;
var month = 0;
var year = 0;

function loadCalendarMonths() {
    for (var i = 0; i < months.length; i++) {
        var doc = document.createElement("div");
        doc.innerHTML = months[i];
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            var selectedMonth = i;
            return function () {
                month = selectedMonth;
                document.getElementById("curMonth").innerHTML = months[month];
                loadCalendarDays();
                return month;
            }
        })();

        document.getElementById("months").appendChild(doc);
    }
}

function loadCalendarYears() {
    document.getElementById("years").innerHTML = "";

    for (var i = startYear; i <= endYear; i++) {
        var doc = document.createElement("div");
        doc.innerHTML = i;
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            var selectedYear = i;
            return function () {
                year = selectedYear;
                document.getElementById("curYear").innerHTML = year;
                loadCalendarDays();
                return year;
            }
        })();

        document.getElementById("years").appendChild(doc);
    }
}

function loadCalendarDays() {
    document.getElementById("calendarDays").innerHTML = "";

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay();       // find where to start calendar day of week

    for (var i = 0; i <= dayofweek; i++) {
        var d = document.createElement("div");
        d.classList.add("day");
        d.classList.add("blank");
        document.getElementById("calendarDays").appendChild(d);
    }

    for (var i = 0; i < num; i++) {
        var tmp = i + 1;
        var d = document.createElement("div");
        d.id = "calendarday_" + i;        
        d.className = "day";
        d.innerHTML = tmp;

        document.getElementById("calendarDays").appendChild(d);
    }

    var clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
}

function daysInMonth(month, year)
{
    var d = new Date(year, month+1, 0);
    return d.getDate();
}

//Shuffle Array
function ShuffleArray(){
    var TempArr = [];
    TempArr = GData.ArrQues;
    GData.ArrQues = [];
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
    GData.ArrQues = TempArr;
    //console.log(GData.ArrQues);
	//return TempArr;	
};

function ReadyQuestions(){  
    var d = new Date();
    GData.AnsObj.Date = d.getDate();
    GData.AnsObj.Day = d.getDay();

    GData.MaxQues = GData.QuesArr.length;   

    for(var i=0; i<GData.MaxQues; i++){
        GData.ArrQues.push(i);
    }
    ShuffleArray(); 
    GData.QuesCount = 0;
    LoadNextQuestion();     
    
    $("#calendarDays div").each(function(i){  
        //console.log($(this).hasClass("ClsSelectedDay"));
        if($(this).hasClass("blank")){
            $(this).addClass("ClsDisableCont");
        }              
    });
}

function LoadNextQuestion(){
    var CurrentIndex = 0;
    if(GData.QuesCount >= GData.MaxQues){
        GData.QuesCount = 0;
        ShuffleArray();
    }
    CurrentIndex = GData.ArrQues[GData.QuesCount];    
    $("#DvQuestion").html("");

    if(GData.QuesArr[CurrentIndex].AnsObjID == 0){
        GData.QuesArr[CurrentIndex].QuesP2 = GData.AnsObj.Date;
    }
    else if(GData.QuesArr[CurrentIndex].AnsObjID == 1){
        GData.QuesArr[CurrentIndex].QuesP2 = GetDayName(GData.AnsObj.Day);
    }    
    //GData.AnsObj.AnsObjID = GData.QuesArr[CurrentIndex].AnsObjID;    
    GData.SelAnsObj.QuesID = GData.QuesArr[CurrentIndex].AnsObjID;
    $("#DvQuestion").html(GData.QuesArr[CurrentIndex].QuesP1 + GData.QuesArr[CurrentIndex].QuesP2 + GData.QuesArr[CurrentIndex].QuesP3); 
    BlockCalender("E");  
    ResetAllDays(); 
}

function GetDayName(DayId){
    var DayName = "";
    if(DayId == 0){DayName = "Sunday";}
    else if(DayId == 1){DayName = "Monday";}
    else if(DayId == 2){DayName = "Tuesday";}
    else if(DayId == 3){DayName = "Wednesday";}
    else if(DayId == 4){DayName = "Thursday";}
    else if(DayId == 5){DayName = "Friday";}
    else if(DayId == 6){DayName = "Saturday";}
    return DayName;
}

function UpdateFooterButton(){
    HidAllFooterBtn();
    if(GData.QuesCount == GData.MaxQues - 1){
        ShowDiv("DvReplay");
    }
    else if(GData.QuesCount < GData.MaxQues-1){
        ShowDiv("DvNextQues");
    }
}

function HidAllFooterBtn(){
    HideDiv("DvCheckAns");
    HideDiv("DvNextQues");
    HideDiv("DvReplay");
}

function HandleCheckAns(e){
    HidAllFooterBtn();
    var DivID = "";
    var CorrectDivID = "";
    var IsCorrect = false;
    if(GData.SelAnsObj.QuesID == 0){                
        $("#calendarDays div").each(function(i){  
            //console.log($(this).hasClass("ClsSelectedDay"));
            if($(this).hasClass("ClsSelectedDay")){
                if(Number($(this).html()) == GData.AnsObj.Date){
                    IsCorrect = true; 
                    //console.log($(this).attr("id"));
                    DivID = $(this).attr("id");
                    return false;
                }
            }
            
            if(Number($(this).html()) == GData.AnsObj.Date){                
                CorrectDivID = $(this).attr("id");                
            }
        });
    }
    else if(GData.SelAnsObj.QuesID == 1){
        $("#DvDays div").each(function(i){   
            //console.log($(this).hasClass("ClsSelectedDay"));         
            if($(this).hasClass("ClsSelectedDay")){
                if(Number($(this).attr("data-value")) == GData.AnsObj.Day){
                    IsCorrect = true;
                    //console.log($(this).attr("id"));
                    DivID = $(this).attr("id");
                    return false;
                }
            }
            
            if(Number($(this).attr("data-value")) == GData.AnsObj.Day){
                CorrectDivID = $(this).attr("id");                
            }
        });
    }

    ResetAllDays();

    //console.log(IsCorrect, DivID);
    if(IsCorrect){
        $("#"+DivID).addClass("ClsRightSelect");
    }
    else{
        $("#"+GData.SelAnsObj.SelectedID).addClass("ClsWrongSelect");
        $("#"+CorrectDivID).addClass("ClsRightSelect");
    }
    BlockCalender("D");
    UpdateFooterButton();
};

function BlockCalender(Status){
    if(Status == "E"){
        $("#DvBody").removeClass("ClsDisableCont");
    }
    else if(Status == "D"){
        $("#DvBody").addClass("ClsDisableCont");
    }
}

function HandleNextQues(e){
    HidAllFooterBtn();   
    GData.QuesCount++; 
    LoadNextQuestion();
};

function HandleReplay(e){
    HidAllFooterBtn();  
    GData.QuesCount++;   
    LoadNextQuestion();
};

function HandleDayMouseDown(e){
    ResetAllDays();
    //console.log($("#"+e.target.id).html());
    $("#"+e.target.id).addClass("ClsSelectedDay");
    GData.SelAnsObj.SelectedID = e.target.id;
    // if($("#"+e.target.id).hasClass("dayName")){
    //     GData.SelAnsObj.QuesID = 1;
    // }
    // else{
    //     GData.SelAnsObj.QuesID = 0;
    // }

    HidAllFooterBtn();
    ShowDiv("DvCheckAns");

}

function HandleDayNameMouseDown(e){
    ResetAllDays();
    //console.log($("#"+e.target.id).html());
    $("#"+e.target.id).addClass("ClsSelectedDay");
    // if($("#"+e.target.id).hasClass("dayName")){
    //     GData.SelAnsObj.QuesID = 1;
    // }
    // else{
    //     GData.SelAnsObj.QuesID = 0;
    // }
    HidAllFooterBtn();
    ShowDiv("DvCheckAns");
}

function ResetAllDays(){
    $("#calendarDays div").each(function(i){
        //var ThisID = this.id;
        //console.log(ThisID);
        $(this).removeClass("ClsSelectedDay");
        $(this).removeClass("ClsWrongSelect");
        $(this).removeClass("ClsRightSelect");
    });

    $("#DvDays div").each(function(i){
        //var ThisID = this.id;
        //console.log(ThisID);
        $(this).removeClass("ClsSelectedDay");
        $(this).removeClass("ClsWrongSelect");
        $(this).removeClass("ClsRightSelect");
    });
}
/*-- screen 0 functions : ends --*/



/*-- Game Functions : Ends --*/