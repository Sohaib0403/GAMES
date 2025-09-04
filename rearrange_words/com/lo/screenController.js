/*-- Screen 1 Functions : Starts --*/
var prevQues = false;

function GenerateScreens(){
	try{
		var DvPanel1 = document.getElementById("DvPanel1");
		D.ArrQStatus = [];
		for(var i=0; i<D.MaxScreen; i++){			
			D.ArrQStatus.push(false);
			var QScreenDiv = document.createElement("div");
			QScreenDiv.setAttribute("id", "DvQuesScrn"+i);			
			QScreenDiv.className = "ClsQuesScrnCont";
			//QScreenDiv.classList.add("ClsContDrag"+D.JD[i].Affixes.length);
			DvPanel1.appendChild(QScreenDiv);

			for(var j=0; j<D.JD[i].Affixes.length; j++){

				var dragdiv = document.createElement("div");
				dragdiv.setAttribute("id", "DvDrag"+i+"_"+j);	
				dragdiv.setAttribute("data-id", D.JD[i].Affixes[j].ID);
				dragdiv.setAttribute("data-value", j);
				dragdiv.setAttribute("data-dropid", j);																
				dragdiv.className = "ClsDrag";
				dragdiv.classList.add("ClsDrag"+j);
				dragdiv.innerHTML = D.JD[i].Affixes[j].Text;
				QScreenDiv.appendChild(dragdiv);				
			}

			for(var j=0; j<D.JD[i].Affixes.length; j++){
				var dropdiv = document.createElement("div");
				dropdiv.setAttribute("id", "DvDrop"+i+"_"+j);					
				dropdiv.setAttribute("data-value", j);
				dropdiv.setAttribute("data-dragid", j);
				dropdiv.setAttribute("data-xval", D.XYD[j].X);	
				dropdiv.setAttribute("data-yval", D.XYD[j].Y);								
				dropdiv.className = "ClsDrop";
				dropdiv.classList.add("ClsDrop"+j);
				dropdiv.classList.add("ClsDropHide");				
				QScreenDiv.appendChild(dropdiv);
			}


			var AnswerBox = document.createElement("div");
			AnswerBox.setAttribute("id", "DvAnswerBox"+i);			
			AnswerBox.className = "ClsAnswerBox";
			AnswerBox.classList.add("ClsABoxD");
			QScreenDiv.appendChild(AnswerBox);
			
		}

		$(".ClsDrag").draggable({
			containment: "DvMainCont",
			/*revert:true,*/
			start: function (e, ui) {		
				//var originalRuler = ui.originalPosition;
				var DragID = e.target.id;
				$("#"+DragID).css("z-index", 1000);
				D.CurrDragXY.X = parseInt($("#"+DragID).css("left"),10);
				D.CurrDragXY.Y = parseInt($("#"+DragID).css("top"),10);						
				$(".ClsDrop").removeClass("ClsDropHide").addClass("ClsDropShow");
				D.OID.FDragID = Number($("#"+DragID).attr("data-value"));
				var TempNo = Number($("#"+DragID).attr("data-dropid"));
				D.OID.FDropID = Number($("#DvDrop"+D.CurrQuesScr + "_" + TempNo).attr("data-value"));															
			},
			drag: function (e, ui) {				
				wrapperRulerLeft = $("#DvMainCont").offset().left;
				var changeLeft = ui.position.left;
				var newLeft = changeLeft / DragDropScale.x; 
				var changeTop = ui.position.top;
				var newTop = changeTop / DragDropScale.y;

				var DragItemWidth = Number($(this).width()) * 2;
				var DragItemHeight = Number($(this).height());

				/*-- drag limits : starts --*/
				if(newLeft <= D.DragLmt.MinX){newLeft = D.DragLmt.MinX;}				
				if(newTop <= D.DragLmt.MinY){newTop = D.DragLmt.MinY;}				
				if(newLeft >= D.DragLmt.MaxX - DragItemWidth + 60){newLeft = D.DragLmt.MaxX - DragItemWidth + 60;}				
				//if(newLeft >= D.DragLmt.MaxX - DragItemWidth){newLeft = D.DragLmt.MaxX - DragItemWidth;}				
				if(newTop >= D.DragLmt.MaxY - DragItemHeight){newTop = D.DragLmt.MaxY - DragItemHeight;}
				/*-- drag limits : ends --*/
						
				ui.position.left = newLeft;
				ui.position.top = 150;										
			},
			stop: function (e, ui) {		
    e.stopPropagation();			
    var DragID = e.target.id;					
    var allElements = document.elementsFromPoint(e.clientX, e.clientY);
    var dropElm = getDropingElement(allElements);

    if (dropElm) {
        var DropID = $(dropElm).attr("id");
        D.OID.SDropID = Number($("#"+DropID).attr("data-value"));
        var TempNo = Number($("#"+DropID).attr("data-dragid"));
        D.OID.SDragID = Number($("#DvDrag"+D.CurrQuesScr + "_" + TempNo).attr("data-value"));

        // Get left positions from drops (fixed CSS)
        var FDropLeft = Number($("#DvDrop"+ D.CurrQuesScr + "_" + D.OID.FDropID).css("left").replace("px", ""));
        var SDropLeft = Number($("#DvDrop"+ D.CurrQuesScr + "_" + D.OID.SDropID).css("left").replace("px", ""));

        // Move the dragged elements to the correct left positions:
        // Animate both swaps smoothly:
        $("#DvDrag"+ D.CurrQuesScr + "_" + D.OID.FDragID).animate({
            left: SDropLeft + "px"
        }, D.TimeDur);

        $("#DvDrag"+ D.CurrQuesScr + "_" + D.OID.SDragID).animate({
            left: FDropLeft + "px"
        }, D.TimeDur);

        // Update their data-dropid attributes
        $("#DvDrag"+ D.CurrQuesScr + "_" + D.OID.FDragID).attr("data-dropid", D.OID.SDropID);
        $("#DvDrag"+ D.CurrQuesScr + "_" + D.OID.SDragID).attr("data-dropid", D.OID.FDropID);

        // Update drops' data-dragid attributes
        $("#DvDrop"+ D.CurrQuesScr + "_" + D.OID.FDropID).attr("data-dragid", D.OID.SDragID);
        $("#DvDrop"+ D.CurrQuesScr + "_" + D.OID.SDropID).attr("data-dragid", D.OID.FDragID);

        // Reset temp vars
        D.OID.FDragID = null;
        D.OID.FDropID = null;
        D.OID.SDragID = null;
        D.OID.SDropID = null;					
    }
    else {
        // Reset dragged element position if no drop
        $("#"+DragID).removeAttr("style");
        $("#"+DragID).css("top",D.CurrDragXY.Y + "px");
        $("#"+DragID).css("left",D.CurrDragXY.X + "px");
    }

    D.CurrDragXY.X = null;
    D.CurrDragXY.Y = null;									
    $("#"+DragID).css("z-index", 0);
    $(".ClsDrop").removeClass("ClsDropShow").addClass("ClsDropHide");																		
}

		});	

		setTimeout(function(){
			LoadNextQues(); 
			UpdateNavBtn();
		},100);
		
	}
	catch(Err){DisplayError(Err);}
};

