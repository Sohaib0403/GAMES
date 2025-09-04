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
    DrawClock();
    ReadyQuestions();    
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

//Shuffle Array
function ShuffleArray(){
    var TempArr = [];
    TempArr = GData.QuesArr;
    GData.QuesArr = [];
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
    GData.QuesArr = TempArr;
};

function ReadyQuestions(){   
    GData.MaxQues = GData.QuesArr.length;
    GData.QuesCount = 0;  
    ShuffleArray();     
    LoadNextQuestion();          
}

function LoadNextQuestion(){    
    if(GData.QuesCount >= GData.MaxQues){
        GData.QuesCount = 0;
        ShuffleArray();
    }    
    $("#DvTime").html(GData.QuesArr[GData.QuesCount].QuesH + ":" + GData.QuesArr[GData.QuesCount].QuesM);        
    SetClockStatus("D");
    BlockClock("E");
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
    if(CtNdlSmall.rotation == Number(GData.QuesArr[GData.QuesCount].AngH)  &&  CtNdlBig.rotation == Number(GData.QuesArr[GData.QuesCount].AngM)){
        SetClockStatus("R");
    }
    else{
        SetClockStatus("W");
    }    
    BlockClock("D");
};

function BlockClock(Status){
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

/*-- screen 0 functions : ends --*/

/*-- Clock Functions : Starts --*/
var IDCvCanv, StgCanv;
var CtBase, CtNdlBig, CtNdlSmall;
var ShpBase0, ShpBase1, ShpBase2, ShpBase3;
var Rt0, Rt1, Rt2, Rt3, Rt4, Rt5;
var NdlBig, NdlSmall;

function DrawClock(){
    IDCvCanv = document.getElementById("CvCanvas");
	StgCanv = new createjs.Stage("CvCanvas");
	StgCanv.enableMouseOver();	
	createjs.Ticker.on("tick", tickCanvas);
	createjs.Touch.enable(StgCanv);
	StgCanv.update();

    CtBase = new createjs.Container(); 
	CtBase.setBounds(0, 0, CanvasWidth - 60, CanvasHeight - 60);
    CtBase.x = 30; CtBase.y = 30;
	StgCanv.addChild(CtBase);

    //Outer
    ShpBase0 = new createjs.Shape(); 
    //ShpBase0.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#eeeeee").drawCircle(0,0,200); 
    ShpBase0.x = 200; ShpBase0.y = 200;     
    CtBase.addChild(ShpBase0);

    ShpBase1 = new createjs.Shape(); 
   // ShpBase1.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#ffffff").drawCircle(0,0,180); 
    ShpBase1.x = 200; ShpBase1.y = 200;     
    CtBase.addChild(ShpBase1);    

    //Line behind numbers
    var Rt0 = new createjs.Shape(); Rt0.graphics.beginFill("#000000").drawRect(0, 0, 2, 360); Rt0.regX = 0; Rt0.regY = 180; Rt0.x = 200; Rt0.y = 200;
    var Rt1 = new createjs.Shape(); Rt1.graphics.beginFill("#000000").drawRect(0, 0, 2, 360); Rt1.regX = 0; Rt1.regY = 180; Rt1.x = 200; Rt1.y = 200;
    var Rt2 = new createjs.Shape(); Rt2.graphics.beginFill("#000000").drawRect(0, 0, 2, 360); Rt2.regX = 0; Rt2.regY = 180; Rt2.x = 200; Rt2.y = 200;
    var Rt3 = new createjs.Shape(); Rt3.graphics.beginFill("#000000").drawRect(0, 0, 2, 360); Rt3.regX = 0; Rt3.regY = 180; Rt3.x = 200; Rt3.y = 200;
    var Rt4 = new createjs.Shape(); Rt4.graphics.beginFill("#000000").drawRect(0, 0, 2, 360); Rt4.regX = 0; Rt4.regY = 180; Rt4.x = 200; Rt4.y = 200;
    var Rt5 = new createjs.Shape(); Rt5.graphics.beginFill("#000000").drawRect(0, 0, 2, 360); Rt5.regX = 0; Rt5.regY = 180; Rt5.x = 200; Rt5.y = 200;
    Rt0.rotation = 0; Rt1.rotation = 30; Rt2.rotation = 60; Rt3.rotation = 90; Rt4.rotation = 120; Rt5.rotation = 150;           
    CtBase.addChild(Rt0, Rt1, Rt2, Rt3, Rt4, Rt5);  
    
    //base above lines
    ShpBase2 = new createjs.Shape(); 
   // ShpBase2.graphics.setStrokeStyle(2).beginStroke("#ffffff").beginFill("#ffffff").drawCircle(0,0,170); 
    ShpBase2.x = 200; ShpBase2.y = 200;     
    CtBase.addChild(ShpBase2);

    var FontString = "bold " + "24px " + "Arial";
    var Num1 = new createjs.Text(); Num1.set({text: "1", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 280, y: 68 });
    var Num2 = new createjs.Text(); Num2.set({text: "2", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 338, y: 126 });
    var Num3 = new createjs.Text(); Num3.set({text: "3", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 360, y: 204});
    var Num4 = new createjs.Text(); Num4.set({text: "4", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 337, y: 281 });
    var Num5 = new createjs.Text(); Num5.set({text: "5", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 278, y: 338});
    var Num6 = new createjs.Text(); Num6.set({text: "6", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 201, y: 355 });
    var Num7 = new createjs.Text(); Num7.set({text: "7", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 125, y: 338 });
    var Num8 = new createjs.Text(); Num8.set({text: "8", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 63, y: 280 });
    var Num9 = new createjs.Text(); Num9.set({text: "9", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 40, y: 204 });
    var Num10 = new createjs.Text(); Num10.set({text: "10", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 66, y: 126 });
    var Num11 = new createjs.Text(); Num11.set({text: "11", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 120, y: 68 });
    var Num12 = new createjs.Text(); Num12.set({text: "12", textAlign: "center", textBaseline: "middle", font: FontString, color: "#000000", x: 201, y: 45 });

    CtBase.addChild(Num1, Num2, Num3, Num4, Num5, Num6, Num7, Num8, Num9, Num10, Num11, Num12);

    CtNdlBig = new createjs.Container(); 
	CtNdlBig.setBounds(0, 0, 15, 15);
    CtNdlBig.regX = 7.5; CtNdlBig.regY = 7.5;
    CtNdlBig.x = 200; CtNdlBig.y = 200;
	CtBase.addChild(CtNdlBig);

    NdlBig = new createjs.Shape(); NdlBig.graphics.beginFill("#000000").drawRoundRect(0, 0, 15, 140, 10, 10, 10, 10);     
    NdlBig.x = 0; NdlBig.y = 7.5;    
    NdlBig.cursor = "pointer";
    CtNdlBig.addChild(NdlBig);

    NdlBig.on("mousedown", HandleMouseDownNdl);
	NdlBig.on("pressmove", HandlePressMoveNdl);	
	NdlBig.on("pressup", HandlePressUpNdl);

    CtNdlSmall = new createjs.Container(); 
	CtNdlSmall.setBounds(0, 0, 15, 15);
    CtNdlSmall.regX = 7.5; CtNdlSmall.regY = 7.5;
    CtNdlSmall.x = 200; CtNdlSmall.y = 200;
	CtBase.addChild(CtNdlSmall);

    NdlSmall = new createjs.Shape(); NdlSmall.graphics.beginFill("#000000").drawRoundRect(0, 0, 15, 110, 10, 10, 10, 10);     
    NdlSmall.x = 0; NdlSmall.y = 7.5;    
    NdlSmall.cursor = "pointer";
    CtNdlSmall.addChild(NdlSmall);

    NdlSmall.on("mousedown", HandleMouseDownNdl);
	NdlSmall.on("pressmove", HandlePressMoveNdl);	
	NdlSmall.on("pressup", HandlePressUpNdl);

    // Center Black Dot
    ShpBase3 = new createjs.Shape(); 
    ShpBase3.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#000000").drawCircle(0,0,15); 
    ShpBase3.x = 200; ShpBase3.y = 200;     
    CtBase.addChild(ShpBase3);    
    SetClockStatus("D");    
    StgCanv.update();
}

function HandleMouseDownNdl(e){
    ShowDiv("DvCheckAns");
}

function HandlePressMoveNdl(e){
    var center_x = this.parent.x + 7.5;
    var center_y = this.parent.y + 7.5;
    var mouse_x = (StgCanv.mouseX/StgCanv.scaleX);
    var mouse_y = (StgCanv.mouseY/StgCanv.scaleY); 
    var radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
    var RotAngle = Number((((radians * (180 / Math.PI) * - 1))).toFixed(2));
	this.parent.rotation = RotAngle;
}

function HandlePressUpNdl(e){   
    var BigRotAng = CtNdlBig.rotation;
    var SmallRotAng = CtNdlSmall.rotation;
    if(BigRotAng < 0){BigRotAng = 360 + BigRotAng;}
    if(SmallRotAng < 0){SmallRotAng = 360 + SmallRotAng;}

    CtNdlBig.rotation = BigRotAng;
    CtNdlSmall.rotation = SmallRotAng;

    if(this.parent.rotation >= 15 && this.parent.rotation < 45){this.parent.rotation = 30;}
    else if(this.parent.rotation >= 45 && this.parent.rotation < 75){this.parent.rotation = 60;}
    else if(this.parent.rotation >= 75 && this.parent.rotation < 105){this.parent.rotation = 90;}
    else if(this.parent.rotation >= 105 && this.parent.rotation < 135){this.parent.rotation = 120;}
    else if(this.parent.rotation >= 135 && this.parent.rotation < 165){this.parent.rotation = 150;}
    else if(this.parent.rotation >= 165 && this.parent.rotation < 195){this.parent.rotation = 180;}

    else if(this.parent.rotation >= 195 && this.parent.rotation < 225){this.parent.rotation = 210;}
    else if(this.parent.rotation >= 225 && this.parent.rotation < 255){this.parent.rotation = 240;}
    else if(this.parent.rotation >= 225 && this.parent.rotation < 285){this.parent.rotation = 270;}
    else if(this.parent.rotation >= 285 && this.parent.rotation < 315){this.parent.rotation = 300;}
    else if(this.parent.rotation >= 315 && this.parent.rotation < 345){this.parent.rotation = 330;}
    else if(this.parent.rotation >= 345 && this.parent.rotation < 360){this.parent.rotation = 0;}
    else if(this.parent.rotation >= 0 && this.parent.rotation < 15){this.parent.rotation = 0;}        
}

function SetClockStatus(Status){
    ShpBase1.graphics.clear(); ShpBase2.graphics.clear();
    if(Status == "R"){
        ShpBase1.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#7ccd7c").drawCircle(0,0,180);
        ShpBase2.graphics.setStrokeStyle(2).beginStroke("#7ccd7c").beginFill("#7ccd7c").drawCircle(0,0,170);
        CtNdlSmall.rotation = GData.QuesArr[GData.QuesCount].AngH;
        CtNdlBig.rotation = GData.QuesArr[GData.QuesCount].AngM;
        UpdateFooterButton();        
                      
    }
    else if(Status == "W"){
        ShpBase1.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#fa5e5e").drawCircle(0,0,180);
        ShpBase2.graphics.setStrokeStyle(2).beginStroke("#fa5e5e").beginFill("#fa5e5e").drawCircle(0,0,170);
        setTimeout(function(){
            ShpBase1.graphics.clear(); ShpBase2.graphics.clear();
            ShpBase1.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#ffffff").drawCircle(0,0,180);
            ShpBase2.graphics.setStrokeStyle(2).beginStroke("#ffffff").beginFill("#ffffff").drawCircle(0,0,170);
            CtNdlSmall.rotation = GData.QuesArr[GData.QuesCount].AngH;
            CtNdlBig.rotation = GData.QuesArr[GData.QuesCount].AngM;
            UpdateFooterButton();
        }, 1000);
    }
    else if(Status == "D"){
        ShpBase1.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill("#ffffff").drawCircle(0,0,180);
        ShpBase2.graphics.setStrokeStyle(2).beginStroke("#ffffff").beginFill("#ffffff").drawCircle(0,0,170); 
        CtNdlSmall.rotation = 120; CtNdlBig.rotation = 240;
    }
}

function tickCanvas(event) {
	try {StgCanv.update();}
	catch (err) { }	
};

/*-- Clock Functions : Ends --*/

/*-- Game Functions : Ends --*/