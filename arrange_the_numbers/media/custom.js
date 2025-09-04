/*-- Document Ready Starts --*/
$(document).ready(function () {

    var firstVal, secondVal, firstEvt, secondEvt;
    var sumbitCtr = 0;
    var newQuesArr = [];
    var newAnsArr = [];
    var chkDropCtr = 0;
    var cursorTimer;
    playGame();
    homeGame();
    addElements();
    activeSubmit();


    function addElements() {

        //console.log("addElements");
        for (var i = 1; i < numbers_data['numbers'][0]['qestion_set'].length; i++) {
            newQuesArr[i - 1] = numbers_data['numbers'][0]['qestion_set'][i];
        }
        shuffleArray(newQuesArr);
        newQuesArr.unshift("1");

        for (var i = 1; i <= numbers_data['numbers'][0]['answer_set'].length; i++) {
            newAnsArr[i - 1] = numbers_data['numbers'][0]['answer_set'][i - 1];
        }

        //    console.log("answer::" + newAnsArr);


        $("#questiontxt").text(numbers_data['numbers'][0]['questionTxt']);
        for (var i = 1; i <= numbers_data['numbers'][0]['qestion_set'].length; i++) {

            $("<div/>", {
                'id': 'dropbox' + i,
                'num': newQuesArr[i - 1],
                'class': 'dropbox'
            }).appendTo('#number_container');
            $("<div/>", {
                'id': 'number' + i,
                'num': newQuesArr[i - 1],
                'class': 'numberStyle'
            }).appendTo('#number_container');

            $('#number1').css("pointer-events", "none");

            $('#number' + i).attr('original-top', $('#number' + i).css('top'));
            $('#number' + i).attr('original-left', $('#number' + i).css('left'));
            $("<div/>", {
                'id': 'numberTxt' + i,
                'class': 'numberTxt'
            }).appendTo('#number' + i);

            $("<div/>", {
                'id': 'numberVal' + i,
                'class': 'numberVal',
                'html': newQuesArr[i - 1],
            }).appendTo('#numberTxt' + i);

        }

        try {
            $(".numberStyle").removeClass('animated zoomIn');
            $(".numberStyle").addClass('animated zoomIn');
            var setTimer = setTimeout(function () {
                $(".numberStyle").removeClass('animated zoomIn');
                clearTimeout(setTimer);
            }, 600);

        } catch (error) {

        }


        draggable();
    }

    function draggable() {

        $('.numberStyle').draggable({
            //containment:,
            scroll: false,
            zIndex: 100,
            revert: function (p_bDropped) {
                //console.log("p_bDropped: is droped obj $(this) is drag item");
                if (!p_bDropped) {
                    //console.log("revert the div")
                    $(this).css("zIndex", "100");
                    $(this).animate({ top: parseFloat($(this).attr('original-top')), left: parseFloat($(this).attr('original-left')) }, 300, function () {

                    });
                } else {
                    // console.log("droped on::" + p_bDropped.attr("id") + "-dragItem-" + $(this).attr("id"));

                    chkDropCtr++;
                    var dragNum = $(this).attr("num");
                    var dropOfDragObj;
                    $(".dropbox").each(function () {
                        if ($(this).attr("num") == dragNum) {
                            // alert($( this ).attr( "id" ));
                            dropOfDragObj = $(this);
                        }
                    });
                    var replceDragNum = p_bDropped.attr("num");
                    var replceDragNumId;
                    $(".numberStyle").each(function () {
                        if ($(this).attr("num") == replceDragNum) {
                            // alert($( this ).attr( "id" ));
                            replceDragNumId = $(this);
                        }
                    });


                    dropOfDragObj.attr("num", replceDragNum); // set current number on drop obj 
                    replceDragNumId.animate({ top: parseFloat(dropOfDragObj.css('top')), left: parseFloat(dropOfDragObj.css('left')) }, 200, function () {
                        $(this).attr('original-top', $(this).css('top'));
                        $(this).attr('original-left', $(this).css('left'));
                    });



                    p_bDropped.attr("num", $(this).attr("num")); // set current number on drop obj 
                    // set drag obj in drop part in center

                    $(this).animate({ top: parseFloat(p_bDropped.css('top')), left: parseFloat(p_bDropped.css('left')) }, 200, function () {
                        $(this).attr('original-top', $(this).css('top'));
                        $(this).attr('original-left', $(this).css('left'));
                    });


                    if (chkDropCtr == 19) {
                        activeSubmit();
                    }
                    // var chechResult = checkResult();
                    // if (chechResult) {
                    //     // activeSubmit();
                    //     // playweldoneAudio();
                    // }

                    var strn = p_bDropped.attr("id");
                    strn = strn.replace('dropbox', '');

                    var curntNum = p_bDropped.attr("num");

                    if(Number(strn) == Number(curntNum)){
                       
                        $(this).removeClass('animated bounceIn');
                        $(this).addClass('animated bounceIn');
                        var objCurr = $(this);
                        var setTimerObj = setTimeout(function () {
                            objCurr.removeClass('animated bounceIn');
                            clearTimeout(setTimerObj);
                        }, 600);
                    }


                }
            },
            create: function (event, ui) {


            },
            start: function (event, ui) {

                try {
                    clearTimeout(cursorTimer);
                    $(".ins_arrow").hide();
                    $('#number1').css("pointer-events", "auto");
                } catch (error) {

                }


            },
            drag: function (event, ui) {

                var changeLeft = ui.position.left;
                var newLeft = changeLeft / scaleStage().split(",")[0]; //newScale u can get jquery
                var changeTop = ui.position.top;
                var newTop = changeTop / scaleStage().split(",")[0]; //newScale u can get jquery
                ui.position.left = newLeft;
                ui.position.top = newTop;

                $('body').mouseleave(function () {
                    $('body').mouseup();
                });

            },
            stop: function (event, ui) {
                //console.log("draggable stop");
            }
        });

        $('.dropbox').droppable({
            accept: ".numberStyle",
            activate: function (event, ui) {
                //console.log("droppable activate");
            },
            deactivate: function (event, ui) {
                //console.log("droppable deactivate");
            },
            out: function (event, ui) {
                //console.log("droppable out");

            },
            over: function (event, ui) {
                //console.log("droppable over" + $(this).attr('id'));
            },
            drop: function (ev, ui) {
                // console.log("droppable drop");

            }
        });

    }


    function checkResult() {
        //console.log("checkResult");

        var localArrRes = [];

        $(".dropbox").each(function (index) {
            var num = $(this).attr("num")
            localArrRes[index] = num;
        });

        // console.log("Result:" + localArrRes);

        //console.log(localArrRes);
        var a = localArrRes;
        var b = newAnsArr;
        // comparing both arrays using stringify 
        if (JSON.stringify(a) == JSON.stringify(b)) {
            // console.log("True");
            return true;
        } else {
            //console.log("False");
            return false;
        }
    }

    function submitResult() {
        sumbitCtr++;
        var result = checkResult();
        if (result) {
            sumbitCtr = 0;
            correctFeedback();
        } else {
            wrongFeedback();
        }
    }

    function wrongFeedback() {

        if (sumbitCtr == 20) {
            sumbitCtr = 0;
            deactiveSubmit();
            $("#submit_btn").hide();
            showAnswer();
            playshowanswerAudio();

        } else {
            deactiveSubmit();
            $("#submit_btn").hide();
            showTryAgain();
            playwrongAudio();
        }

    }

    function correctFeedback() {
        deactiveSubmit();
        $("#submit_btn").hide();
        activeWelldoneBtn();
        playcongAudio();

        $("#welldonebg").show();
        $("#stopclick").show();
        $(".welldone").removeClass('animated zoomIn');
        $(".welldone").addClass('animated zoomIn');
        var setTimer = setTimeout(function () {
            $(".welldone").removeClass('animated zoomIn');
            $("#welldonebg").hide();
            clearTimeout(setTimer);
        }, 2000);

    }
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    function showTryAgain() {
        $("#stopclick").show();
        $("#tryagn_btn").show();
        $("#tryagn_btn").unbind("click", tryAgain);
        $("#tryagn_btn").bind("click", tryAgain);

        $("#tryaganinbg").show();
        $("#stopclick").show();
        $(".tryaganinimg").removeClass('animated zoomIn');
        $(".tryaganinimg").addClass('animated zoomIn');
        var setTimer = setTimeout(function () {
            $(".tryaganinimg").removeClass('animated zoomIn');
            $("#tryaganinbg").hide();
            clearTimeout(setTimer);
        }, 2000);


    }

    function showAnswer() {
        $("#stopclick").show();
        $("#showanswer_btn").show();
        $("#showanswer_btn").unbind("click", showResult);
        $("#showanswer_btn").bind("click", showResult);
    }

    function showResult() {
        hideShowAnswer();
        for (var i = 1; i <= numbers_data['numbers'][0]['qestion_set'].length; i++) {
            $("#numberVal" + i).text(numbers_data['numbers'][0]['answer_set'][i - 1]);
        }

    }
    function hideShowAnswer() {
        $("#showanswer_btn").unbind("click", showResult);
        $("#showanswer_btn").hide();
    }
    function hideTryAgain() {
        $("#tryagn_btn").unbind("click", playAgain);
        $("#tryagn_btn").hide();
    }

    function tryAgain() {
        $("#stopclick").hide();
        hideTryAgain();
        activeSubmit();
    }
    function playAgain() {

        $("#stopclick").hide();
        hideTryAgain();
        hideShowAnswer();
        deactiveWelldoneBtn();
        activeSubmit();
        newQuesArr = [];
        newAnsArr = [];
        chkDropCtr = 0;

        try {
            $(".ins_arrow").hide();
            clearTimeout(cursorTimer);
            cursorTimer = setTimeout(function () {
                $(".ins_arrow").show();
                clearTimeout(cursorTimer);

                try {
                    clearTimeout(newcursorTimer);
                    var newcursorTimer = setTimeout(function () {
                        $(".ins_arrow").hide();
                        clearTimeout(newcursorTimer);
                    }, 4000);
                } catch (error) {

                }



            }, 3000);
        } catch (error) {

        }



        $(".numberStyle").removeClass('animated zoomIn');
        $("#number_container").empty();
        addElements();
    }

    function activeSubmit() {

        chkDropCtr = 0;
        $("#submit_btn").show();
        $("#submit_btn").css({ "opacity": "1", "cursor": "pointer" });
        $("#submit_btn").unbind("click", submitResult);
        $("#submit_btn").bind("click", submitResult);

    }

    function deactiveSubmit() {

        $("#submit_btn").show();
        chkDropCtr = 0;
        $("#submit_btn").css({ "opacity": "0.3", "cursor": "default" });
        $("#submit_btn").unbind("click", submitResult);

    }

    function activeWelldoneBtn() {

        $("#weldone_btn").show();
        $("#weldone_btn").unbind("click", playAgain);
        $("#weldone_btn").bind("click", playAgain);

    }

    function deactiveWelldoneBtn() {

        $("#weldone_btn").hide();
        $("#weldone_btn").unbind("click", playAgain);

    }


    function playGame() {
        $("#play_btn").bind("click", playAgain);
    }
    function homeGame() {
        $("#home_btn").bind("click", playAgain);
    }

    function playweldoneAudio() {
        var objPlayMusic = document.createElement("audio");
        objPlayMusic.src = "media/audio/welldone.mp3";
        objPlayMusic.play();
    }

    function playcongAudio() {
        var objPlayMusic = document.createElement("audio");
        objPlayMusic.src = "media/audio/welldone.mp3";
        objPlayMusic.play();
    }

    function playshowanswerAudio() {
        // var objPlayMusic = document.createElement("audio");
        // objPlayMusic.src = "media/audio/demi.mp3";
        // objPlayMusic.play();
    }

    function playwrongAudio() {
        var objPlayMusic = document.createElement("audio");
        objPlayMusic.src = "media/audio/tryagain.mp3";
        objPlayMusic.play();
    }

    $("#play_audio").bind("click", playbgm);
    $("#pause_audio").bind("click", pausebgm);
    var objPlayPauseMusic = document.createElement("audio");
    objPlayPauseMusic.src = "media/audio/bgm.mp3";
    objPlayPauseMusic.addEventListener('ended', playbgm)

    function playbgm() {
        objPlayPauseMusic.play();
    }
    function pausebgm() {
        objPlayPauseMusic.pause();
    }



});
