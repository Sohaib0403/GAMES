var game_ui =
{
    "language": {
        type: "RTL" 
    },
    "instruction_screen": {
        backgroundImage: "Assets/Data/images/home/home_screen.png", // pass "none" if no need image, if need image pass like "Assets/Data/images/home/home_screen.jpg"
        backgroundColor: "rgba(0, 0, 0, 0.700)",
        titleUI: {
            width: "780px",
            textAlign: "center",
            titleText: "",
            fontSize: "44px",
            color: "white",
            left: "453px",
            top: "29px",
            backgroundPosition: "center",
        }
    },
    "start_screen": {
        backgroundImage: "none", 
        backgroundColor: "rgba(0, 0, 0, 0.700)",
        titleUI: {
            width: "780px",
            textAlign: "center",
            titleText: "اكمل فرز المجموعة",
            fontSize: "49px",
            color: "white",
            top: "164px",
            animation: "mover 5s ease infinite",
        },
        instructionUI: {
            width: "780px",
            textAlign: "center",
            titleText: "اسحب الكلمة الصحيحة في مكانها في الجملة ثم اضغط علي تاكد من الاجابة",
            fontSize: "49px",
            color: "white",
            top: "574px",
            animation: "mover 5s ease infinite",
        },
        startButtonUI: {
            backgroundImage: "Assets/Data/images/home/startbtn.png",
            width: "226px",
            height: "219px",
            left: "515px",
            top: "278px"
        }
    },
    "game_screen": {
        backgroundMusic: "Assets/Data/audio/bgm.mp3",
        backgroundImage: "none", // pass "none" is no need image pass "Assets/Data/images/bg.jpg" for image
        backgroundColor: "rgba(0, 0, 0, 0.856)",
        timerboxUI: {
            backgroundImage: "Assets/Data/images/timer.png",
            width: "226px",
            height: "90px",
            left: "26px",
            top: "23px",
        },
        timerUI: {
            left: "92px",
            top: "30px",
            fontSize: "36px",
            color: "white",
            fontWeight: "bold",
            color: "black",
        },
        playsoundUI: {
            backgroundImage: "Assets/Data/images/gameplay_btn_sound.png",
            width: "55px",
            height: "59px",
            right: "142px",
            bottom: "16px",
            borderRadius: "20px",
            padding: "5px",

        },
        pausesoundUI: {
            backgroundImage: "Assets/Data/images/gameplay_btn_music.png",
            width: "55px",
            height: "59px",
            right: "46px",
            bottom: "16px",
            borderRadius: "20px",
            padding: "5px",
        },
        tryagainUI: {
            backgroundImage: "Assets/Data/images/tryagain.gif",
            width: "264px",
            height: "264px",
            left: "39%",
            top: "18%",
            borderRadius: "150px",
        },
        correctfeedbackUI: {
            backgroundImage: "Assets/Data/images/correct_answer_feedback.gif",
            width: "414px",
            height: "305px",
            left: "28%",
            top: "18%",
            borderRadius: "150px",
        },
        resultpage: {
            minumum: 60,
            badeffect: "Assets/Data/images/tryagain.gif",  // you can pass image, gif and mp4
            goodeffect: "Assets/Data/images/correct_answer_feedback.gif",  // you can pass image, gif and mp4
            badaudio: "Assets/Data/audio/wrong.wav",
            goodaudio: "Assets/Data/audio/welldone.wav",
        },
        reviewlink: {
            link: "",
        },
        settimer: {
            timeval: 1120,
            count: "none" // up, down, none
        },
        lives: {
            number: 6,
            enable: true // true, false
        },
        randomQuestions: {
            randomval: false // true for questions comes random, false for stop random
        },
        layout: {
            type: 2 // type 1 and 2
        },
        submitUI: {
            width: "195px",
            height: "60px",
            left: "534px",
            top: "636px",
            borderRadius: "10px",
            backgroundImage: "", // update path for image
            backgroundColor: "#357ed8",
            border: "2px solid white",
            titleText: "تأكيد الإجابة",
            fontSize: "29px",
            color: "white",
            textalign: "center",
            fontweight: "bold"

        },
        sentenceBlankUI: {
            fontSize: "34px",
            color: "black",
			backgroundColor:"#d8d8d8",
			fontweight: "bold",
        }

    }
};
