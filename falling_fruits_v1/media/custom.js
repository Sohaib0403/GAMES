/*-- Document Ready Starts --*/
$(document).ready(function () {
  var canvas, stage, update;
  var gameplay = false;
  var mintueval = 0;
  var secondval = 30;
  var myInterval;
  var scoreVal = 0;
  var keyboardMoveLeft = false;
  var keyboardMoveRight = false;
  var keyboardMoveUp = false;
  var keyboardMoveDown = false;
  var currentAnimPost;
  var bugcreatorCtr = 0;
  var bugCreatorInterval;
  var bug1Interval;
  var bug2Interval;
  var bug3Interval;
  var bug4Interval;
  var bug5Interval;
  var bug6Interval;
  var mousemovectr = 0;
  var levelctr = 0;

  var fruitslevel = [
    {
      src: "../media/images/apple.png",
      size: 0.3,
    },
    {
      src: "../media/images/banana.webp",
      size: 0.2,
    },
    {
      src: "../media/images/orange.png",
      size: 0.4,
    },
    {
      src: "../media/images/mango.webp",
      size: 0.4,
    },
    {
      src: "../media/images/grapes.png",
      size: 0.2,
    },
    {
      src: "../media/images/straw.jpg!sw800",
      size: 0.2,
    },
  ];

  $("#timer").text(mintueval + ":" + secondval);

  //   $("div").on("mouseover", playgame);
  //   $("body").on("click", playgame);

  $("#btn_play").bind("click", () => {
    $("#play").hide();
    playgame();
    maingame();
  });

  // need to remove
  $("#restartgame").bind("click", restartgame);
  $("#nextlevel").bind("click", nextlevel);
  $("#timeupbtn").bind("click", restartgame);

  //   maingame();

  function playgame() {
    mousemovectr++;
    if (mousemovectr == 1) {
      gameplay = true;
      addTimer();
      bugmovements();
    }
  }

  function nextlevel() {
    levelctr++;
    gameplay = false;
    clearInterval(myInterval);
    mintueval = 0;
    secondval = 30;
    mousemovectr = 0;
    $("#timer").text(mintueval + ":" + secondval);
    mainChrater.y = 550;
    mainChrater.x = 900;
    clearInterval(bugCreatorInterval);
    try {
      clearInterval(bug1Interval);
      clearInterval(bug2Interval);
      clearInterval(bug3Interval);
      clearInterval(bug4Interval);
      clearInterval(bug5Interval);
      clearInterval(bug6Interval);
    } catch (error) {}

    bug1Char.x = 580;
    bug1Char.y = 80;
    bug2Char.x = 780;
    bug2Char.y = 80;
    bug3Char.x = 980;
    bug3Char.y = 80;
    bug4Char.x = 1180;
    bug4Char.y = 80;
    bug5Char.x = 980;
    bug5Char.y = 80;
    bug6Char.x = 1180;
    bug6Char.y = 80;

    bug1Char.alpha = 0;
    bug2Char.alpha = 0;
    bug3Char.alpha = 0;
    bug4Char.alpha = 0;
    bug5Char.alpha = 0;
    bug6Char.alpha = 0;

    bugcreatorCtr = 0;

    catchbug1Char.alpha = 0;
    catchbug2Char.alpha = 0;
    catchbug3Char.alpha = 0;
    catchbug4Char.alpha = 0;
    catchbug5Char.alpha = 0;
    catchbug6Char.alpha = 0;

    stage.update();
    $("#nextlevel").hide();
    playgame();
    maingame();
  }
  function restartgame() {
    levelctr = 0;
    gameplay = false;
    clearInterval(myInterval);
    mintueval = 0;
    secondval = 30;
    mousemovectr = 0;
    scoreVal = 0;
    $("#score").html("00");
    $("#timer").text(mintueval + ":" + secondval);
    mainChrater.y = 550;
    mainChrater.x = 900;
    clearInterval(bugCreatorInterval);
    try {
      clearInterval(bug1Interval);
      clearInterval(bug2Interval);
      clearInterval(bug3Interval);
      clearInterval(bug4Interval);
      clearInterval(bug5Interval);
      clearInterval(bug6Interval);
    } catch (error) {}

    bug1Char.x = 580;
    bug1Char.y = 80;
    bug2Char.x = 780;
    bug2Char.y = 80;
    bug3Char.x = 980;
    bug3Char.y = 80;
    bug4Char.x = 1180;
    bug4Char.y = 80;
    bug5Char.x = 980;
    bug5Char.y = 80;
    bug6Char.x = 1180;
    bug6Char.y = 80;

    bug1Char.alpha = 0;
    bug2Char.alpha = 0;
    bug3Char.alpha = 0;
    bug4Char.alpha = 0;
    bug5Char.alpha = 0;
    bug6Char.alpha = 0;

    bugcreatorCtr = 0;

    catchbug1Char.alpha = 0;
    catchbug2Char.alpha = 0;
    catchbug3Char.alpha = 0;
    catchbug4Char.alpha = 0;
    catchbug5Char.alpha = 0;
    catchbug6Char.alpha = 0;

    stage.update();
    $("#feedbackpopup").hide();
    $("#timesup").hide();
    playgame();
    maingame();
  }

  function maingame() {
    // for canvas
    canvas = document.getElementById("fullcanvas");
    stage = new createjs.Stage(canvas);
    createjs.Ticker.addEventListener("tick", tick);
    stage.addEventListener("stagemousemove", handleMouseMove);
    update = true;
    createjs.Touch.enable(stage);
    stage.enableMouseOver();

    mainChrater = new createjs.Container();
    mainChrater.setBounds(0, 0, 471, 458);
    mainChrater.alpha = 1;
    mainChrater.y = 550;
    mainChrater.x = 900;
    stage.addChild(mainChrater);

    left1Img = new Image();
    // left1Img.src =
    //   "";
    left1Img.crossOrigin = "anonymous";
    left1Img.src =
      "../media/images/basket.png";
    left1Char = new createjs.Bitmap(left1Img);
    left1Char.x = 0;
    left1Char.scaleX = 1;
    left1Char.scaleY = 1;
    left1Char.alpha = 1;
    left1Char.y = -50;
    mainChrater.addChild(left1Char);

    pinObj_1 = new createjs.Shape();
    pinObj_1.graphics.setStrokeStyle(5);
    pinObj_1.graphics.beginStroke("#8f3535");
    pinObj_1.graphics.f("#8f3535").rect(0, 0, 220, 30);
    pinObj_1.x = 135;
    pinObj_1.y = 10;
    pinObj_1.regX = 150 / 2;
    pinObj_1.regY = 30 / 2;
    pinObj_1.alpha = 0;
    mainChrater.addChild(pinObj_1);

    catchbug1Img = new Image();
    catchbug1Img.crossOrigin = "anonymous";
    catchbug1Img.src = `${fruitslevel[levelctr].src}`;
    catchbug1Char = new createjs.Bitmap(catchbug1Img);
    catchbug1Char.scaleY = 0;
    catchbug1Char.scaleX = 0;
    // catchbug1Char.scaleY = .1;
    // catchbug1Char.scaleX = .1;
    catchbug1Char.alpha = 0;
    catchbug1Char.x = 40;
    catchbug1Char.y = 100;
    mainChrater.addChild(catchbug1Char);

    catchbug2Img = new Image();
    // catchbug2Img.src =
    //   " ";
    catchbug2Img.crossOrigin = "anonymous";
    catchbug2Img.src = `${fruitslevel[levelctr].src}`;
    catchbug2Char = new createjs.Bitmap(catchbug2Img);
    catchbug2Char.scaleY = 0;
    catchbug2Char.scaleX = 0;
    // catchbug2Char.scaleY = .2;
    // catchbug2Char.scaleX = .2;
    catchbug2Char.alpha = 0;
    catchbug2Char.x = 80;
    catchbug2Char.y = 100;
    mainChrater.addChild(catchbug2Char);

    catchbug3Img = new Image();
    // catchbug3Img.src =
    //   " ";
    catchbug3Img.crossOrigin = "anonymous";
    catchbug3Img.src = `${fruitslevel[levelctr].src}`;
    catchbug3Char = new createjs.Bitmap(catchbug3Img);
    catchbug3Char.scaleY = 0;
    catchbug3Char.scaleX = 0;
    // catchbug3Char.scaleY = .4;
    // catchbug3Char.scaleX = .4;
    catchbug3Char.alpha = 0;
    catchbug3Char.x = 120;
    catchbug3Char.y = 150;
    mainChrater.addChild(catchbug3Char);

    catchbug4Img = new Image();
    // catchbug4Img.src =
    //   "";
    catchbug4Img.crossOrigin = "anonymous";
    catchbug4Img.src = `${fruitslevel[levelctr].src}`;
    catchbug4Char = new createjs.Bitmap(catchbug4Img);
    catchbug4Char.scaleY = 0;
    catchbug4Char.scaleX = 0;
    // catchbug4Char.scaleY = .4;
    // catchbug4Char.scaleX = .4;
    catchbug4Char.alpha = 0;
    catchbug4Char.x = 160;
    catchbug4Char.y = 130;
    mainChrater.addChild(catchbug4Char);

    catchbug5Img = new Image();
    // catchbug5Img.src =
    //   "";
    catchbug5Img.crossOrigin = "anonymous";
    catchbug5Img.src = `${fruitslevel[levelctr].src}`;
    catchbug5Char = new createjs.Bitmap(catchbug5Img);
    catchbug5Char.scaleY = 0;
    catchbug5Char.scaleX = 0;
    // catchbug5Char.scaleY = .2;
    // catchbug5Char.scaleX = .2;
    catchbug5Char.alpha = 0;
    catchbug5Char.x = 200;
    catchbug5Char.y = 120;
    mainChrater.addChild(catchbug5Char);

    catchbug6Img = new Image();
    // catchbug6Img.src =
    //   "";
    catchbug6Img.crossOrigin = "anonymous";
    catchbug6Img.src = `${fruitslevel[levelctr].src}`;
    catchbug6Char = new createjs.Bitmap(catchbug6Img);
    catchbug6Char.scaleY = 0;
    catchbug6Char.scaleX = 0;
    // catchbug6Char.scaleY = .15;
    // catchbug6Char.scaleX = .15;
    catchbug6Char.alpha = 0;
    catchbug6Char.x = 215;
    catchbug6Char.y = 120;
    mainChrater.addChild(catchbug6Char);

    bug1Img = new Image();
    // bug1Img.src = " ";
    bug1Img.crossOrigin = "anonymous";
    bug1Img.src = `${fruitslevel[levelctr].src}`;
    bug1Char = new createjs.Bitmap(bug1Img);
    bug1Char.scaleX = fruitslevel[levelctr].size;
    bug1Char.scaleY = fruitslevel[levelctr].size;
    bug1Char.alpha = 0;
    bug1Char.regX = 50 / 2;
    bug1Char.regY = 144 / 2;
    bug1Char.x = 580;
    bug1Char.y = 80;
    stage.addChild(bug1Char);

    bug2Img = new Image();
    // bug2Img.src =
    //   " ";
    bug2Img.crossOrigin = "anonymous";
    bug2Img.src = `${fruitslevel[levelctr].src}`;
    bug2Char = new createjs.Bitmap(bug2Img);
    bug2Char.scaleY = fruitslevel[levelctr].size;
    bug2Char.scaleX = fruitslevel[levelctr].size;
    bug2Char.alpha = 0;
    bug2Char.regX = 50;
    bug2Char.regY = 100;
    bug2Char.x = 780;
    bug2Char.y = 80;
    stage.addChild(bug2Char);

    bug3Img = new Image();
    // bug3Img.src =
    //   " ";
    bug3Img.crossOrigin = "anonymous";
    bug3Img.src = `${fruitslevel[levelctr].src}`;
    bug3Char = new createjs.Bitmap(bug3Img);
    bug3Char.scaleY = fruitslevel[levelctr].size;
    bug3Char.scaleX = fruitslevel[levelctr].size;
    bug3Char.alpha = 0;
    bug3Char.regX = 50;
    bug3Char.regY = 100;
    bug3Char.x = 980;
    bug3Char.y = 80;
    stage.addChild(bug3Char);

    bug4Img = new Image();
    // bug4Img.src ="";
    bug4Img.crossOrigin = "anonymous";
    bug4Img.src = `${fruitslevel[levelctr].src}`;
    bug4Char = new createjs.Bitmap(bug4Img);
    bug4Char.scaleY = fruitslevel[levelctr].size;
    bug4Char.scaleX = fruitslevel[levelctr].size;
    bug4Char.alpha = 0;
    bug4Char.regX = 50;
    bug4Char.regY = 100;
    bug4Char.x = 1180;
    bug4Char.y = 80;
    stage.addChild(bug4Char);

    bug5Img = new Image();
    // bug5Img.src ="";
    bug5Img.crossOrigin = "anonymous";
    bug5Img.src = `${fruitslevel[levelctr].src}`;
    bug5Char = new createjs.Bitmap(bug5Img);
    bug5Char.scaleY = fruitslevel[levelctr].size;
    bug5Char.scaleX = fruitslevel[levelctr].size;
    bug5Char.alpha = 0;
    bug5Char.regX = 50;
    bug5Char.regY = 100;
    bug5Char.x = 980;
    bug5Char.y = 80;
    stage.addChild(bug5Char);

    bug6Img = new Image();
    // bug6Img.src = "";
    bug6Img.crossOrigin = "anonymous";
    bug6Img.src = `${fruitslevel[levelctr].src}`;
    bug6Char = new createjs.Bitmap(bug6Img);
    bug6Char.scaleY = fruitslevel[levelctr].size;
    bug6Char.scaleX = fruitslevel[levelctr].size;
    bug6Char.alpha = 0;
    bug6Char.regX = 50;
    bug6Char.regY = 100;
    bug6Char.x = 1180;
    bug6Char.y = 80;
    stage.addChild(bug6Char);

    stage.setChildIndex(mainChrater, stage.getNumChildren() - 1);
    stage.update();

    stage.on("stagemousedown", function (evt) {
      mainChrater.x = evt.stageX - 175;
      playgame();
    });

    document.addEventListener("keyup", function (event) {
      if (gameplay) {
        var keyupEvent = event || window.event,
          keycode = keyupEvent.which ? keyupEvent.which : keyupEvent.keyCode;

        switch (keycode) {
          case 32:
            keyboardMoveLeft = false;
            keyboardMoveRight = false;
            keyboardMoveUp = false;
            keyboardMoveDown = false;
            keyboardMoveAnim = false;
            pinObj_1.alpha = 1;
            break;
          case 37:
            charterMovement("left");
            keyboardMoveLeft = false;

            break;
          case 38:
            // charterMovement("up");
            keyboardMoveUp = false;
            break;
          case 39:
            charterMovement("right");
            keyboardMoveRight = false;

            break;
          case 40:
            // charterMovement("down");
            keyboardMoveDown = false;
            break;
        }

        return false;
      }
    });

    document.addEventListener("keydown", function (event) {
      if (gameplay) {
        var keyDownEvent = event || window.event,
          keycode = keyDownEvent.which
            ? keyDownEvent.which
            : keyDownEvent.keyCode;

        switch (keycode) {
          case 32:
            keyboardMoveAnim = true;
            if (mainChrater.getChildAt(0).alpha == 1) {
              pinObj_1.alpha = 1;
              currentAnimPost = 2;
            }

            if (mainChrater.getChildAt(1).alpha == 1) {
              currentAnimPost = 3;
            }
            break;
          case 37:
            charterMovement("left");
            keyboardMoveLeft = true;
            break;
          case 38:
            // charterMovement("up");
            keyboardMoveUp = true;
            break;
          case 39:
            charterMovement("right");
            keyboardMoveRight = true;

            break;
          case 40:
            // charterMovement("down");
            keyboardMoveDown = true;
            break;
        }
        return false;
      }
    });
  }

  function bugmovements() {
    bugCreatorInterval = setInterval(function () {
      bugcreatorCtr++;
      var randomnumber = Math.floor(Math.random() * 1600 + 1);
      if (randomnumber < 430) {
        randomnumber = 600;
      }
      if (bugcreatorCtr == 1) {
        bug1Char.x = randomnumber;
        bug1Char.y = 20;
        bug1Char.alpha = 1;
        bug1Char.scaleX = fruitslevel[levelctr].size;
        bug1Char.scaleY = fruitslevel[levelctr].size;
        bug1CharMove();
      }
      if (bugcreatorCtr == 2) {
        bug2Char.x = randomnumber;
        bug2Char.y = 40;
        bug2Char.alpha = 1;
        bug2Char.scaleX = fruitslevel[levelctr].size;
        bug2Char.scaleY = fruitslevel[levelctr].size;
        bug2CharMove();
      }
      if (bugcreatorCtr == 3) {
        bug3Char.x = randomnumber;
        bug3Char.y = 60;
        bug3Char.alpha = 1;
        bug3Char.scaleX = fruitslevel[levelctr].size;
        bug3Char.scaleY = fruitslevel[levelctr].size;

        bug3CharMove();
      }
      if (bugcreatorCtr == 4) {
        bug4Char.x = randomnumber;
        bug4Char.y = 80;
        bug4Char.alpha = 1;
        bug4Char.scaleX = fruitslevel[levelctr].size;
        bug4Char.scaleY = fruitslevel[levelctr].size;

        bug4CharMove();
      }
      if (bugcreatorCtr == 5) {
        bug5Char.x = randomnumber;
        bug5Char.y = 100;
        bug5Char.alpha = 1;
        bug5Char.scaleX = fruitslevel[levelctr].size;
        bug5Char.scaleY = fruitslevel[levelctr].size;

        bug5CharMove();
      }
      if (bugcreatorCtr == 6) {
        bug6Char.x = randomnumber;
        bug6Char.y = 120;
        bug6Char.alpha = 1;
        bug6Char.scaleX = fruitslevel[levelctr].size;
        bug6Char.scaleY = fruitslevel[levelctr].size;

        bug6CharMove();
      }
    }, 500);
  }

  function bug1CharMove() {
    bug1Interval = setInterval(function () {
      if (gameplay) {
        if (bug1Char.y > 800) {
          var randomnumber = Math.floor(Math.random() * 1600 + 1);
          if (randomnumber < 430) {
            randomnumber = 600;
          }
          bug1Char.alpha = 1;
          bug1Char.x = randomnumber;
          bug1Char.y = 20;
          bug1Char.scaleX = fruitslevel[levelctr].size;
          bug1Char.scaleY = fruitslevel[levelctr].size;
          // clearInterval(bug1Interval);
        }
        var bug1Chary = bug1Char.y;
        bug1Chary = bug1Chary + 1;
        bug1Char.y = bug1Chary;
      }
    }, 10);
  }

  function bug2CharMove() {
    bug2Interval = setInterval(function () {
      if (gameplay) {
        if (bug2Char.y > 800) {
          var randomnumber = Math.floor(Math.random() * 1600 + 1);
          if (randomnumber < 430) {
            randomnumber = 600;
          }
          bug2Char.alpha = 1;
          bug2Char.x = randomnumber;
          bug2Char.y = 40;
          bug2Char.scaleX = fruitslevel[levelctr].size;
          bug2Char.scaleY = fruitslevel[levelctr].size;
        }
        var bug2Chary = bug2Char.y;
        bug2Chary = bug2Chary + 1;
        bug2Char.y = bug2Chary;
      }
    }, 10);
  }

  function bug3CharMove() {
    bug3Interval = setInterval(function () {
      if (gameplay) {
        if (bug3Char.y > 800) {
          var randomnumber = Math.floor(Math.random() * 1600 + 1);
          if (randomnumber < 430) {
            randomnumber = 600;
          }
          bug3Char.alpha = 1;
          bug3Char.x = randomnumber;
          bug3Char.y = 60;
          bug3Char.scaleX = fruitslevel[levelctr].size;
          bug3Char.scaleY = fruitslevel[levelctr].size;
          // clearInterval(bug3Interval);
        }
        var bug3Chary = bug3Char.y;
        bug3Chary = bug3Chary + 1;
        bug3Char.y = bug3Chary;
      }
    }, 10);
  }

  function bug4CharMove() {
    bug4Interval = setInterval(function () {
      if (gameplay) {
        if (bug4Char.y > 800) {
          var randomnumber = Math.floor(Math.random() * 1600 + 1);
          if (randomnumber < 430) {
            randomnumber = 600;
          }
          bug4Char.alpha = 1;
          bug4Char.x = randomnumber;
          bug4Char.y = 80;
          bug4Char.scaleX = fruitslevel[levelctr].size;
          bug4Char.scaleY = fruitslevel[levelctr].size;
          // clearInterval(bug4Interval);
        }
        var bug4Chary = bug4Char.y;
        bug4Chary = bug4Chary + 1;
        bug4Char.y = bug4Chary;
      }
    }, 10);
  }
  function bug5CharMove() {
    bug5Interval = setInterval(function () {
      if (gameplay) {
        if (bug5Char.y > 800) {
          var randomnumber = Math.floor(Math.random() * 1600 + 1);
          if (randomnumber < 430) {
            randomnumber = 600;
          }
          bug5Char.alpha = 1;
          bug5Char.x = randomnumber;
          bug5Char.y = 100;
          bug5Char.scaleX = fruitslevel[levelctr].size;
          bug5Char.scaleY = fruitslevel[levelctr].size;
          // clearInterval(bug5Interval);
        }
        var bug5Chary = bug5Char.y;
        bug5Chary = bug5Chary + 1;
        bug5Char.y = bug5Chary;
      }
    }, 10);
  }
  function bug6CharMove() {
    bug6Interval = setInterval(function () {
      if (gameplay) {
        if (bug6Char.y > 800) {
          var randomnumber = Math.floor(Math.random() * 1600 + 1);
          if (randomnumber < 430) {
            randomnumber = 600;
          }
          bug6Char.alpha = 1;
          bug6Char.x = randomnumber;
          bug6Char.y = 120;
          bug6Char.scaleX = fruitslevel[levelctr].size;
          bug6Char.scaleY = fruitslevel[levelctr].size;
          // clearInterval(bug6Interval);
        }
        var bug6Chary = bug6Char.y;
        bug6Chary = bug6Chary + 1;
        bug6Char.y = bug6Chary;
      }
    }, 10);
  }

  function charterMovement(movedir) {
    var pt11 = pinObj_1.globalToLocal(bug1Char.x, bug1Char.y);
    var pt22 = pinObj_1.globalToLocal(bug2Char.x, bug2Char.y);
    var pt33 = pinObj_1.globalToLocal(bug3Char.x, bug3Char.y);
    var pt44 = pinObj_1.globalToLocal(bug4Char.x, bug4Char.y);
    var pt55 = pinObj_1.globalToLocal(bug5Char.x, bug5Char.y);
    var pt66 = pinObj_1.globalToLocal(bug6Char.x, bug6Char.y);

    if (
      pinObj_1.hitTest(pt11.x, pt11.y) ||
      pinObj_1.hitTest(pt22.x, pt22.y) ||
      pinObj_1.hitTest(pt33.x, pt33.y) ||
      pinObj_1.hitTest(pt44.x, pt44.y) ||
      pinObj_1.hitTest(pt55.x, pt55.y) ||
      pinObj_1.hitTest(pt66.x, pt66.y)
    ) {
      if (pinObj_1.hitTest(pt11.x, pt11.y)) {
        bug1Char.alpha = 0;
        catchbug1Char.alpha = 0.6;
        bug1Char.y = 70;
        clearInterval(bug1Interval);
        updateScore(true);
      }
      if (pinObj_1.hitTest(pt22.x, pt22.y)) {
        bug2Char.alpha = 0;
        catchbug2Char.alpha = 0.6;
        bug2Char.y = 70;
        clearInterval(bug2Interval);
        updateScore(true);
      }

      if (pinObj_1.hitTest(pt33.x, pt33.y)) {
        bug3Char.alpha = 0;
        catchbug3Char.alpha = 0.6;
        bug3Char.y = 70;
        clearInterval(bug3Interval);
        updateScore(true);
      }
      if (pinObj_1.hitTest(pt44.x, pt44.y)) {
        bug4Char.alpha = 0;
        catchbug4Char.alpha = 0.6;
        bug4Char.y = 70;
        clearInterval(bug4Interval);
        updateScore(true);
      }
      if (pinObj_1.hitTest(pt55.x, pt55.y)) {
        bug5Char.alpha = 0;
        catchbug5Char.alpha = 0.6;
        bug5Char.y = 70;
        clearInterval(bug5Interval);
        updateScore(true);
      }
      if (pinObj_1.hitTest(pt66.x, pt66.y)) {
        bug6Char.alpha = 0;
        catchbug6Char.alpha = 0.6;
        bug6Char.y = 70;
        clearInterval(bug6Interval);
        updateScore(true);
      }
    }
  }
  function handleMouseMove(event) {
    playgame();
  }
  var bounds = new createjs.Rectangle(400, 400, 1920, 1920);
  var offset = new createjs.Point();
  mainChrater.addEventListener("mousedown", function (e) {
    // Update the offset between the press and the object
    offset.setValues(e.localX, e.localY);
  });

  mainChrater.addEventListener("pressmove", dragCon);
  function dragCon(evt) {
    var x = evt.stageX - offset.x; // Add in the offset
    evt.currentTarget.x = Math.max(
      bounds.x,
      Math.min(bounds.x + bounds.width, x)
    );
  }

  function updateScore(val) {
    if (val) {
      playcollectbug();
      $("#incscore").show();
      $("#incscore").removeClass("animated zoomIn");
      $("#incscore").addClass("animated zoomIn");
      setTimeout(function () {
        $("#incscore").removeClass("animated zoomIn");
        $("#incscore").hide();
      }, 1000);

      scoreVal++;
      if (scoreVal <= 9) {
        $("#score").text("0" + scoreVal);
      } else {
        $("#score").text(scoreVal);
      }
      if (scoreVal == 6 || scoreVal == 12 || scoreVal == 18 || scoreVal == 24 || scoreVal == 30) {
        $("#nextlevel").show();
        clearInterval(myInterval);
      }else if(scoreVal == 36){
        playgameover();
      }
    }
  }

  // ********** tick Functions **********
  function tick(event) {
    charterMovement();
    if (gameplay) {
      if (keyboardMoveLeft) {
        if (mainChrater.x < 430) {
        } else {
          mainChrater.x -= 13;
        }
      }
      if (keyboardMoveRight) {
        if (mainChrater.x > 1610) {
        } else {
          mainChrater.x += 13;
        }
      }

      if (keyboardMoveUp) {
        if (mainChrater.y < -30) {
        } else {
          // mainChrater.y -= 13;
        }
      }
      if (keyboardMoveDown) {
        if (mainChrater.y > 490) {
        } else {
          // mainChrater.y += 13;
        }
      }

      stage.update(event);
    }
  }

  function addTimer() {
    myInterval = setInterval(function () {
      secondval--;
      if (secondval == 0) {
        mintueval--;
        secondval = 30;
      }
      if ((mintueval == 0) & (secondval == 1)) {
        timesup();
      }
      if (secondval <= 9) {
        $("#timer").text(mintueval + ":0" + secondval);
      } else {
        $("#timer").text(mintueval + ":" + secondval);
      }
    }, 1000);
  }

  function playcollectbug() {
    var objPlayMusic = document.createElement("audio");
    objPlayMusic.src = "media/audio/collectbug.mp3";
    objPlayMusic.play();
  }

  function playhumancrowd() {
    var objPlayMusic = document.createElement("audio");
    objPlayMusic.src = "media/audio/humancrowd.mp3";
    objPlayMusic.play();
  }

  function playtimesup() {
    var objPlayMusic = document.createElement("audio");
    objPlayMusic.src = "media/audio/timeup.wav";
    objPlayMusic.play();
  }

  function playgameover() {
    setTimeout(function () {
      clearInterval(myInterval);
      gameplay = false;
      $("#feedbackpopup").show();
      playhumancrowd();
      //   restartgame();
    }, 500);
  }

  function timesup() {
    setTimeout(function () {
      clearInterval(myInterval);
      gameplay = false;
      $("#timesup").show();
      playtimesup();
      //   restartgame();
    }, 500);
  }
});