function getDropingElement(array) {
	for (let index = 0; index < array.length; index++) {
		const element = array[index];
		if (element.classList.contains("ClsDrop0")) {
			return element
		}
		if (element.classList.contains("ClsDrop1")) {
			return element
		}
		if (element.classList.contains("ClsDrop2")) {
			return element
		}
	}
}

var Marks;

/*--Ques Function : Starts--*/
function LoadNextQues(){
 	try{

		HideAllQuestion();
		ShowDiv("DvQuesScrn"+D.CurrQuesScr);
		if(!D.ArrQStatus[D.CurrQuesScr]){
			$("#DvCheck").removeClass("ClsDisable").addClass("ClsEnable");
		}
		else{
			$("#DvCheck").removeClass("ClsEnable").addClass("ClsDisable");
		}
		
	}
	catch(Err){DisplayError(Err);}
}


function LoadNextScreen(e){
	try{
		if(e.target.id == "DvPrev"){
			D.CurrQuesScr--;
			
			LoadNextQues();
		}
		else if(e.target.id == "DvNext"){
			if(D.CurrQuesScr == D.MaxScreen - 1){
				PlayScoreEndAud();
				LoadScreen(2);															
			}
			else{
				D.CurrQuesScr++;
				LoadNextQues();
			}
		}	
		UpdateNavBtn();
	}
	catch(Err){DisplayError(Err);}
};
/*--Ques Function : Ends--*/

/*--Navigation Function : Starts--*/
function HideAllQuestion(){
	try{
		for(var i=0; i<D.MaxScreen; i++){
			HideDiv("DvQuesScrn"+i); 
		}
	}
	catch(Err){DisplayError(Err);}	
}
function UpdateNavBtn(){
	try{
		if(D.MaxScreen == 1){
			HideDiv("DvPrev"); HideDiv("DvNext");
			return;
		}
		$("#DvPrev, #DvNext").addClass("ClsDisable");	
		if(D.CurrQuesScr > 0){
			$("#DvPrev").removeClass("ClsDisable");			
		}		

		if(D.CurrQuesScr >= 0 && D.CurrQuesScr <= D.MaxScreen-1 && D.ArrQStatus[D.CurrQuesScr]){			
			$("#DvNext").removeClass("ClsDisable");
		}		
	}
	catch(Err){DisplayError(Err);}
};
/*--Navigation Function : Ends--*/



