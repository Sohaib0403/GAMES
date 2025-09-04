/*-- Document Ready Starts --*/
$(document).ready(function () {
    // declear variables and events
    var quesCtr = 0;
    var wrongAttemp = 0;
    var myCardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var ins_text = numbers_data["play_ins"];
    shuffleArray(numbers_data['questions']);
    addCards();
    $("#startbtn").bind("click", playgame);
    $("#playagain").bind("click", playAgain);
    $("#teena_button").bind("click", showInsPopup);
    $("#additional_btn").bind("click", mainmenupopup);
    $("#yesexit").bind("click", yesexitfn);
    $("#noexit").bind("click", noexitfn);
    // start game function
    function playgame() {
        $("#start_page").hide();
        setTimeout(() => {
            autoInsDisplay();
        }, 500);
        playbgm();
    }
    // instruction auto display function
    function autoInsDisplay() {
        $("#ins_popup_text").html();
        $("#ins_popup_text").html(ins_text);
        $("#ins_popup").show();

        setTimeout(() => {
            $("#ins_popup").hide();
            displayQuestion();
        }, 5000);

    }
    // create and add all cards function
    function addCards() {

        //shuffleArray(numbers_data['numbers'][0]['optionSet']);

        for (var i = 0; i < numbers_data['numbers'].length; i++) {

            $("<div/>", {
                'id': 'card' + i,
                'class': 'card' + i,
            }).appendTo('#number_container');

            for (var j = 0; j < numbers_data['numbers'].length; j++) {
                $("<div/>", {
                    'id': 'subcard' + i + '_' + j,
                    'class': 'subcard hidepoint'
                }).appendTo('#card' + i);
            }

            $("#card" + i).on('click', function () {
                checkMatchCards(this);
            });

        }



        setBingoCardValues();

    }
    // display question function
    function displayQuestion() {

        $("#show_bingo_dots").html("").empty();

        if (quesCtr < numbers_data['questions'].length) {
            for (var j = 0; j < numbers_data['questions'][quesCtr]; j++) {

                $("<div/>", {
                    'id': 'bingo_dots' + j,
                    'class': 'bingo_dots'
                }).appendTo('#show_bingo_dots');

                $('#bingo_dots' + j).css({
                    'left': getRandomInt(10, 280),
                    'top': getRandomInt(10, 280)
                })
            }

            $("#maincard").addClass("is_flipped");

            setTimeout(() => {
                $("#maincard").removeClass("is_flipped");
            }, 5000);

        } else {
            $("#mystar1").show();
            $("#mystar2").show();
            $("#mystar3").show();
            if (wrongAttemp == 0) {
                congFeedback();
            }
            if (wrongAttemp == 1) {
                $("#mystar3").hide();
                congFeedback();
            }
            if (wrongAttemp >= 2) {
                $("#mystar2").show();
                $("#mystar3").hide();
                congFeedback();
            }
        }



    }
    // get random value function
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
    // set bingo card values function
    function setBingoCardValues() {

        var tempNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        shuffleArray(myCardNumbers);
        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[0]; i++) {

            $("#subcard0_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[1]; i++) {

            $("#subcard1_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[2]; i++) {

            $("#subcard2_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[3]; i++) {

            $("#subcard3_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }
        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[4]; i++) {

            $("#subcard4_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[5]; i++) {

            $("#subcard5_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[6]; i++) {

            $("#subcard6_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[7]; i++) {

            $("#subcard7_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

        shuffleArray(tempNumber)
        for (var i = 0; i < myCardNumbers[8]; i++) {

            $("#subcard8_" + tempNumber[i]).removeClass("hidepoint").addClass("active");
        }

    }
    // check and match bingo Card function
    function checkMatchCards(evt) {
        var ctr = 0;
        $(evt).find(".subcard").each(function (index) {
            if ($(this).hasClass("active")) {
                ctr++;
            }
        });

        if (ctr == numbers_data['questions'][quesCtr]) {
            playcorrectAudio()
            $(evt).css({
                'pointer-events': 'none',
                'background-color': '#85f9bc'
            })
            if (quesCtr >= numbers_data["correct_ans_ins"].length) {
                ins_text = numbers_data["correct_ans_ins"][Number(numbers_data["correct_ans_ins"].length) - 1];
            } else {
                ins_text = numbers_data["correct_ans_ins"][quesCtr];
            }
            quesCtr++;
            autoInsDisplay();
        } else {
            playwrongAudio();
            if (wrongAttemp >= numbers_data["incorrect_ans_ins"].length) {
                ins_text = numbers_data["incorrect_ans_ins"][Number(numbers_data["incorrect_ans_ins"].length) - 1];
            } else {
                ins_text = numbers_data["incorrect_ans_ins"][wrongAttemp];
            }
            wrongAttemp++;
            autoInsDisplay();
        }


    }
    // show Ins Popup function
    function showInsPopup() {
        ins_text = numbers_data["play_ins"];
        $("#ins_popup_text").html();
        $("#ins_popup_text").html(ins_text);
        $("#ins_popup").show();
        setTimeout(() => {
            $("#ins_popup").hide();
        }, 4000);
    }
    // cong Feedback function
    function congFeedback() {
        playcongAudio();
        $("#welldonebg").show();
        $(".star").removeClass('animated zoomIn');
        $(".star").addClass('animated zoomIn');
    }
    // play again game function
    function playAgain() {
        $(".welldone").removeClass('animated zoomIn');
        $("#welldonebg").hide();
        $("#stopclick").hide();
        $("#number_container").empty();
        quesCtr = 0;
        wrongAttemp = 0;
        myCardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        ins_text = numbers_data["play_ins"];
        shuffleArray(numbers_data['questions']);
        addCards();

        setTimeout(() => {
            autoInsDisplay();
        }, 500);

    }
    // play cong audio function
    function playcongAudio() {
        var objPlayMusic = document.createElement("audio");
        objPlayMusic.src = numbers_data["audio"][0]["gamecomplete_audio"];
        objPlayMusic.play();
    }
    // play correct audio function
    function playcorrectAudio() {
        var objPlayMusic = document.createElement("audio");
        objPlayMusic.src = numbers_data["audio"][0]["correct_audio"];
        objPlayMusic.play();
    }
    // play wrong audio function
    function playwrongAudio() {
        var objPlayMusic = document.createElement("audio");
        objPlayMusic.src = numbers_data["audio"][0]["incorrect_audio"];
        objPlayMusic.play();
    }
    // declear bgm obj and event for play audio
    var objPlayPauseMusic = document.createElement("audio");
    objPlayPauseMusic.src = numbers_data["audio"][0]["bgm_audio"];
    objPlayPauseMusic.addEventListener('ended', playbgm)
    // play bgm audio function
    function playbgm() {
        objPlayPauseMusic.play();
        $(objPlayPauseMusic).prop("volume", 0.05);
    }
    // main menu popup function
    function mainmenupopup(){
        $("#main_menu_screen").show();
    }
    // exit game funtion
    function yesexitfn(){
        try {
            top.window.close();
        } catch (error) {
            
        }
        try {
            windows.close();
        } catch (error) {
            
        }
        try {
            Self.close()
        } catch (error) {
            
        }

        $("#main_menu_screen").hide();
        
    }
    // No exit game funtion
    function noexitfn(){
        $("#main_menu_screen").hide();
    }

});
