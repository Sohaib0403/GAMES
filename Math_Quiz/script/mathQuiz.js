window.onload = function () {
	
	var scale = {
        x: 1,
        y: 1
    },
    zoomFactor = 1,
    stageLeft = 0,
    config = {
        'stageWidth': "1180px",
        'stageHeight': "720"
    };

function scaleStage() {
    var rootElem = document.getElementById("mathQuizContent");
    scale.x = (window.innerWidth) / config['stageWidth'];
    scale.y = (window.innerHeight) / config['stageHeight'];
    let newScale = scale.x + ', ' + scale.y;
    if (scale.x < scale.y) {
        zoomFactor = scale.x;
        newScale = scale.x + ', ' + scale.x;
    } else {
        zoomFactor = scale.y;
        newScale = scale.y + ', ' + scale.y;
    }
    let newWidth = Number(newScale.split(',')[0]) * config['stageWidth'];
    let leftPos = (window.innerWidth - newWidth) / 2;
    stageLeft = leftPos;
    window.rootLeftElmPos = stageLeft;
    var styleObj = {};
    styleObj = {
        '-webkit-transform': 'scale(' + newScale + ')',
        '-moz-transform': 'scale(' + newScale + ')',
        '-ms-transform': 'scale(' + newScale + ')',
        '-o-transform': 'scale(' + newScale + ')',
        'transform': 'scale(' + newScale + ')',
        '-webkit-transform-origin': 'left top',
        '-moz-transform-origin': 'left top',
        '-ms-transform-origin': 'left top',
        '-o-transform-origin': 'left top',
        'transform-origin': 'left top',
        'position': 'absolute',
        'top': '0px',
        'left': leftPos + 'px',
        'overflow': 'hidden',
        'width': config['stageWidth'] + 'px',
        'height': config['stageHeight'] + 'px'
    };
    for (var key in styleObj) {
        if (styleObj.hasOwnProperty(key)) {
            rootElem.style[key] = styleObj[key]
        }
    }
    window.zoomFactor = zoomFactor
	return newScale;
};
scaleStage();


    var wrongScrCtr = 0;
    var correctScrCtr = 0;
    var temArray = [];
    var currentQuesCtr = 0;
    var optionarry = [];
    var ctaBlinkingTimer;
    shuffleArray(math_quiz_data["question_images"]);
    showRandomBgColor();
    createQuestions();
    ctaBlinking();
    function createQuestions() {
        let correctSmileyimgpath = math_quiz_data["imagesLink"] + math_quiz_data["correctSmiley"];
        document.getElementById("mathQuizAnswerCorrectSmiley").style.backgroundImage = "url(" + correctSmileyimgpath + ")";
    
        let wrongSmileyimgpath = math_quiz_data["imagesLink"] + math_quiz_data["wrongSmiley"];
        document.getElementById("mathQuizAnswerWrongSmiley").style.backgroundImage = "url(" + wrongSmileyimgpath + ")";
    
        for (var i = 0; i < math_quiz_data["question_images"].length; i++) {
            let questionObj = math_quiz_data["question_images"][i];
            let questionImageName = questionObj.question;
    
            temArray[i] = questionImageName; // storing question id like "question01", etc.
    
            let div = document.createElement('div');
            div.id = questionImageName;
            div.className = "math-quiz-question-image";
    
            let imgpath = math_quiz_data["imagesLink"] + questionImageName + ".png";
            div.style.backgroundImage = "url(" + imgpath + ")";
            div.style.display = "none";
    
            document.getElementById("mathQuizQuestionContainer").appendChild(div);
        }
    
        for (var i = 0; i < 4; i++) {
            let newdiv = document.createElement('div');
            newdiv.id = "math-quiz-option-" + i;
            newdiv.className = "math-quiz-option-text-box";
    
            switch (i) {
                case 0:
                    newdiv.style.left = "50px";
                    newdiv.style.top = "400px";
                    break;
                case 1:
                    newdiv.style.left = "460px";
                    newdiv.style.top = "400px";
                    break;
                case 2:
                    newdiv.style.left = "50px";
                    newdiv.style.top = "500px";
                    break;
                case 3:
                    newdiv.style.left = "460px";
                    newdiv.style.top = "500px";
                    break;
            }
    
            document.getElementById("mathQuizContent").appendChild(newdiv);
    
            let div = document.createElement('div');
            div.id = "math-quiz-option-text-" + i;
            div.className = "math-quiz-option-text";
    
            document.getElementById("math-quiz-option-" + i).appendChild(div);
    
            document.getElementById("math-quiz-option-text-" + i).addEventListener("click", function () {
                checkAnswer(this, this.innerHTML);
            });
        }
    
        displayOptions(temArray[currentQuesCtr]); // This will need to use the new object format
    }
    

    function displayOptions(val) {
        if (currentQuesCtr == temArray.length) {
            document.getElementById("mathQuizComplete").style.display = "flex";
            clearInterval(ctaBlinkingTimer);
        } else {
            // Show the question image
            document.getElementById(val).style.display = "block";
    
            // Find the matching question object using the val (question ID)
            const questionObj = math_quiz_data.question_images.find(q => q.question === val);
    
            if (!questionObj) {
                console.error("Question not found for ID:", val);
                return;
            }
    
            // Clone and shuffle options
            const options = [...questionObj.options];
            shuffleArray(options);
    
            // Store correct answer to check later
            currentCorrectAnswer = questionObj.correctAnswer;
    
            // Display the shuffled options
            for (let i = 0; i < 4; i++) {
                const optionDiv = document.getElementById("math-quiz-option-text-" + i);
                optionDiv.innerHTML = options[i];
            }
        }
    }
    


    function myFunction(item, index) {
        document.getElementById("math-quiz-option-text-" + index).innerHTML = "";
        document.getElementById("math-quiz-option-text-" + index).innerHTML += item;
    }

    function checkAnswer(event, selectAns) {
        var blinkTimeCtr = 0;
    
        const questionId = temArray[currentQuesCtr]; // e.g., "question01"
        const questionObj = math_quiz_data.question_images.find(q => q.question === questionId);
    
        if (!questionObj) {
            console.error("Question not found for ID:", questionId);
            return;
        }
    
        const isCorrect = (selectAns === questionObj.correctAnswer);
    
        if (isCorrect) {
            var correctTime = setInterval(function () {
                blinkTimeCtr++;
                if (blinkTimeCtr == 1) event.parentNode.style.backgroundColor = "green";
                if (blinkTimeCtr == 2) event.parentNode.style.backgroundColor = "rgb(157, 205, 237)";
                if (blinkTimeCtr == 3) event.parentNode.style.backgroundColor = "green";
                if (blinkTimeCtr == 4) {
                    event.parentNode.style.backgroundColor = "rgb(157, 205, 237)";
                    clearInterval(correctTime);
                    let audiopath = math_quiz_data.soundPath + math_quiz_data.soundCorrect;
                    new Audio(audiopath).play();
                }
            }, 100);
    
            setTimeout(() => {
                correctScrCtr++;
                document.getElementById("mathQuizCorrectScoreText").innerText = correctScrCtr;
                document.querySelector(".score").innerHTML = "Score : " + correctScrCtr;
                nextQuestion();
            }, 800);
    
        } else {
            wrongScrCtr++;
            document.getElementById("mathQuizWrongScoreText").innerText = wrongScrCtr;
    
            var wrongTime = setInterval(function () {
                blinkTimeCtr++;
                if (blinkTimeCtr == 1) event.parentNode.style.backgroundColor = "red";
                if (blinkTimeCtr == 2) event.parentNode.style.backgroundColor = "rgb(157, 205, 237)";
                if (blinkTimeCtr == 3) event.parentNode.style.backgroundColor = "red";
                if (blinkTimeCtr == 4) {
                    event.parentNode.style.backgroundColor = "rgb(157, 205, 237)";
                    clearInterval(wrongTime);
                    let audiopath = math_quiz_data.soundPath + math_quiz_data.soundWrong;
                    new Audio(audiopath).play();
    
                    // OPTIONAL: reshuffle same question options before moving on
                    // shuffleArray(optionarry);
                    // optionarry.forEach(myFunction);
    
                    // Move to next question after delay
                    setTimeout(() => {
                        nextQuestion();
                    }, 400);
                }
            }, 100);
        }
    }
    

    function nextQuestion() {
        document.getElementById("mathQuizAnswerCorrectScorebox").style.backgroundColor = "green";
        document.getElementById(temArray[currentQuesCtr]).style.display = "none";
        currentQuesCtr++;
        showRandomBgColor();
        displayOptions(temArray[currentQuesCtr]);

    }
    function showRandomBgColor() {
        var r = Math.floor(Math.random() * math_quiz_data["backgroundColors"].length);
        document.getElementById("mathQuizContent").style.backgroundColor = math_quiz_data["backgroundColors"][r];
    }
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function ctaBlinking() {

        ctaBlinkingTimer = setInterval(function () {

            var ctaBlinkTimeCtr = 0;
           

        }, 2000);
    }

    document.getElementById('playbtn').addEventListener('click', function() {
        document.querySelector('.gamestart').style.display = 'none';
      });

      document.querySelector('.replaybtn').addEventListener('click', function() {
        location.reload();
      });
      
      
};