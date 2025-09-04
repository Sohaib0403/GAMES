/*-- Document Ready Starts --*/
$(document).ready(function () {
  // device detection
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  ) {
    IsDevice = true;
  }
  $(".row").remove();
  resizeHandler();
  document.ontouchmove = function (e) {};
  RegisterEvents();
  RegisterScreenEvents();
  InitActivity();
  $("#play").bind("click", () => {
    $("#play").css("opacity", "0");
    $("#layer").css("opacity", "0");
    $("#DvQuestion").css("opacity", "0");
    setTimeout(() => {
      $(this).hide();
      $("#layer").hide();
      $("#DvQuestion").hide();
    }, 200);
  });
});
/*-- Document Ready Ends --*/

/*-- Common Framework Functions Starts --*/
function RegisterEvents() {
  $(window).resize(function () {
    resizeHandler();
  });
  $(window).on("orientationchange", function (event) {
    resizeHandler();
  });
  $("div").mousedown(function (e) {});
  $("html").mousedown(function (e) {});
}

/*-- Game Functions : Starts --*/
function RegisterScreenEvents() {
  $("#DvResetDrawing1, #DvResetDrawing2, #DvResetDrawing3").mousedown(function (
    e
  ) {
    ResetDrawBoard(e);
  });
  $("#DvResetDrawing0").mousedown(function (e) {
    ResetActivity();
  });
  $("#DvShowAnswer1, #DvShowAnswer2, #DvShowAnswer3").mousedown(function (e) {
    ShowAnswer(e);
  });
}

function InitActivity() {
  LoadScreen(0);
  InitCanvas();
}

function HideAllScreen() {
  for (var i = 0; i < TotalScr; i++) {
    HideDiv("DvScr" + i);
  }
}

function LoadScreen(ScrNo) {
  HideAllScreen();
  switch (ScrNo) {
    case 0:
      ShowDiv("DvScr0");
      GData.CurrScrNo = 0;
      break;
    default:
      ShowDiv("DvScr0");
      GData.CurrScrNo = 0;
      break;
  }
}

