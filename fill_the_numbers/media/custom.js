/*-- Document Ready Starts --*/
$(document).ready(function () {

    var sumbitCtr = 0;
    var newQuesArr = [];
    var cursorTimer;
    var insTop, insleft;
    playGame();
    homeGame();
    addElements();
    activeSubmit();


    function addElements() {

        $("#questiontxt").text(numbers_data['numbers'][0]['questionTxt']);

        getRandomInt(Number(numbers_data['numbers'][0]['missing']));

        for (var i = 1; i <= numbers_data['numbers'][0]['qestion_set'].length; i++) {

            $("<div/>", {
                'id': 'number' + i,
                'class': 'numberStyle'
            }).appendTo('#number_container');

            $("<div/>", {
                'id': 'numberTxt' + i,
                'class': 'numberTxt'
            }).appendTo('#number' + i);

            $("<input/>", {
                'id': 'numberVal' + i,
                'class': 'numberVal',
                "maxlength": "2",
                "num": 0,
                "value": numbers_data['numbers'][0]['qestion_set'][i - 1]
            }).appendTo('#numberTxt' + i);


        }


        for (var i = 1; i <= newQuesArr.length; i++) {

            $("#numberVal" + newQuesArr[i - 1]).val("");

            $("#numberVal" + newQuesArr[i - 1]).css("pointer-events", "auto");
           

            $("#numberVal" + newQuesArr[i - 1]).keyup(function () {
                clearTimeout(cursorTimer);
                $(".ins_arrow").hide();

                try {
                    this.value = this.value.replace(/[^0-9\.]/g,'');
                } catch (error) {
                    
                }
               
                if(Number($(this).attr("value")) == Number(this.value)){
                    $(this).parent().parent().removeClass('animated bounceIn');
                    $(this).parent().parent().addClass('animated bounceIn');
                    var objCurr = $(this).parent().parent();
                    var setTimerObj = setTimeout(function () {
                        objCurr.removeClass('animated bounceIn');
                        clearTimeout(setTimerObj);
                    }, 600);
                }

                var fillChartCtr = 0;
                $(".numberVal").each(function (index) {

                    if ($(this).val().length == 0) {
                        
                    } else {
                        fillChartCtr++;
                        if (fillChartCtr == 20) {
                            // activeSubmit();
                            // var resultchk = checkResult();
                            // if (resultchk) {
                            //     playweldoneAudio();
                            // }
                        }
                    }
                });

            });

        }

        var minVal = Math.min.apply(null, newQuesArr)
        insTop = $("#number" + minVal).css('top');
        insleft = $("#number" + minVal).css('left');


        try {
            $(".numberStyle").removeClass('animated zoomIn');
            $(".numberStyle").addClass('animated zoomIn');
            var setTimer = setTimeout(function () {
                $(".numberStyle").removeClass('animated zoomIn');
                clearTimeout(setTimer);
            }, 600);

        } catch (error) {

        }


    }
    function getRandomInt(max) {

        while (newQuesArr.length < max) {
            var randomnumber = Math.floor(Math.random() * 20 + 1);
            if (newQuesArr.indexOf(randomnumber) > -1)
                continue;
            newQuesArr[newQuesArr.length] = randomnumber;
        }

    }

    function checkResult() {

        var localArrRes = [];

        $(".numberVal").each(function (index) {
            var num = $(this).val();
            localArrRes[index] = num;
        });


        var a = localArrRes;
        var b = numbers_data['numbers'][0]['qestion_set'];

        for(var i = 0; i< a.length; i++){

            if(a[i] == b[i]){
                
            }else{
                
                $("#numberVal"+(i+1)).css("color", "red");
                
            }

        }

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

            $("#tryagainbg").show();
            $(".tryfeedback").removeClass('animated zoomIn');
            $(".tryfeedback").addClass('animated zoomIn');
            var setTimer = setTimeout(function () {
                $(".tryfeedback").removeClass('animated zoomIn');
                $("#tryagainbg").hide();
                clearTimeout(setTimer);
            }, 2000);

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

    function showTryAgain() {
        $("#stopclick").show();
        $("#tryagn_btn").show();
        $("#tryagn_btn").unbind("click", tryAgain);
        $("#tryagn_btn").bind("click", tryAgain);
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
            $("#numberVal" + i).val(numbers_data['numbers'][0]['qestion_set'][i - 1]);
        }

    }
    function hideShowAnswer() {
        $("#showanswer_btn").unbind("click", showResult);
        $("#showanswer_btn").hide();
    }
    function hideTryAgain() {

        $("#tryagn_btn").unbind("click", tryAgain);
        $("#tryagn_btn").hide();

    }

    function tryAgain() {
        $("#stopclick").hide();
        hideTryAgain();
        activeSubmit();

        for (var i = 1; i <= numbers_data['numbers'][0]['qestion_set'].length; i++) {
            $("#numberVal"+i).css();
        }
        
        
    }

    function playAgain() {

        $("#stopclick").hide();
        hideTryAgain();
        hideShowAnswer();
        deactiveWelldoneBtn();
        activeSubmit();
        newQuesArr = [];


        try {
            $(".ins_arrow").hide();
            clearTimeout(cursorTimer);
            cursorTimer = setTimeout(function () {
                $(".ins_arrow").show();

                insTop = parseFloat(insTop) + 74;
                insleft = parseFloat(insleft) + 325;
                $(".ins_arrow").css({
                    "top": insTop,
                    "left": insleft
                })
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

        $("#submit_btn").show();
        $("#submit_btn").unbind("click", submitResult);
        $("#submit_btn").bind("click", submitResult);

    }

    function deactiveSubmit() {

        $("#submit_btn").hide();
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
