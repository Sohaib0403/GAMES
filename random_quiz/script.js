 // Game variables
        let currentQuestion = 0;
        let score = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let startTime = 0;
        let gameTime = 0;
        let timerInterval;
        let answered = false;

        // Three.js setup
        let scene, camera, renderer;
        let characters = [];

        // Quiz questions for 5-10 age group
        const questions = [
            {
                question: "What color do you get when you mix red and yellow?",
                options: ["Purple", "Orange", "Green", "Blue"],
                correct: 1
            },
            {
                question: "How many legs does a spider have?",
                options: ["6", "8", "10", "4"],
                correct: 1
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Giraffe", "Blue Whale", "Lion"],
                correct: 2
            },
            {
                question: "How many days are there in a week?",
                options: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "What do bees make?",
                options: ["Milk", "Honey", "Butter", "Cheese"],
                correct: 1
            },
            {
                question: "Which planet is closest to the sun?",
                options: ["Earth", "Mars", "Venus", "Mercury"],
                correct: 3
            },
            {
                question: "What do you call a baby cat?",
                options: ["Puppy", "Kitten", "Cub", "Chick"],
                correct: 1
            },
            {
                question: "How many sides does a triangle have?",
                options: ["2", "3", "4", "5"],
                correct: 1
            },
            {
                question: "What season comes after summer?",
                options: ["Winter", "Spring", "Autumn", "Summer"],
                correct: 2
            },
            {
                question: "Which animal is known as the 'King of the Jungle'?",
                options: ["Tiger", "Elephant", "Lion", "Bear"],
                correct: 2
            },
            {
                question: "What is 5 + 3?",
                options: ["7", "8", "9", "6"],
                correct: 1
            },
            {
                question: "Which fruit is yellow and curved?",
                options: ["Apple", "Orange", "Banana", "Grape"],
                correct: 2
            },
            {
                question: "What do fish use to breathe underwater?",
                options: ["Lungs", "Nose", "Gills", "Mouth"],
                correct: 2
            },
            {
                question: "How many fingers do you have on one hand?",
                options: ["4", "5", "6", "3"],
                correct: 1
            },
            {
                question: "What color is the sun usually painted as?",
                options: ["Blue", "Green", "Yellow", "Red"],
                correct: 2
            },
            {
                question: "Which bird cannot fly?",
                options: ["Eagle", "Penguin", "Parrot", "Owl"],
                correct: 1
            },
            {
                question: "What is the first letter of the alphabet?",
                options: ["B", "A", "C", "D"],
                correct: 1
            },
            {
                question: "How many wheels does a bicycle have?",
                options: ["1", "2", "3", "4"],
                correct: 1
            },
            {
                question: "What do you wear on your feet?",
                options: ["Hat", "Gloves", "Shoes", "Shirt"],
                correct: 2
            },
            {
                question: "Which meal do you eat in the morning?",
                options: ["Dinner", "Lunch", "Snack", "Breakfast"],
                correct: 3
            }
        ];

        // Initialize Three.js
        function initThreeJS() {
            const canvas = document.getElementById('character-canvas');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, 780/750, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
            renderer.setSize(780, 750);
            renderer.setClearColor(0x000000, 0);

            // Create floating geometric characters
            createCharacters();
            
            camera.position.z = 5;
            animate();
        }

        function createCharacters() {
            const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3];
            
            for(let i = 0; i < 6; i++) {
                const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                const material = new THREE.MeshBasicMaterial({color: colors[i]});
                const character = new THREE.Mesh(geometry, material);
                
                character.position.x = (Math.random() - 0.5) * 8;
                character.position.y = (Math.random() - 0.5) * 6;
                character.position.z = (Math.random() - 0.5) * 2;
                
                character.velocity = {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.01
                };
                
                scene.add(character);
                characters.push(character);
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        // Create floating stars
        function createStars() {
            const container = document.querySelector('.floating-stars');
            for(let i = 0; i < 20; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.innerHTML = '⭐';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.fontSize = (Math.random() * 10 + 10) + 'px';
                container.appendChild(star);
            }
        }

        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        function startGame() {
            currentQuestion = 0;
            score = 0;
            correctAnswers = 0;
            wrongAnswers = 0;
            startTime = Date.now();
            
            // Shuffle questions
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            
            showScreen('quiz-screen');
            startTimer();
            displayQuestion();
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                gameTime = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(gameTime / 60);
                const seconds = gameTime % 60;
                document.getElementById('timer').textContent = 
                    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
            }, 1000);
        }

        function displayQuestion() {
            answered = false;
            const question = questions[currentQuestion];
            
            document.getElementById('current-question').textContent = currentQuestion + 1;
            document.getElementById('score').textContent = score;
            document.getElementById('question').textContent = question.question;
            
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option';
                button.textContent = option;
                button.onclick = () => selectAnswer(index);
                optionsContainer.appendChild(button);
            });
        }

        function selectAnswer(selectedIndex) {
            if (answered) return;
            answered = true;
            
            const question = questions[currentQuestion];
            const options = document.querySelectorAll('.option');
            
            if (selectedIndex === question.correct) {
                options[selectedIndex].classList.add('correct');
                score++;
                correctAnswers++;
            } else {
                options[selectedIndex].classList.add('wrong');
                options[question.correct].classList.add('correct');
                wrongAnswers++;
            }
            
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                    endGame();
                } else {
                    displayQuestion();
                }
            }, 1500);
        }

        function endGame() {
            clearInterval(timerInterval);
            
            document.getElementById('final-score').textContent = score;
            document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
            document.getElementById('correct-count').textContent = correctAnswers;
            document.getElementById('wrong-count').textContent = wrongAnswers;
            
            showScreen('end-screen');
        }

        function resetGame() {
            showScreen('start-screen');
            clearInterval(timerInterval);
            gameTime = 0;
        }

        function goHome() {
            resetGame();
        }

        // Initialize game
        window.onload = function() {
            initThreeJS();
            createStars();
        };