/*--Result Function : Starts--*/

function CheckAnswer(){
	
	var AnsStr = "";
	D.AnsStr.V = "";	
	for(var i=0; i<D.JD[D.CurrQuesScr].Affixes.length; i++){
		var DragID = Number($("#DvDrop"+ D.CurrQuesScr + "_" +i).attr("data-dragid"));		
		AnsStr = AnsStr + $("#DvDrag"+ D.CurrQuesScr + "_" +DragID).html();
		D.AnsStr.V = D.AnsStr.V + $("#DvDrag"+ D.CurrQuesScr + "_" +DragID).attr("data-id");		
	}
	AnsStr = AnsStr.trim();
	
	if(AnsStr == D.JD[D.CurrQuesScr].Word){
		$("#DvAnswerBox"+D.CurrQuesScr).html(D.JD[D.CurrQuesScr].DisplayWord);
		$("#DvAnswerBox"+D.CurrQuesScr).removeClass("ClsABoxD").removeClass("ClsABoxW").addClass("ClsABoxC");
		PlayCorrectAud();		
		D.CorrectCount++;
		Marks = D.QMarks;
		D.ArrQStatus[D.CurrQuesScr] = true;
		$("#DvCheck").removeClass("ClsEnable").addClass("ClsDisable");
		$("#DvDrag"+ D.CurrQuesScr + "_0").addClass("ClsDisable");
		$("#DvDrag"+ D.CurrQuesScr + "_1").addClass("ClsDisable");
		$("#DvDrag"+ D.CurrQuesScr + "_2").addClass("ClsDisable");
		
		if(Marks<=0){Marks = 0;}

		D.Score = D.Score + Marks;
		prevQues = false;
	
	}
	else{
		$("#DvAnswerBox"+D.CurrQuesScr).html(AnsStr);
		$("#DvAnswerBox"+D.CurrQuesScr).removeClass("ClsABoxD").removeClass("ClsABoxC").addClass("ClsABoxW");
		PlayIncorrectAud();	
		//Marks--;
		if(prevQues == false){
			D.Score = D.Score - 10;
			prevQues = true;
		}
		if(Marks<=0){Marks = 0;}
		
	}
	
	
	$("#DvMainCont").addClass("ClsDisable");
	D.AnsStr.V = "";			
    
	

	$("#DvText2").html("You scored <span class='ClsNumSpan'>" + D.Score + "</span> points!");
	
	
}

/*--Result Function : Ends--*/

/*--Audio Function : Starts--*/
function PlayCorrectAud(){$("#AudCorrect")[0].play();}
function PlayIncorrectAud(){$("#AudIncorrect")[0].play();}
function PlayScoreEndAud(){$("#AudScoreSound")[0].play();}
function OnAudioEndedCall(){
	 $("#DvMainCont").removeClass("ClsDisable");
	 //console.log("Here");
	 UpdateNavBtn();
}
/*--Audio Function : Ends--*/

/*-- Reset Function : Starts --*/
function ResetActivity(){
    try{
		$("#DvPrev, #DvNext").removeClass("ClsDisableCont");
        $(".ClsQuesScrnCont").removeClass("ClsDisableCont");
		D.OID.FDragID = null;
		D.OID.FDropID = null;
		D.OID.SDragID = null;
		D.OID.SDropID = null;

		D.CurrDragXY.X = null;
		D.CurrDragXY.Y = null;
		D.AnsStr.V = "";

		$(".ClsDrag").removeAttr("style"); 
		$(".ClsDrag").removeClass("ClsDisable");
		D.CorrectCount = 0;
        D.CurrQuesScr = 0;    
		D.Score = 0;   
        
        $(".ClsQuesStatus").removeClass("ClsCorrect").removeClass("ClsIncorrect");        
        $("#DvContStar").html("");
        $(".ClsQuesScrnCont").remove();
        ShuffleArray(D.JD);	
	    GenerateScreens();		
        setTimeout(function(){
            LoadScreen(1);
        },100);
        
    }
	catch(Err){DisplayError(Err);}
}
/*-- Reset Function : Ends --*/

/*-- Screen 1 functions : ends --*/