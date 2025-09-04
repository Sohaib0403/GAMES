/*-- Document Ready Starts --*/
$(document).ready(function () {
  // Declear local variable

  var myVolume = 0.15;
  var myClickVolume = 0.5;
  var myInsVolume = 1;
  var obj1, obj2, questionSet;
  var cardCtr = 0;
  var questionCtr = 0;
  var liveHelp = true;
  var evType = 1;
  var totalTimeSpendS = 0;
  var spendtimerobj;
  var totalAttempts = -1;
  var totalAttemptsCurrentRound = 0;
  var currentPercentage = 0;
  var accuracyRes;
  var tryagainctr = 0;
  var correctctr = 0;
  var intval;
  var objsintrovo;
  var objsintrovo2;
  var objsintrovotutorial;
  var objsintrovotutorialafterClick;
  var endgame = false;
  var str1;
  var str2;
  var scaleRatio = null;
  var draggableArray = [];
  var droppableArray = [];
  var currentContainerIndex = 0;
  var currentplaceContainerIndex = 0;
  var selectedElement = null;
  let prevIndex = -1;
  var currentToys = 0;
  var currentlyDragToys = 0;
  var getTimeout = null;
  var objPlayEndMusic;

  resizeHandler();

  $("#setting_button").bind("click", showsetting2);
  $("#skip_button").bind("click", skiphelpbutton);
  $("#close_setting_btn2").bind("click", closesetting2);
  $("#save_changes_btn").bind("click", closesetting2);
  $("#close_setting").bind("click", exitgame);
  $("#exit_game_btn").bind("click", exitgame);
  $("#start_activity").bind("click", nextscreen);
  $("#tiggie").bind("click", playins);
  $("#replayBtn").bind("click", replaybtnClick);
  $("#exitBtn").bind("click", exitgame);
  totalTimeSpend();
  update_ui_Settings();

  function replaybtnClick() {
    nextscreen();
  }

  function skiphelpbutton() {
    liveHelp = false; // Disable the live help feature by changing its controlling variable
    $("#handindicator").hide().remove();
    objsintrovo != undefined && objsintrovo.pause();
    objsintrovo2 != undefined && objsintrovo2.pause();
    $("#skip_button").hide();
    displaysettingbtn();
    $("#tiggie").removeClass("tiggieanim");
    $("#caption_text").hide();
    resultChecker(true);
    addEvent();
  }

  function disableSkipButton() {
    $("#skip_button").off("click", skiphelpbutton); // Unbind the click event to disable it
  }

  function enableSkipButton() {
    $("#skip_button").bind("click", skiphelpbutton); // Re-bind the click event to enable it
  }

  function chnageCaptionText(text) {
    var captionbtn = true;
    if (captionbtn) {
      console.log('text here');
      
      var captionDiv = document.getElementById("caption_text");
      captionDiv.textContent = text;
      $("#caption_text").show();
      $("#caption_text").css("background-color", "white");
      // alert("hi")
    } else {
      console.log("6");
      $("#caption_text").hide();
    }
  }

  // let hasRunPlaysIntroVo = false; // Flag to track if playsintrovo has run
  // let initialTimeoutDuration = 10000; // Initial timeout duration

  function onclickTiggi() {
    $("#stopscreen").hide();
    $("#stopclick").show();
    $("#skip_button").show();
    // displayElements();
    playsintrovo();
    getTimeout = setTimeout(function () {
      $("#stopclick").hide();
      // helpLive("scene0");
      if (questionCtr == 0) {
        helpLive("drag-container_0");
        playsintoTutorial();
        //
        if (evType == 1 || evType == 4) {
          introMouseEventHandler();
        } else {
          document.addEventListener("keydown", introKeyEventHandler);
        }
      }
    }, 10000);
  }

  function nextscreen() {
    localStorage.setItem("Percentage_correct", 0);
    document.cookie = "Percentage_correct=" + 0;
    $("#settingpage").hide();
    console.log("7");
    $("#caption_text").hide();
    $("#stopscreen").show();
    startgame();
  }

  function getScaleRatio(element) {
    // Get the current size of the element
    var currentWidth = element.offsetWidth;
    var currentHeight = element.offsetHeight;

    // Get the original size of the element
    var originalWidth = element.scrollWidth;
    var originalHeight = element.scrollHeight;

    // Calculate the scale ratio for both width and height
    var scaleX = currentWidth / originalWidth;
    var scaleY = currentHeight / originalHeight;

    return { scaleX: scaleX, scaleY: scaleY };
  }

  // Example usage:

  function startgame() {
    addCards();

    if (localStorage.getItem("musicon") == "OFF") {
      $("#bgm_music").removeClass("musicon").html("OFF");
      objPlayPauseMusic.pause();
    } else {
      playbgm();
    }
  }

  function addEvent() {
    document.removeEventListener("keydown", dualSwitchHandler);
    document.removeEventListener("keydown", singleSwitchHandler);
    if (evType == 1) {
      mouseTapHandler();
    } else if (evType == 2) {
      document.addEventListener("keydown", dualSwitchHandler);
    } else if (evType == 3) {
      switchHandler();
      document.addEventListener("keydown", singleSwitchHandler);
    } else if (evType == 4) {
      mouseOverHandler();
    }
  }

  function award() {
    breakEggs(questionCtr);
    if (questionCtr != 0) {
      calculatepercentage(questionCtr, totalAttemptsCurrentRound);
      totalAttemptsCurrentRound = 0;
    }
  }

  function resultChecker(skip = false) {
    if (currentToys - 1 === currentlyDragToys && questionCtr == 3) {
      award();
      setTimeout(() => {
        endgame = true;
        $("#outero").show();
        playEndingvo();
        setTimeout(() => {
          $("#replay_screen").show();
        }, 10000);
        endScreen();
      }, 1000);
    } else {
      if (currentToys - 1 === currentlyDragToys) {
        setTimeout(() => {
          removeAllElements();
          award();
          questionCtr++;

          if (skip) {
            setupElemnts();
            if (evType == 1) {
              mouseTapHandler();
            } else if (evType == 4) {
              mouseOverHandler();
            }
          } else {
            setTimeout(() => {
              displaylevelupouter();
              setupElemnts();
              if (evType == 1) {
                mouseTapHandler();
              } else if (evType == 4) {
                mouseOverHandler();
              }
            }, 500);
          }

          // }
        }, 500);
      } else {
        currentlyDragToys++;
      }
    }
  }

  function introMouseEventHandler() {
    $("#handindicator").click(function () {
      playsintoTutorialafterClick();
    });
  }

  function mouseOverHandler() {
    var isDragging = false;
    var dragOffsetX, dragOffsetY;

    $(".drag-toy").mousedown(function (e) {
      isDragging = true;
      var $draggedElement = $(this);
      dragOffsetX = e.pageX - $draggedElement.offset().left;
      dragOffsetY = e.pageY - $draggedElement.offset().top;
      $draggedElement.css("cursor", "grabbing");
    });

    $(document).mousemove(function (e) {
      if (isDragging) {
        $(".drag-toy").offset({
          top: e.pageY - dragOffsetY,
          left: e.pageX - dragOffsetX,
        });
      }
    });

    $(document).mouseup(function () {
      if (isDragging) {
        isDragging = false;
        $(".drag-toy").css("cursor", "grab");
      }
    });

    $(".drop-toy").mouseenter(function () {
      if (selectedElement == null || evType != 4) {
        return;
      }

      let index = this.id.split("_")[1];
      setTimeout(() => {
        if (prevIndex != -1) {
          document
            .getElementById("drop-container_" + prevIndex)
            .classList.remove("highlight");
        }
        document
          .getElementById("drop-container_" + index)
          .classList.add("highlight");
        prevIndex = index;

        if (selectedElement === index) {
          setTimeout(() => {
            playsfxcorrect();
            $("#drag-toy_" + index).hide(); // Hide drag toy
            $("#drop-toy_" + index).css("opacity", 1); // Show drop toy as fully opaque
            document
              .getElementById("drop-container_" + index)
              .classList.remove("highlight");
            selectedElement = null;
            prevIndex = -1;
            resultChecker();
            $("#game_container").empty();
          }, 500);
        } else {
          playsfxwrong();
        }
      }, 500);
      totalAttemptsCurrentRound++;
    });
  }

  function animateDragContainerToDropContainer() {
    if (!liveHelp) {
      return;
    }

    const dragContainer = document.getElementById("drag-container_0");
    const dropContainer = document.getElementById("drop-container_0");

    // Get the starting position of the drag container
    let dragPos = dragContainer.getBoundingClientRect();
    const dropPos = dropContainer.getBoundingClientRect();

    // Calculate the distance to move on each frame
    const frames = 100; // Number of frames for the animation
    const deltaX = (dropPos.left - dragPos.left + 100) / frames; // Adjusted for 900px left movement

    let frameCount = 0;

    function move() {
      if (frameCount < frames) {
        dragContainer.style.left =
          parseInt(dragContainer.style.left || 0) + deltaX + "px";

        frameCount++;

        requestAnimationFrame(move); // Call move again to animate the next frame
      } else {
        dragContainer.style.display = "none";
        document.getElementById("drop-toy_0").style.opacity = 1;
        currentlyDragToys = 0;
        resultChecker();

        setTimeout(() => {
          // console.log("8");
          $("#caption_text").hide();
          displaylevelupouter();
        }, 2500);
        liveHelp = false;
      }
    }

    move();
    $(".spaceDot").css("background-color", "red");
    $(".spaceDot").css("transition", "background-color 0.7s");
  }

  function removeElementFromArray(draggableIndex, droppableIndex) {
    for (let i = 0; i < draggableArray.length; i++) {
      let dragid = draggableArray[i].id.split("_")[1];
      if (dragid == draggableIndex) {
        draggableArray.splice(i, 1);
      }
    }

    for (let i = 0; i < droppableArray.length; i++) {
      let dropid = droppableArray[i].id.split("_")[1];
      if (dropid == droppableIndex) {
        droppableArray.splice(i, 1);
      }
    }
  }

  function mouseTapHandler() {
    var element = document.getElementById("wrapper");
    scaleRatio = getScaleRatio(element);
    $(document).ready(function () {
      $(".drag-toy").draggable({
        revert: function (event, ui) {
          if (evType != 1) {
            return true;
          }
          $(this).animate(
            {
              left: 0,
              top: 0,
            },
            500
          );
        },
        drag: function (event, ui) {
          if (evType != 1) {
            return false;
          }
          var newLeft = ui.position.left / DragDropScale.x;
          var newTop = ui.position.top / DragDropScale.y;
          ui.position.left = newLeft;
          ui.position.top = newTop;

          // Track already processed dots to avoid re-triggering color change
          var processedDots = [];

          // Check for overlap with .spaceDot elements
          $(".spaceDot").each(function () {
            var $dot = $(this);
            var dotOffset = $dot.offset();
            var dotWidth = $dot.width();
            var dotHeight = $dot.height();

            var dragOffset = $(ui.helper).offset();
            var dragWidth = $(ui.helper).width();
            var dragHeight = $(ui.helper).height();

            if (
              dragOffset.left < dotOffset.left + dotWidth &&
              dragOffset.left + dragWidth > dotOffset.left &&
              dragOffset.top < dotOffset.top + dotHeight &&
              dragOffset.top + dragHeight > dotOffset.top &&
              !processedDots.includes($dot[0]) // Check if dot has been processed
            ) {
              processedDots.push($dot[0]);
              setTimeout(function () {
                $dot.css("background-color", "red");
                $dot.css("transition", "background-color 1.5s");

                // Check if all dots are colored
                allDotsColored =
                  $(".spaceDot").filter(function () {
                    return $(this).css("background-color") !== "rgb(255, 0, 0)"; // red color
                  }).length === 0;
              }, processedDots.length); // Delay of 1 second between dots
            }
          });
        },
        start: function (event, ui) {
          if (evType != 1) {
            return false;
          }
          var dragStartId = $(this).attr("id");
        },
        stop: function (event, ui) {
          var $this = $(this);

          // Check if the element was dropped in a valid droppable area
          var validDrop = ui.helper.data("validDrop");

          if (!validDrop) {
            // Revert all .spaceDot elements back to black color
            $(".spaceDot").css("background-color", "black");
          }

          var dragStopId = $(this).attr("id");
        },
      });

      $(".drop-toy").droppable({
        drop: function (event, ui) {
          if (evType != 1) {
            return false;
          }
          var draggableId = ui.draggable.attr("id");
          var droppableId = $(this).attr("id");
          var draggableIndex = parseInt(draggableId.split("_")[1]);
          var droppableIndex = parseInt(droppableId.split("_")[1]);
          totalAttemptsCurrentRound++;

          if (draggableIndex === droppableIndex) {
            playsfxcorrect();
            $(ui.draggable).hide();

            $(this).css({
              opacity: "1",
            });
            resultChecker();
            removeElementFromArray(draggableIndex, droppableIndex);
            // Call SlideLeft function when draggableIndex matches droppableIndex
          } else {
            playsfxwrong();
            ui.draggable.animate(
              ui.draggable.data().uiDraggable.originalPosition,
              "slow"
            );
            $(".spaceDot").css({
              backgroundColor: "black",
            });
          }
        },
        over: function (event, ui) {
          var droppableOverId = $(this).attr("id");
          console.log("over", droppableOverId, new Date().toLocaleTimeString());
        },
        out: function (event, ui) {
          var droppableOutId = $(this).attr("id");
          console.log("out", droppableOutId, new Date().toLocaleTimeString());
        },
      });
      $(".stop").droppable({
        drop: function (event, ui) {
          var $this = $(this);
          var $draggable = ui.draggable;

          // Move the dropped element inside the stop div
          $draggable
            .css({
              width: "100%",
              height: "100%",
              left: 0, // Ensure it's positioned correctly
              top: 0, // Ensure it's positioned correctly
            })
            .appendTo($this);

          // Mark as a valid drop
          ui.helper.data("validDrop", true);
        },
      });
    });
  }

  function removeAllElements() {
    SlideLeft();
    questionSet = gamedata.QuestionElemets[`set${questionCtr + 1}`];
    let draggbleElement = questionSet["draggableObj"];
    let droppableElement = questionSet["droppableObj"];
    for (let i = 0; i < draggbleElement.length; i++) {
      let dragContainerId = "drag-container_" + i;
      let dragToyId = "drag-toy_" + i;
      let dragToyElement = document.getElementById(dragToyId);
      dragToyElement && dragToyElement.parentNode.removeChild(dragToyElement);

      let DragcontainerElement = document.getElementById(dragContainerId);
      DragcontainerElement &&
        DragcontainerElement.parentNode.removeChild(DragcontainerElement);
    }
    for (let i = 0; i < droppableElement.length; i++) {
      let dropContainerId = "drop-container_" + i;
      let dropToyId = "drop-toy_" + i;

      let DropToyElement = document.getElementById(dropToyId);
      DropToyElement && DropToyElement.parentNode.removeChild(DropToyElement);

      let DropcontainerElement = document.getElementById(dropContainerId);
      DropcontainerElement &&
        DropcontainerElement.parentNode.removeChild(DropcontainerElement);
    }
    // Clear the draggableArray
    draggableArray = [];
    droppableArray = [];
  }

  $(" #map, #smoke, #saturn, #moon,#planet,.spaceRoad").hide();

  function setupElemnts() {
    questionSet = gamedata.QuestionElemets[`set${questionCtr + 1}`];
    var startGameDiv = document.getElementById("startgame");
    $("#spaceRoad").hide();
    // Check if the condition is met
    // Set the value of t based on questionCtr

    let t = 0;
    if (questionCtr == 0) {
      t = 16;
    } else if (questionCtr == 1) {
      t = 16;
    } else if (questionCtr == 2) {
      t = 8;
    } else if (questionCtr == 3) {
      t = 5;
    }

    if (questionCtr == 0) {
      startGameDiv.style.backgroundImage =
        "url('Assets/Data/images/screen1.png')";
      // displayElements();
      addDraggableAndDroppableElements();
      $("#name1").text("Earth");
      $("#name2").text("The natural Satellite");
    } else if (questionCtr == 1) {
      startGameDiv.style.backgroundImage =
        "url('Assets/Data/images/Screen1.png')";
      $("#planet").css({
        backgroundImage: "url(Assets/Data/images/new_game/moon.png)",
      });
      addDraggableAndDroppableElements();
      $(".drag-toy,.drop-toy").css("display", "block");
      $("#name1").text("The natural Satellite");
      $("#name2").text("The ring giant");
      setTimeout(() => {
        playaudio();
      }, 3000);
      // objsintrovotutorial.pause();
      // objsintrovotutorialafterClick = document.createElement("audio");
      // objsintrovotutorialafterClick.src =
      // "Assets/Data/audio/SBL-0004_Trace-the-dots-to-go-from-one.mp3";
      // chnageCaptionText("Trace the dots to go from one planet to the next!");
      // objsintrovotutorialafterClick.play();
      // objsintrovotutorialafterClick.addEventListener("ended", () => {
      //   $("#caption_text").hide();
      // });
    } else if (questionCtr == 2) {
      startGameDiv.style.backgroundImage =
        "url('Assets/Data/images/Screen1.png')";
      $("#planet").css({
        backgroundImage: "url(Assets/Data/images/new_game/saturn.png)",
        width: "600px",
        height: "600px",
        top: "170px",
        left: "-250px",
      });
      addDraggableAndDroppableElements();
      $(".drag-toy,.drop-toy").css("display", "block");
      $("#name1").text("The ring giant");
      $("#name2").text("The planet of smoke");
    } else if (questionCtr == 3) {
      startGameDiv.style.backgroundImage =
        "url('Assets/Data/images/Screen1.png')";
      $("#planet").css({
        backgroundImage: "url(Assets/Data/images/new_game/smokePlanet.png)",
        width: "700px",
        height: "700px",
        top: "40px",
        left: "-250px",
      });
      // Add draggable and droppable elements without calling displayElements
      addDraggableAndDroppableElements();
      $(".drag-toy,.drop-toy").css("display", "block");
      $("#name1").text("The planet of smoke");
      $("#name2").text("The planet of mysteries");
    }

    function playaudio() {
      var objPlayInsMusic = document.createElement("audio");
      objPlayInsMusic.src =
        "Assets/Data/audio/SBL-0004_Trace-the-dots-to-go-from-one.mp3";
      chnageCaptionText("Trace the dots to go from one planet to the next!");
      objPlayInsMusic.play();
      objPlayInsMusic.addEventListener("ended", () => {
        objPlayInsMusic.pause();
        $("#caption_text").hide();
      });
    }

    function addDraggableAndDroppableElements() {
      let draggbleElement = questionSet["draggableObj"];
      let droppableElement = questionSet["droppableObj"];
      currentlyDragToys = 0;
      currentToys = draggbleElement.length;

      for (var i = 0; i < draggbleElement.length; i++) {
        $("<div/>", {
          id: "drag-container_" + i,
          class: "drag-container",
          html: "",
        })
          .appendTo("#game_container")
          .css({
            width: draggbleElement[i]["width"],
            height: draggbleElement[i]["height"],
            top: draggbleElement[i]["top"],
            left: draggbleElement[i]["left"],
            "z-index": draggbleElement[i]["index"],
          });

        $("<div/>", {
          id: "drag-toy_" + i,
          class: "drag-toy",
          html: "",
        })
          .appendTo("#drag-container_" + i)
          .css({
            "background-image": `url(${draggbleElement[i]["image"]})`,
            transform: "rotate(" + draggbleElement[i]["rotate"] + "deg)",
          });

        let element = document.getElementById("drag-container_" + i);
        draggableArray.push(element);
      }

      for (var i = 0; i < droppableElement.length; i++) {
        $("<div/>", {
          id: "drop-container_" + i,
          class: "drop-container",
          html: "",
        })
          .appendTo("#game_container")
          .css({
            width: droppableElement[i]["width"],
            height: droppableElement[i]["height"],
            top: droppableElement[i]["top"],
            left: droppableElement[i]["left"],
            "z-index": droppableElement[i]["index"],
            opacity: droppableElement[i]["opacity"],
          });

        $("<div/>", {
          id: "drop-toy_" + droppableElement[i]["id"],
          class: "drop-toy",
          html: "",
        })
          .appendTo("#drop-container_" + i)
          .css({
            "background-image": `url(${droppableElement[i]["image"]})`,
            transform: "rotate(" + droppableElement[i]["rotate"] + "deg)",
          });
        let element = document.getElementById("drop-container_" + i);
        droppableArray.push(element);
      }

      // Create the spaceRoad div
      const spaceRoad = document.createElement("div");
      spaceRoad.id = "spaceRoad";
      spaceRoad.className = "spaceRoad";

      // Append spaceRoad to game_container
      document.getElementById("game_container").appendChild(spaceRoad);

      // Create and append 5 spaceDots divs to spaceRoad

      for (let i = 0; i < t; i++) {
        const spaceDot = document.createElement("div");
        spaceDot.id = "spaceDot_" + i; // Unique ID for each spaceDot
        spaceDot.className = "spaceDot"; // Common class for all spaceDots
        spaceRoad.appendChild(spaceDot);
      }
      $("#spaceRoad").hide();
    }
  }

  // Create 5 divs with id stop_1 to stop_5 and class stop
  for (let i = 1; i <= 4; i++) {
    $("#game_container").append(`<div id="stop_${i}" class="stop"></div>`);
  }

  let displayTimeouts = []; // Array to store timeouts for clearing later
  $(".namePlanet").hide();

  let hasRunDisplayElements = false; // Flag to track if the function has run

  function displayElements() {
    if (hasRunDisplayElements) return; // If the function has already run, exit early

    const elements = [
      "#earth",
      "#rocket",
      "#moon",
      "#saturn",
      "#smoke",
      "#map",
    ];

    // Disable the skip button
    disableSkipButton();

    // Clear previous timeouts if the function is called again
    displayTimeouts.forEach((timeout) => clearTimeout(timeout));
    displayTimeouts = [];

    elements.forEach((element, index) => {
      const timeoutId = setTimeout(() => {
        $(element).show();
      }, index * 500);
      displayTimeouts.push(timeoutId); // Store timeout ID
    });

    const hideElementsTimeoutId = setTimeout(() => {
      elements.forEach((element) => {
        $(element).hide();
      });

      // After hiding elements, show #planet and start adding draggable and droppable elements
      const showPlanetTimeoutId = setTimeout(() => {
        $("#planet,#spaceRoad,.namePlanet").show();
        $(".drag-toy,.drop-toy").css("display", "block");

        // Enable the skip button after everything is done
        enableSkipButton();
      }, 500); // 500ms delay before adding elements

      displayTimeouts.push(showPlanetTimeoutId); // Store timeout ID
    }, elements.length * 1000 + 500);

    $("#spaceRoad").css("display", "none");
    displayTimeouts.push(hideElementsTimeoutId); // Store timeout ID

    hasRunDisplayElements = true; // Set the flag to true after the first run
  }

  function SlideLeft() {
    $("#planet").hide();

    // Check if the slideDiv already exists and reset its position if it does
    var slideDiv = $("#slide");
    if (slideDiv.length) {
      slideDiv.css("left", "900px"); // Reset position to 900px
    } else {
      // Create the div element with ID and class if it doesn't exist
      slideDiv = $("<div>", {
        id: "slide",
        class: "slide",
      });

      // Append the div to #game_container
      $("#game_container").append(slideDiv);
    }

    // Set the background image based on questionCtr
    if (questionCtr === 0) {
      slideDiv.css(
        "backgroundImage",
        "url(Assets/Data/images/new_game/moon.png)"
      );
    } else if (questionCtr === 1) {
      slideDiv.css(
        "backgroundImage",
        "url(Assets/Data/images/new_game/saturn.png)"
      );
    } else if (questionCtr === 2) {
      slideDiv.css(
        "backgroundImage",
        "url(Assets/Data/images/new_game/smokePlanet.png)"
      );
    } else if (questionCtr === 3) {
      slideDiv.css(
        "backgroundImage",
        "url(Assets/Data/images/new_game/ice.png)"
      );
    }

    // Show the slideDiv, animate it, and then reset and hide it after the animation
    slideDiv.show().animate({ left: "0px" }, 500, function () {
      // Animation complete callback
      slideDiv.css("left", "900px"); // Reset position to 900px
      slideDiv.hide(); // Hide the slideDiv
      $("#planet").show();
    });
  }

  function addCards() {
    $("#startgame").show();
    $("#gameCont").hide().remove();
    $("<div/>", {
      id: "gameCont",
      class: "equalHMVWrap eqWrap",
    }).appendTo("#startgame");

    setupElemnts();
  }

  // function attachEvent() {
  //   clearTimeout(intval);
  //   setTimeout(function () {
  //     if (evType == 3) {
  //       $('.card').removeClass('highlight')
  //       intval = cycle(".card", "highlight", 2000);
  //     }
  //     if (evType == 2) {
  //       var cycle1 = cycleBySpace(".card", "highlight");

  //       // Call cycle() to cycle through elements
  //       cycle1();
  //     }
  //   }, 1300);
  // }
  // End 1st time work properlly not again need to fix

  function helpLive(id) {
    if (liveHelp) {
      $("#handindicator").hide().remove();
      $("<div/>", {
        id: "handindicator",
      }).appendTo("#" + id);

      // $("#scene0,#scene1").addClass("pointer_none");
      // setTimeout(function () {

      // }, 1500)

      // setTimeout(function () {
      //   if (liveHelp) {
      //     $("#card1").click();
      //   }
      //   // $("#card1").focus();
      // }, 2000);
    }
  }

  function calculatepercentage(index, attemps) {
    if (index == 1) {
      currentPercentage += 200 / attemps;
    } else if (index == 2) {
      currentPercentage += 300 / attemps;
    } else if (index == 3) {
      currentPercentage += 500 / attemps;
    }
    accuracyRes = currentPercentage / index;
    accuracyRes = accuracyRes.toFixed(2);
    localStorage.setItem("Percentage_correct", accuracyRes);
    document.cookie = "Percentage_correct=" + accuracyRes;
  }

  function breakEggs(cor) {
    // let j = 0;
    switch (cor) {
      case 0:
        return;
        break;
      case 1:
        cor = 2;
        break;
      case 2:
        cor = 4;
        break;
      case 3:
        cor = 6;
        break;
      default:
    }
    for (let i = 0; i < cor; i++) {
      setTimeout(function () {
        $("#lives" + i).addClass("breakEgg");
        // toffee.style.opacity = 1;
      }, 250);
    }
  }

  // update UI as per settins js parameters function
  function update_ui_Settings() {
    //  update UI for instruction backgrounds like backgroundImage or backgroundColor
    const instructiongameElm = document.getElementById("settingpage");
    if (game_ui["instruction_screen"].backgroundImage == "none") {
      instructiongameElm.style.backgroundColor =
        game_ui["instruction_screen"].backgroundColor;
    } else {
      instructiongameElm.style.backgroundImage =
        "url(" + game_ui["instruction_screen"].backgroundImage + ")";
    }

    //  update UI for instruction title text
    const instructionTextElm = document.getElementById("instruction_title");
    instructionTextElm.textContent =
      game_ui["instruction_screen"]["titleUI"].titleText;

    //  update UI for main game backgrounds like backgroundImage or backgroundColor
    const maingameElm = document.getElementById("game_container");
    if (game_ui["game_screen"].backgroundImage == "none") {
      maingameElm.style.backgroundColor =
        game_ui["game_screen"].backgroundColor;
    } else {
      maingameElm.style.backgroundImage =
        "url(" + game_ui["game_screen"].backgroundImage + ")";
    }

    //  update liives as per settings
    if (
      game_ui["game_screen"]["lives"].number >= 1 &&
      game_ui["game_screen"]["lives"].enable == true
    ) {
      for (var i = 0; i < game_ui["game_screen"]["lives"].number; i++) {
        $("<div/>", {
          id: "lives" + i,
          class: "lives",
        }).appendTo("#livesbox");
      }
    }

    // Review link
    $("#reviewbtn").bind("click", function () {
      var url = game_ui["game_screen"]["reviewlink"].link; // Specify the URL of the link to be opened
      window.open(url, "_blank");
    });
  }

  function totalTimeSpend() {
    spendtimerobj = setInterval(function () {
      totalTimeSpendS++;
      localStorage.setItem("Totaltime", totalTimeSpendS);
      document.cookie = "Totaltime=" + totalTimeSpendS;
    }, 1000);
  }

  function exitgame() {
    
    window.location.replace(url);
  }

  // Start Setting events

  function showsetting2() {
    playclick();
    LoadCaptchaScreen();
  }

  // on game setting change
  function closesetting2() {
    playclick();
    $("#settingpage2").hide();
    clearTimeout(intval);
    addEvent();
  }

  $(".settingbtns").click(function () {
    playclick();
    removeclass();
    if ($(this).attr("num") == "1") {
      $("#tap_mouse_1").addClass("activebtn");
      $("#tap_mouse_2").addClass("activebtn");
      evType = 1;
      whEvent = "click";
    }
    if ($(this).attr("num") == "2") {
      $("#dual_switch_1").addClass("activebtn");
      $("#dual_switch_2").addClass("activebtn");
      evType = 2;
      whEvent = "keypress click";
    }
    if ($(this).attr("num") == "3") {
      $("#single_switch_1").addClass("activebtn");
      $("#single_switch_2").addClass("activebtn");
      evType = 3;
      whEvent = "keypress click";
    }
    if ($(this).attr("num") == "4") {
      $("#eye_tracker_1").addClass("activebtn");
      $("#eye_tracker_2").addClass("activebtn");
      evType = 1;
      whEvent = "keypress click";
    }
  });

  function removeclass() {
    $(".settingbtns").each(function () {
      $(this).removeClass("activebtn");
    });
  }
  // End Setting events

  /*-- Captcha Screen : Starts --*/
  var CaptchaObj = { Q: "", A: 0 };
  function RegisterCaptchaEvents() {
    var captionbtn;
    $("#closeCaptcha").click(function () {
      $("#captchaScreen").addClass("ClsHide");
    });

    $(".clsNumBtn").click(function (e) {
      playclick();
      ValidateCaptcha(e);
    });
  }
  function LoadCaptchaScreen() {
    $("#captchaScreen").removeClass("ClsHide").addClass("slide-right");
    GenerateCaptchaQues();
  }

  function HideCaptchaScreen() {
    playclick();
    $("#captchaScreen").removeClass("slide-right").addClass("ClsHide");
    $("#settingpage2").show();
  }

  function ValidateCaptcha(e) {
    var CaptchaAns = Number($("#" + e.target.id).attr("data-value"));
    if (CaptchaAns == CaptchaObj.A) {
      HideCaptchaScreen();
    }
  }

  function GenerateCaptchaQues() {
    CaptchaObj = { Q: "", A: 0 };
    var Num1 = Math.floor(Math.random() * 9);
    var SecondNumLimit = 8 - Num1;
    var Num2 = Math.floor(Math.random() * SecondNumLimit);
    var QStr = "What is " + Num1 + " + " + Num2 + " ?";
    CaptchaObj.Q = QStr;
    CaptchaObj.A = Num1 + Num2;
    $("#CaptchaQ").html(CaptchaObj.Q);
  }

  RegisterCaptchaEvents();

  /*-- Captcha Screen : Ends --*/

  // endscreen animation
  function endScreen() {
    $("#welcometxt").animate(
      {
        left: "218px",
        top: "60px",
      },
      1000,
      function () {
        starAnimation();
      }
    );
  }

  function starAnimation() {
    playsfxstar();
    $("#star1").addClass("addanim");

    if (accuracyRes > 30) {
      if (accuracyRes < 70) {
        setTimeout(function () {
          playsfxstar();
          $("#star2").addClass("addanim");
          endscreeanim();
        }, 2000);
      } else {
        setTimeout(function () {
          playsfxstar();
          $("#star2").addClass("addanim");
          setTimeout(function () {
            playsfxstar();
            $("#star3").addClass("addanim");
            endscreeanim();
          }, 2000);
        }, 2000);
      }
    } else {
      endscreeanim();
    }
  }

  function endscreeanim() {
    $("#winanim").delay(500).fadeIn(500);
    setTimeout(animateBalloons, 1000);
  }

  function animateBalloons() {
    $(".balloon").show();
    $(".balloon").each(function (index) {
      var currentTop = parseInt($(this).css("top"));
      $(this).addClass(`animation-${index + 1}`);
      $(this)
        .delay(index * 50)
        .animate(
          {
            top: currentTop - 700,
          },
          1200
        );
    });
  }
  // close endscreen animation

  //  start game sfx and vo

  // create and add bgm audio
  var bgmsrc = game_ui["game_screen"].backgroundMusic;
  var objPlayPauseMusic = document.createElement("audio");
  objPlayPauseMusic.src = bgmsrc;
  objPlayPauseMusic.addEventListener("ended", playbgm);
  $("#bgm_music").bind("click", playbgm);

  var bgmUIValue;
  if (localStorage.getItem("myVolume")) {
    myVolume = localStorage.getItem("myVolume");
    bgmUIValue = localStorage.getItem("bgmUIValue");
  } else {
    myVolume = 0.15;
    bgmUIValue = 15;
  }

  $("#volume1").slider({
    min: 0,
    max: 100,
    value: bgmUIValue,
    range: "min",
    slide: function (event, ui) {
      setVolume(ui.value / 100);
      localStorage.setItem("myVolume", ui.value / 100);
      localStorage.setItem("bgmUIValue", ui.value);
      playsfxmovevolume();
    },
    stop: function (event, ui) {
      if ($(this).slider("value") > 94.5) {
        $(this).slider("value", 94.5);
        localStorage.setItem("myVolume", 1);
        localStorage.setItem("bgmUIValue", 94.5);
      }
    },
  });

  var clickUIValue;
  if (localStorage.getItem("myClickVolume")) {
    myClickVolume = localStorage.getItem("myClickVolume");
    clickUIValue = localStorage.getItem("clickUIValue");
  } else {
    myClickVolume = 0.5;
    clickUIValue = 59;
  }

  $("#volume2").slider({
    min: 0,
    max: 100,
    value: clickUIValue,
    range: "min",
    slide: function (event, ui) {
      setVolumeClick(ui.value / 100);
      localStorage.setItem("myClickVolume", ui.value / 100);
      localStorage.setItem("clickUIValue", ui.value);
      playsfxmovevolume();
    },
    stop: function (event, ui) {
      if ($(this).slider("value") > 94.5) {
        $(this).slider("value", 94.5);
        localStorage.setItem("myClickVolume", 1);
        localStorage.setItem("clickUIValue", 94.5);
      }
    },
  });

  var insUIValue;
  if (localStorage.getItem("myInsVolume")) {
    myInsVolume = localStorage.getItem("myInsVolume");
    insUIValue = localStorage.getItem("insUIValue");
  } else {
    myInsVolume = 1;
    insUIValue = 94.5;
  }

  $("#volume3").slider({
    min: 0,
    max: 100,
    value: insUIValue,
    range: "min",
    slide: function (event, ui) {
      setVolumeIns(ui.value / 100);
      localStorage.setItem("myInsVolume", ui.value / 100);
      localStorage.setItem("insUIValue", ui.value);
      playsfxmovevolume();
    },
    stop: function (event, ui) {
      if ($(this).slider("value") > 94.5) {
        $(this).slider("value", 94.5);
        localStorage.setItem("myInsVolume", 1);
        localStorage.setItem("insUIValue", 94.5);
      }
    },
  });

  var myMedia = document.createElement("audio");
  $("#player1").append(myMedia);
  $("#player2").append(myMedia);
  $("#player3").append(myMedia);
  myMedia.id = "myMedia";

  function setVolume(val) {
    if (val >= 1) {
      val = 1;
    }
    objPlayPauseMusic.volume = val;
    myVolume = val;
  }

  // play bgm audio function
  function playbgm() {
    objPlayPauseMusic.setAttribute("loop", "loop");
    setVolume(myVolume);
    if (objPlayPauseMusic.paused) {
      $("#bgm_music").removeClass("musicon");
      $("#bgm_music").addClass("musicon").html("ON");
      objPlayPauseMusic.play();
      localStorage.setItem("musicon", "ON");
    } else {
      $("#bgm_music").removeClass("musicon").html("OFF");
      objPlayPauseMusic.pause();
      localStorage.setItem("musicon", "OFF");
    }
  }

  // create and add click audio
  var objPlayClickMusic = document.createElement("audio");
  objPlayClickMusic.src = "Assets/Data/audio/sfx_selecting_card.mp3";

  $("#sound_effect").bind("click", playclickbtns);

  var clicktbtn;

  if (localStorage.getItem("clicktbtn") == "false") {
    clicktbtn = false;
    $("#sound_effect").removeClass("musicon").html("OFF");
  } else {
    clicktbtn = true;
    $("#sound_effect").removeClass("musicon");
    $("#sound_effect").addClass("musicon").html("ON");
  }

  function playclickbtns() {
    if (clicktbtn == true) {
      clicktbtn = false;
      $("#sound_effect").removeClass("musicon").html("OFF");
      localStorage.setItem("clicktbtn", false);
    } else {
      $("#sound_effect").removeClass("musicon");
      $("#sound_effect").addClass("musicon").html("ON");
      localStorage.setItem("clicktbtn", true);
      clicktbtn = true;
    }
  }

  function setVolumeClick(val) {
    if (val >= 1) {
      val = 1;
    }
    objPlayClickMusic.volume = val;
    myClickVolume = val;
  }

  // play click audio function
  function playclick() {
    setVolumeClick(myClickVolume);
    if (clicktbtn == true) {
      objPlayClickMusic.play();
    } else {
      objPlayClickMusic.pause();
    }
  }

  $("#game_caption").bind("click", playcaption);

  if (localStorage.getItem("captionbtn") == "false") {
    captionbtn = false;
    $("#game_caption").removeClass("musicon").html("OFF");
  } else {
    captionbtn = true;
    $("#game_caption").removeClass("musicon");
    $("#game_caption").addClass("musicon").html("ON");
  }

  function playcaption() {
    if (captionbtn == true) {
      captionbtn = false;
      $("#game_caption").removeClass("musicon").html("OFF");
      localStorage.setItem("captionbtn", false);
    } else {
      $("#game_caption").removeClass("musicon");
      $("#game_caption").addClass("musicon").html("ON");
      localStorage.setItem("captionbtn", true);
      captionbtn = true;
    }
  }

  // create and add ins audio
  var objPlayInsMusic = document.createElement("audio");
  objPlayInsMusic.src =
    "Assets/Data/audio/SBL-0004_Trace-the-dots-to-go-from-one.mp3";
  $("#game_voiceover").bind("click", playinsbtns);

  var instbtn;
  if (localStorage.getItem("instbtn") == "false") {
    instbtn = false;
    $("#game_voiceover").removeClass("musicon").html("OFF");
  } else {
    instbtn = true;
    $("#game_voiceover").removeClass("musicon");
    $("#game_voiceover").addClass("musicon").html("ON");
  }

  function playinsbtns() {
    if (instbtn == true) {
      instbtn = false;
      $("#game_voiceover").removeClass("musicon").html("OFF");
      localStorage.setItem("instbtn", false);
    } else {
      $("#game_voiceover").removeClass("musicon");
      $("#game_voiceover").addClass("musicon").html("ON");
      localStorage.setItem("instbtn", true);
      instbtn = true;
    }
  }

  function setVolumeIns(val) {
    if (val >= 1) {
      val = 1;
    }
    objPlayInsMusic.volume = val;
    myInsVolume = val;
  }

  function playins() {
    $("#handcursoranim").hide();
    liveHelp && onclickTiggi();

    setVolumeIns(myInsVolume);
    if (instbtn == true) {
      if (!liveHelp) {
        chnageCaptionText("Trace the dots to go from one planet to the next!");
        objPlayInsMusic.play();
        setTimeout(() => {
          $("#tiggie").removeClass("tiggieanim");
          console.log("9");
          $("#caption_text").hide();
        }, 3000);
      }
      $("#tiggie").addClass("tiggieanim");
    } else {
      !liveHelp && objPlayInsMusic.pause();
      $("#tiggie").removeClass("tiggieanim");
    }
    // objPlayInsMusic.addEventListener("ended", endInsMusic);
  }

  function endInsMusic() {
    $("#tiggie").removeClass("tiggieanim");
  }

  function playsfxmovevolume() {
    var objsfxmovevolume = document.createElement("audio");
    objsfxmovevolume.src = "Assets/Data/audio/setting_sfx_move_volume.mp3";
    objsfxmovevolume.play();
  }

  function playsintoTutorial() {
    objsintrovotutorial = document.createElement("audio");
    objsintrovotutorial.src = "Assets/Data/audio/SBL-0003_Lets-find-out.mp3";
    chnageCaptionText("Let’s find out.");
    objsintrovotutorial.play();
    objsintrovotutorial.addEventListener("ended", () => {
      setTimeout(() => {
        playsintoTutorial4();
      }, 1000); // Call playsintoTutorialafterClick after 1 second
    });
    $("#skip_button").show();
  }

  function playsintoTutorial4() {
    objsintrovotutorial.pause();
    objsintrovotutorialafterClick = document.createElement("audio");
    objsintrovotutorialafterClick.src =
      "Assets/Data/audio/SBL-0004_Trace-the-dots-to-go-from-one.mp3";
    chnageCaptionText("Trace the dots to go from one planet to the next!");
    objsintrovotutorialafterClick.play();
  }

  function playsintoTutorialafterClick() {
    // objsintrovotutorial.pause();
    // objsintrovotutorialafterClick = document.createElement("audio");
    // objsintrovotutorialafterClick.src = "Assets/Data/audio/SBL-0004_Trace-the-dots-to-go-from-one.mp3";
    // chnageCaptionText(
    //   "Trace the dots to go from one planet to the next!"
    // );
    // objsintrovotutorialafterClick.play();
    animateDragContainerToDropContainer();
    $("#skip_button").hide();
  }

  function playsintrovo() {
    objsintrovo = document.createElement("audio");
    objsintrovo.src =
      "Assets/Data/audio/SBL-0001_We-are-going-to-explore-outsid.mp3";
    objsintrovo.play();
    objsintrovo.addEventListener("ended", () => {
      $("#caption_text").hide();
      setTimeout(() => {
        playsintrovo2();
      }, 2500);
    });
    objsintrovo.addEventListener("ended", displayElements);
    chnageCaptionText("We are going to explore outside our planet");
    $("#skip_button").hide();
  }

  function playsintrovo2() {
    objsintrovo2 = document.createElement("audio");
    objsintrovo2.src =
      "Assets/Data/audio/SBL-0002_What-is-outside-our-planet.mp3";
    objsintrovo2.play();
    objsintrovo2.addEventListener("ended", displaysettingbtn);
    chnageCaptionText("What is outside our planet?");
    $("#skip_button").hide();
  }

  function displaysettingbtn() {
    $("#tiggie").removeClass("tiggieanim");
    $("#setting_button").show();
    $("#stopclick").hide();
    console.log("2");
    $("#caption_text").hide();
  }

  function playsfxselect() {
    var objsfxselect = document.createElement("audio");
    objsfxselect.src = "Assets/Data/audio/sfx_selecting_card.mp3";
    if (myClickVolume >= 1) {
      myClickVolume = 1;
    }
    objsfxselect.volume = myClickVolume;
    myClickVolume = myClickVolume;
    if (clicktbtn == true) {
      objsfxselect.play();
    } else {
      objsfxselect.pause();
    }
  }

  function playsfxwrong() {
    var objsfxwrong = document.createElement("audio");
    objsfxwrong.src = "Assets/Data/audio/sfx_wrong_match.mp3";
    chnageCaptionText("Oops!! Try again");
    setTimeout(() => {
      console.log("3");
      $("#caption_text").hide();
    }, 1000);
    if (myClickVolume >= 1) {
      myClickVolume = 1;
    }
    objsfxwrong.volume = myClickVolume;
    myClickVolume = myClickVolume;
    if (clicktbtn == true) {
      objsfxwrong.play();
      // objsfxwrong.addEventListener("ended", playwrongvo);
    } else {
      objsfxwrong.pause();
    }
  }

  function playwrongvo() {
    if (myInsVolume >= 1) {
      myInsVolume = 1;
    }
    myInsVolume = myInsVolume;
    if (instbtn == true) {
      if (tryagainctr == 1) {
        var objwrongvo1 = document.createElement("audio");
        objwrongvo1.src = "Assets/Data/audio/oops_vo.mp3";
        objwrongvo1.volume = myInsVolume;
        objwrongvo1.play();
      } else {
        var objwrongvo2 = document.createElement("audio");
        objwrongvo2.src = "Assets/Data/audio/try_again_vo.mp3";
        objwrongvo2.volume = myInsVolume;
        objwrongvo2.play();
      }
    } else {
      if (tryagainctr == 1) {
        var objwrongvo1 = document.createElement("audio");
        objwrongvo1.src = "Assets/Data/audio/oops_vo.mp3";
        objwrongvo1.volume = myInsVolume;
        objwrongvo1.pause();
      } else {
        var objwrongvo2 = document.createElement("audio");
        objwrongvo2.src = "Assets/Data/audio/try_again_vo.mp3";
        objwrongvo2.volume = myInsVolume;
        objwrongvo2.pause();
      }
    }
  }

  function playsfxcorrect() {
    var objsfxcorrect = document.createElement("audio");
    var objsfxcorrect2 = document.createElement("audio");
    // objsfxcorrect.src = "Assets/Data/audio/SBL-0005_Good-job-You-explored-outside.mp3";
    objsfxcorrect2.src = "Assets/Data/audio/Correct02.wav";
    chnageCaptionText("Good job!! You explored outside!");
    setTimeout(() => {
      console.log("4");
      $("#caption_text").hide();
    }, 1000);

    if (myClickVolume >= 1) {
      myClickVolume = 1;
    }
    objsfxcorrect.volume = myClickVolume;
    myClickVolume = myClickVolume;
    if (clicktbtn == true) {
      objsfxcorrect.play();
      objsfxcorrect2.play();
      objsfxcorrect.addEventListener("ended", playAnimaltvo);
    } else {
      objsfxcorrect.pause();
      objsfxcorrect2.pause();
    }
  }

  function playsfxstar() {
    var objsfxstar = document.createElement("audio");
    objsfxstar.src = "Assets/Data/audio/sfx_star_appears.mp3";

    if (myClickVolume >= 1) {
      myClickVolume = 1;
    }
    objsfxstar.volume = myClickVolume;
    myClickVolume = myClickVolume;
    if (clicktbtn == true) {
      objsfxstar.play();
    } else {
      objsfxstar.pause();
    }
  }

  function playEndingvo() {
    if (myInsVolume >= 1) {
      myInsVolume = 1;
    }
    myInsVolume = myInsVolume;
    if (instbtn == true) {
      var objEndingvo = document.createElement("audio");
      objEndingvo.src = "Assets/Data/audio/ending_vo.mp3";
      objEndingvo.volume = myInsVolume;
      objEndingvo.play();
    }
  }

  function playAnimaltvo() {
    if (myInsVolume >= 1) {
      myInsVolume = 1;
    }
    myInsVolume = myInsVolume;
    if (instbtn == true) {
      // var objanimalvo = document.createElement("audio");
      // console.log("jvdjsdvksdv", src2)
      // objanimalvo.src = "Assets/Data/audio/animal_sound/" + str2 + ".mp3";
      // objanimalvo.volume = myInsVolume;
      // objanimalvo.play();
      // objanimalvo.addEventListener("ended", playcorrectvo);
    }
  }

  function playcorrectvo() {
    if (myInsVolume >= 1) {
      myInsVolume = 1;
    }
    myInsVolume = myInsVolume;
    if (instbtn == true) {
      if (questionCtr == 3 && endgame == true) {
        objPlayEndMusic = document.createElement("audio");
        objPlayEndMusic.src = "Assets/Data/audio/well_done_all_match_vo.mp3";
        objPlayEndMusic.volume = myInsVolume;
        objPlayEndMusic.play();
      } else {
        if (correctctr == 1) {
          var objcorrectvo1 = document.createElement("audio");
          objcorrectvo1.src = "Assets/Data/audio/thats_right_vo.mp3";
          objcorrectvo1.volume = myInsVolume;
          objcorrectvo1.play();
          // displaylevelupouter();
        } else {
          var objcorrectvo2 = document.createElement("audio");
          objcorrectvo2.src = "Assets/Data/audio/well_done_vo.mp3";
          objcorrectvo2.volume = myInsVolume;
          objcorrectvo2.play();
          // displaylevelupouter();
        }
      }
    }
  }

  // end game sfx and vo

  function displaylevelupouter() {
    $("#levelupouter").show();

    setTimeout(function () {
      $("#levelupstar").show();
    }, 800);
    setTimeout(function () {
      $("#levelupouter").hide();
      $("#levelupstar").hide();
    }, 1500);
  }
});

$("#replayBtn").click(function () {
  location.reload(); // Reloads the webpage
});
