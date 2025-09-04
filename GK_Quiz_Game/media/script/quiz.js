
// quiz game code start here
$(document).ready(function () {
    var category = "";
    // InitActivity();
    // $("#btn1").addClass("btnactive")
    $(".btn").bind("click",function () {
        $(".btn").removeClass("btnactive")
        $(this).addClass("btnactive")
        category = $(this).text()
        select()
        // console.log(category)
        InitActivity();
    })
    function InitActivity() {
        var questionctr = 0;
        var correctansctr = 0;
        var myInterval;
        var timerval = setting[0]["settime"];
        var correctans;
        var mcqcorrectarry = [];
        var mcqselectarry = [];
        var SSQ = setting[0]["SSQ"];
        var MSQ = setting[0]["MSQ"];
        var TFQ = setting[0]["TFQ"];
        const audioPlayer = new Audio();
        var optbgcolor = setting[0]["optbgcolor"];
        var quesfontsize = setting[0]["quesfontsize"];
        var optfontsize = setting[0]["optfontsize"];
        $("#welldonebg").hide();
        $(".welldone").hide();
        $(".tryfeedback").hide();
        $("#tryagainbg").hide();
        $("#reset").bind("click", replay);
        $("#replay").bind("click", replayactivity);

        $(".btn_play").bind("click", function () {
            $("#home").hide();
            $("#mathQuizContent").show();
            addTimer();
        })
        $(".btn_help").bind("click", function () {
            $("#helpdiv").show();
        })

        $("#submit").bind("click", function () {
            $(this).addClass("disable")
            select()
            if (SSQ == true) {
                singleSelect();
            }
            if (MSQ == true) {
                multiSelect();
            }
            if (TFQ == true) {
                trueFalseSelect();
            }     
        })
        // console.log(category)
        
        
        
        function singleSelect() {
            if (correctans == "true") {
                correctansctr++;
                correctFeedback();
                set_progress(correctansctr);
            } else {
                wrongFeedback();
                $('#optiontext_0').removeClass("selectedopt");
                $('#optiontext_1').removeClass("selectedopt");
                $('#optiontext_2').removeClass("selectedopt");
                $('#optiontext_3').removeClass("selectedopt");
            }
            questionctr++;
            setTimeout(function () {
                if (questionctr == (JData[category].length)) {
                    clearInterval(myInterval);
                    gameComplete();
                    var scorepercentage = (correctansctr * 100) / questionctr;
                    scorepercentage = scorepercentage.toFixed(2).replace(/[.,]00$/, '');
                    $("#gameCompleteText").html("Score : " + scorepercentage + '%');

                } else {
                    createQuizQuestions(category);
                }
            }, 1800)
        }
        const equalsCheck = (a, b) => {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        function multiSelect() {

            if (equalsCheck(mcqselectarry, mcqcorrectarry)) {
                correctansctr++;
                correctFeedback();
            } else {
                wrongFeedback();
                $('#optiontext_0').removeClass("selectedopt");
                $('#optiontext_1').removeClass("selectedopt");
                $('#optiontext_2').removeClass("selectedopt");
                $('#optiontext_3').removeClass("selectedopt");
            }
            questionctr++;
            set_progress(questionctr);
            setTimeout(function () {
                if (questionctr == (JData[category].length)) {
                    clearInterval(myInterval);
                    gameComplete();
                    var scorepercentage = (correctansctr * 100) / questionctr;
                    scorepercentage = scorepercentage.toFixed(2).replace(/[.,]00$/, '');
                    $("#gameCompleteText").html("Score : " + scorepercentage + '%');

                } else {
                    createQuizQuestions();
                }
            }, 1500)
        }
        function trueFalseSelect() {
            if (correctans == "true") {
                correctansctr++;
                correctFeedback();

            } else {
                wrongFeedback();
                $('#optiontext_0').removeClass("selectedopt");
                $('#optiontext_1').removeClass("selectedopt");
                $('#optiontext_2').removeClass("selectedopt");
                $('#optiontext_3').removeClass("selectedopt");
            }
            questionctr++;
            set_progress(questionctr);
            setTimeout(function () {
                if (questionctr == (JData[category].length)) {
                    clearInterval(myInterval);
                    gameComplete();
                    var scorepercentage = (correctansctr * 100) / questionctr;
                    scorepercentage = scorepercentage.toFixed(2).replace(/[.,]00$/, '');
                    $("#gameCompleteText").html("Score : " + scorepercentage + '%');

                } else {
                    createQuizQuestions();
                }
            }, 1500)
        }

        function set_progress(correctansctr) {
            let _num = correctansctr * 100/JData[category].length;
            $('#progress').empty();
            var el_1_width = 0;
            
            if (_num > 100) { el_1_width = 30; } else { el_1_width = _num; }

            var new_font_clor = '';

            if (_num < 10) { new_font_clor = 'color:#000000'; }

            $('#progress').append('<div class="progress-text" style="' + new_font_clor + '">' + _num + ' %</div>');

            $('#progress').append('<div class="progress-el" style="background-color:#53e244; width:' + el_1_width + '%;">&nbsp;</div>');

        }
        updateMainUi();

        function updateMainUi() {
            //  update UI for home page
            var uipath = "media/assets/theme";

            // $('#hometitle').css('background-image', 'url(' + uipath + '/Quiz-Logo.png)');

            //  update UI for main game page
            // $('body').css('background-image', 'url(' + uipath + '/gamebg.avif)');
            $('#questionbar').css('background-image', 'url(' + uipath + '/questionbar.png)');
            $('#timeup').css('background-image', 'url(' + uipath + '/timesup.png)');

        }

        function addTimer() {
            clearInterval(myInterval); 
            myInterval = setInterval(function () {
                timerval--;
                if (timerval == 0) {
                    clearInterval(myInterval);
                    $("#timeupbg").show();
                    $(".timeup").removeClass('animated zoomIn');
                    $(".timeup").addClass('animated zoomIn');
                    playwrongAudio2();
                }
                var minutes = Math.floor(timerval / 60);
                var seconds = timerval % 60;
                var formattedTime = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
                $("#timer").text(formattedTime);
            }, 1000);
        }
        createQuizQuestions(category);

        function createQuizQuestions(category) {
            $("#submit").addClass("disable")
            $("#ques_num").html((questionctr + 1) + "/" + JData[category].length);
            $("#questboxdiv").empty().html("");
            $("#optionbox").empty().html("");
            $("#questboxdiv").text(JData[category][questionctr]["Ques"]);

            for (var i = 0; i < JData[category][questionctr]["ArrOpt"].length; i++) {
                $("<div/>", {
                    'id': 'option_' + i,
                    'num': i,
                    'class': 'option',
                    'status': JData[category][questionctr]["ArrOpt"][i]["Status"]
                }).appendTo('#optionbox');
                
                $("<div/>", {
                    'id': 'optiontext_' + i,
                    'num': i,
                    'class': 'optiontext',
                    'html': JData[category][questionctr]["ArrOpt"][i]["Text"],
                    'status': JData[category][questionctr]["ArrOpt"][i]["Status"]
                }).appendTo('#option_' + i);

                if (MSQ == true) {
                    mcqcorrectarry[i] = JData[category][questionctr]["ArrOpt"][i]["Status"];
                    mcqselectarry[i] = "false";
                }

            }
            $(".optiontext").css("background-color", optbgcolor + "!important");
            // $("#questboxdiv").css("font-size", quesfontsize);
            $(".optiontext").css("font-size", optfontsize);
            $(".optiontext").css("color", "black");
            $(".math-quiz-question-container").css("color", "black");

            if (SSQ == true) {
                $('.optiontext').bind("click", function () {
                    $("#submit").removeClass("disable")
                    correctans = $(this).attr("status");
                    $('#optiontext_0').removeClass("selectedopt");
                    $('#optiontext_1').removeClass("selectedopt");
                    $('#optiontext_2').removeClass("selectedopt");
                    $('#optiontext_3').removeClass("selectedopt");
                    $(this).addClass("selectedopt");
                    select();
                });
            }

            if (MSQ == true) {

                $('.option').on('click', function () {

                    $(this).toggleClass('selectedopt');
                    const hasClass = $(this).hasClass('selectedopt');
                    if (hasClass) {
                        mcqselectarry[$(this).attr("num")] = "true";
                    } else {
                        mcqselectarry[$(this).attr("num")] = "false";
                    }


                });

            }

            if (TFQ == true) {
                $('.option').bind("click", function () {
                    correctans = $(this).attr("status");
                    $('#option_0').removeClass("selectedopt");
                    $('#option_1').removeClass("selectedopt");
                    $('#option_2').removeClass("selectedopt");
                    $('#option_3').removeClass("selectedopt");
                    $(this).addClass("selectedopt");

                });
            }



        }
        function areArraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }

            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }

            return true;
        }
        function correctFeedback() {
            $("#welldonebg").show();
            $(".welldone").show();
            playcongAudio();
            var setTimer = setTimeout(function () {
                $(".welldone").hide();
                $("#welldonebg").hide();
                clearTimeout(setTimer);
            }, 1500);
        }

        function playcongAudio() {
            audioPlayer.pause();
            audioPlayer.src = "media/assets/audio/correct.mp3";
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }

        function wrongFeedback() {
            $("#tryagainbg").show();
            $(".tryfeedback").show();
            playwrongAudio();
            var setTimer = setTimeout(function () {
                $(".tryfeedback").hide();
                $("#tryagainbg").hide();
                clearTimeout(setTimer);
            }, 2000);
        }

        function playwrongAudio() {
            audioPlayer.pause();
            audioPlayer.src = "media/assets/audio/wrong.mp3";
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }

        function playwrongAudio2() {
            audioPlayer.pause();
            audioPlayer.src = "media/assets/audio/tryagain.mp3";
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }

        function gameComplete() {
            $("#rightBoxMain").hide();
            $("#gameComplete").show();
            clearInterval(myInterval);
            greatwork();
        }

        function replayactivity(){
            category = '';
            clearInterval(myInterval);
            $("#home").show();
            $('.progress-text').html("0%");
            $('.progress-el').remove();
            $("#gameComplete").hide();
            $("#timeupbg").hide();
            questionctr = 0;
            correctansctr = 0;
            timerval = setting[0]["settime"];
            $("#questboxdiv").empty();
            $("#optionbox").empty();
            $(".btn").removeClass("btnactive")
            $("#ques_num").empty();
        }

        function replay() {
            $('.progress-text').html("0%");
            $('.progress-el').remove();
            $("#gameComplete").hide();
            $("#timeupbg").hide();
            questionctr = 0;
            correctansctr = 0;
            timerval = setting[0]["settime"];
            $("#questboxdiv").empty();
            $("#optionbox").empty();
            clearInterval(myInterval);
            createQuizQuestions(category);
            addTimer();
            select();
        }

        function greatwork() {
            var objPlayMusic = document.createElement("audio");
            objPlayMusic.src = "media/assets/audio/greatwork.mp3";
            objPlayMusic.play();
        }
        
        
        closehelp = function () {
            $("#helpdiv").hide();
        }
    }
    
            function select() {
                var objPlayMusic = document.createElement("audio");
                objPlayMusic.src = "media/assets/audio/select.wav";
                objPlayMusic.currentTime=0;
                objPlayMusic.play();
            }
    
});