/*-- Activity Functions : Starts --*/
var IDCvCanv0, IDCvCanv1, IDCvCanv2, IDCvCanv3;
var StgCanv0, StgCanv1, StgCanv2, StgCanv3;
var CtBase;
var CtBase0_0, CtBase1_0, CtBase2_0, CtBase3_0;
var CtBase0, CtBase1, CtBase2, CtBase3;
var ShpBase0, ShpBase1, ShpBase2, ShpBase3;
function InitCanvas() {
  // Cell No : 1
  IDCvCanv0 = document.getElementById("CvCanvas0");
  StgCanv0 = new createjs.Stage("CvCanvas0");
  StgCanv0.enableMouseOver();
  createjs.Ticker.on("tick", tickCanvas0);
  createjs.Touch.enable(StgCanv0);
  StgCanv0.update();
  CtBase0 = new createjs.Container();
  CtBase0.setBounds(0, 0, GData.BoxW, GData.BoxH);
  StgCanv0.addChild(CtBase0);
  CtBase0.x = 0;
  CtBase0.y = 0;
  CtBase0.ID = 0;
  ShpBase0 = new createjs.Shape();
  ShpBase0.graphics
    .beginFill("rgba(0,0,0,0.009)")
    .drawRect(0, 0, GData.BoxW, GData.BoxH);
  StgCanv0.addChild(ShpBase0);
  ShpBase0.x = 0;
  ShpBase0.y = 0;
  CtBase0_0 = new createjs.Container();
  CtBase0_0.setBounds(0, 0, 180, 50);
  StgCanv0.addChild(CtBase0_0);
  CtBase0_0.x = 122.5;
  CtBase0_0.y = 31.5;
  GenerateLine(CtBase0_0, 0, 0, 0, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 15, 0, 15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 30, 0, 30, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 45, 0, 45, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 60, 0, -15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 90, 0, 90, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 105, 0, 105, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 120, 0, 120, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 135, 0, 135, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 150, 0, 75, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 180, 0, 180, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase0_0, 195, 0, 195, 50, GData.DivLineWidth, "#ffffff");
  CtBase0_0.alpha = 1;
  // Cell No : 2
  IDCvCanv1 = document.getElementById("CvCanvas1");
  StgCanv1 = new createjs.Stage("CvCanvas1");
  StgCanv1.enableMouseOver();
  createjs.Ticker.on("tick", tickCanvas1);
  createjs.Touch.enable(StgCanv1);
  StgCanv1.update();
  CtBase1 = new createjs.Container();
  CtBase1.setBounds(0, 0, GData.BoxW, GData.BoxH);
  StgCanv1.addChild(CtBase1);
  CtBase1.x = 0;
  CtBase1.y = 0;
  CtBase1.ID = 1;
  ShpBase1 = new createjs.Shape();
  ShpBase1.graphics
    .beginFill("rgba(0,0,0,0.009)")
    .drawRect(0, 0, GData.BoxW, GData.BoxH);
  StgCanv1.addChild(ShpBase1);
  ShpBase1.x = 0;
  ShpBase1.y = 0;
  ShpBase1.on("mousedown", HandleMouseDownAct);
  ShpBase1.on("pressmove", HandlePressMoveAct);
  CtBase1_0 = new createjs.Container();
  CtBase1_0.setBounds(0, 0, 240, 50);
  StgCanv1.addChild(CtBase1_0);
  CtBase1_0.x = 75;
  CtBase1_0.y = 31.5;
  GenerateLine(CtBase1_0, 0, 0, 0, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 15, 0, 15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 30, 0, 30, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 45, 0, 45, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 60, 0, -15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 90, 0, 90, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 105, 0, 105, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 120, 0, 120, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 135, 0, 135, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 150, 0, 75, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 180, 0, 180, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 195, 0, 195, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 210, 0, 210, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 225, 0, 225, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 240, 0, 165, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase1_0, 270, 0, 270, 50, GData.DivLineWidth, "#ffffff");
  CtBase1_0.alpha = 0;
  // Cell No : 3
  IDCvCanv2 = document.getElementById("CvCanvas2");
  StgCanv2 = new createjs.Stage("CvCanvas2");
  StgCanv2.enableMouseOver();
  createjs.Ticker.on("tick", tickCanvas2);
  createjs.Touch.enable(StgCanv2);
  StgCanv2.update();
  CtBase2 = new createjs.Container();
  CtBase2.setBounds(0, 0, GData.BoxW, GData.BoxH);
  StgCanv2.addChild(CtBase2);
  CtBase2.x = 0;
  CtBase2.y = 0;
  CtBase2.ID = 2;
  ShpBase2 = new createjs.Shape();
  ShpBase2.graphics
    .beginFill("rgba(0,0,0,0.009)")
    .drawRect(0, 0, GData.BoxW, GData.BoxH);
  StgCanv2.addChild(ShpBase2);
  ShpBase2.x = 0;
  ShpBase2.y = 0;
  ShpBase2.on("mousedown", HandleMouseDownAct);
  ShpBase2.on("pressmove", HandlePressMoveAct);
  CtBase2_0 = new createjs.Container();
  CtBase2_0.setBounds(0, 0, 350, 50);
  StgCanv2.addChild(CtBase2_0);
  CtBase2_0.x = 55;
  CtBase2_0.y = 31.5;
  GenerateLine(CtBase2_0, 0, 0, 0, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 15, 0, 15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 30, 0, 30, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 45, 0, 45, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 60, 0, -15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 90, 0, 90, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 105, 0, 105, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 120, 0, 120, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 135, 0, 135, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 150, 0, 75, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 180, 0, 180, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 195, 0, 195, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 210, 0, 210, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 225, 0, 225, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 240, 0, 165, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 270, 0, 270, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 285, 0, 285, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 300, 0, 300, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 315, 0, 315, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase2_0, 330, 0, 255, 50, GData.DivLineWidth, "#ffffff");
  CtBase2_0.alpha = 0;
  // Cell No : 4
  IDCvCanv3 = document.getElementById("CvCanvas3");
  StgCanv3 = new createjs.Stage("CvCanvas3");
  StgCanv3.enableMouseOver();
  createjs.Ticker.on("tick", tickCanvas3);
  createjs.Touch.enable(StgCanv3);
  StgCanv3.update();
  CtBase3 = new createjs.Container();
  CtBase3.setBounds(0, 0, GData.BoxW, GData.BoxH);
  StgCanv3.addChild(CtBase3);
  CtBase3.x = 0;
  CtBase3.y = 0;
  CtBase3.ID = 3;
  ShpBase3 = new createjs.Shape();
  ShpBase3.graphics
    .beginFill("rgba(0,0,0,0.009)")
    .drawRect(0, 0, GData.BoxW, GData.BoxH);
  StgCanv3.addChild(ShpBase3);
  ShpBase3.x = 0;
  ShpBase3.y = 0;
  ShpBase3.on("mousedown", HandleMouseDownAct);
  ShpBase3.on("pressmove", HandlePressMoveAct);
  CtBase3_0 = new createjs.Container();
  CtBase3_0.setBounds(0, 0, 180, 50);
  StgCanv3.addChild(CtBase3_0);
  CtBase3_0.x = 150;
  CtBase3_0.y = 31.5;
  GenerateLine(CtBase3_0, 0, 0, 0, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 15, 0, 15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 30, 0, 30, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 45, 0, 45, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 60, 0, -15, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 90, 0, 90, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 105, 0, 105, 50, GData.DivLineWidth, "#ffffff");
  GenerateLine(CtBase3_0, 120, 0, 120, 50, GData.DivLineWidth, "#ffffff");
  CtBase3_0.alpha = 0;
  StgCanv0.update();
  StgCanv1.update();
  StgCanv2.update();
  StgCanv3.update();
}
function HandleMouseDownAct(e) {
  var Stg = {
    X: Number(e.stageX.toString().split(".")[0]),
    Y: Number(e.stageY.toString().split(".")[0]),
  };
  var TempCont = new createjs.Container();
  var TempLine = new createjs.Shape();
  TempLine.cursor = "default";
  TempLine.LineWidth = GData.DivLineWidth;
  TempLine.FillClrCode = "#ffffff";
  TempLine.MovePt = Stg;
  TempLine.LinePt = Stg;
  TempCont.addChild(TempLine);
  this.parent.children[0].addChild(TempCont);
}
function HandlePressMoveAct(e) {
  if (this.parent.children[0].ID == 1) {
    if ($("#DvResetDrawing1").hasClass("ClsDisableCont")) {
      $("#DvResetDrawing1").removeClass("ClsDisableCont");
      $("#DvShowAnswer1").removeClass("ClsDisableCont");
      $("#DvResetDrawing0").removeClass("ClsDisableCont");
    }
  } else if (this.parent.children[0].ID == 2) {
    if ($("#DvResetDrawing2").hasClass("ClsDisableCont")) {
      $("#DvResetDrawing2").removeClass("ClsDisableCont");
      $("#DvShowAnswer2").removeClass("ClsDisableCont");
      $("#DvResetDrawing0").removeClass("ClsDisableCont");
    }
  } else if (this.parent.children[0].ID == 3) {
    if ($("#DvResetDrawing3").hasClass("ClsDisableCont")) {
      $("#DvResetDrawing3").removeClass("ClsDisableCont");
      $("#DvShowAnswer3").removeClass("ClsDisableCont");
      $("#DvResetDrawing0").removeClass("ClsDisableCont");
    }
  }
  var DrawCont = this.parent.children[0];
  var TempObjParent = DrawCont.children[DrawCont.children.length - 1];
  var TempObj = TempObjParent.children[0];
  var Stg = {
    X: Number(e.stageX.toString().split(".")[0]),
    Y: Number(e.stageY.toString().split(".")[0]),
  };
  TempObj.graphics.setStrokeStyle(GData.DivLineWidth, "round");
  TempObj.graphics.beginStroke("#ffffff");
  TempObj.graphics.moveTo(TempObj.LinePt.X, TempObj.LinePt.Y);
  TempObj.graphics.lineTo(Stg.X, Stg.Y);
  TempObj.LinePt = Stg;
  TempObj.graphics.endStroke();
}
function ResetActivity() {
  CtBase1.removeAllChildren();
  CtBase2.removeAllChildren();
  CtBase3.removeAllChildren();
  CtBase1.alpha = 1;
  CtBase2.alpha = 1;
  CtBase3.alpha = 1;
  CtBase1_0.alpha = 0;
  CtBase2_0.alpha = 0;
  CtBase3_0.alpha = 0;
  $("#DvShowAnswer1, #DvShowAnswer2, #DvShowAnswer3").html("Show Answer");
  $("#DvResetDrawing0").addClass("ClsDisableCont");
  $("#DvResetDrawing1, #DvResetDrawing2, #DvResetDrawing3").addClass(
    "ClsDisableCont"
  );
  $("#DvShowAnswer1, #DvShowAnswer2, #DvShowAnswer3").addClass(
    "ClsDisableCont"
  );
}
function ResetDrawBoard(e) {
  if (e.target.id == "DvResetDrawing1") {
    CtBase1.removeAllChildren();
    $("#DvResetDrawing1").addClass("ClsDisableCont");
    $("#DvShowAnswer1").addClass("ClsDisableCont");
    CtBase1.alpha = 1;
    CtBase1_0.alpha = 0;
    $("#DvShowAnswer1").html("Show Answer");
  } else if (e.target.id == "DvResetDrawing2") {
    CtBase2.removeAllChildren();
    $("#DvResetDrawing2").addClass("ClsDisableCont");
    $("#DvShowAnswer2").addClass("ClsDisableCont");
    CtBase2.alpha = 1;
    CtBase2_0.alpha = 0;
    $("#DvShowAnswer2").html("Show Answer");
  } else if (e.target.id == "DvResetDrawing3") {
    CtBase3.removeAllChildren();
    $("#DvResetDrawing3").addClass("ClsDisableCont");
    $("#DvShowAnswer3").addClass("ClsDisableCont");
    CtBase3.alpha = 1;
    CtBase3_0.alpha = 0;
    $("#DvShowAnswer3").html("Show Answer");
  }
}
function ShowAnswer(e) {
  if ($("#" + e.target.id).html() == "Show Answer") {
    if ($("#DvResetDrawing0").hasClass("ClsDisableCont")) {
      $("#DvResetDrawing0").removeClass("ClsDisableCont");
    }
    $("#" + e.target.id).html("Hide Answer");
    if (e.target.id == "DvShowAnswer1") {
      CtBase1.alpha = 0;
      CtBase1_0.alpha = 1;
    } else if (e.target.id == "DvShowAnswer2") {
      CtBase2.alpha = 0;
      CtBase2_0.alpha = 1;
    } else if (e.target.id == "DvShowAnswer3") {
      CtBase3.alpha = 0;
      CtBase3_0.alpha = 1;
    }
  } else if ($("#" + e.target.id).html() == "Hide Answer") {
    $("#" + e.target.id).html("Show Answer");
    if (e.target.id == "DvShowAnswer1") {
      CtBase1.alpha = 1;
      CtBase1_0.alpha = 0;
    } else if (e.target.id == "DvShowAnswer2") {
      CtBase2.alpha = 1;
      CtBase2_0.alpha = 0;
    } else if (e.target.id == "DvShowAnswer3") {
      CtBase3.alpha = 1;
      CtBase3_0.alpha = 0;
    }
  }
}
function tickCanvas0(event) {
  try {
    StgCanv0.update();
  } catch (err) {}
}
function tickCanvas1(event) {
  try {
    StgCanv1.update();
  } catch (err) {}
}
function tickCanvas2(event) {
  try {
    StgCanv2.update();
  } catch (err) {}
}
function tickCanvas3(event) {
  try {
    StgCanv3.update();
  } catch (err) {}
}
function GenerateLine(LineCont, mt_X, mt_Y, ltX, lt_Y, Linewidth, LineColor) {
  var TempLine = new createjs.Shape();
  TempLine.graphics.setStrokeStyle(Linewidth);
  TempLine.graphics.beginStroke(LineColor);
  TempLine.graphics.moveTo(mt_X, mt_Y);
  TempLine.graphics.lineTo(ltX, lt_Y);
  TempLine.graphics.endStroke();
  LineCont.addChild(TempLine);
  TempLine.alpha = 1;
}

/*-- Activity Functions : Ends --*/

/*-- Game Functions : Ends --*/
