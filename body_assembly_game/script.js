  let score = 0;
        let lives = 3;
        let correctPlacements = 0;
        const totalParts = 12;
        
        let gameData = {
            head: {
                questions: [
                    {
                        question: "What organ in the head controls thinking and memory?",
                        options: ["Heart", "Brain", "Lungs", "Liver"],
                        correct: 1
                    },
                    {
                        question: "How many eyes do humans typically have?",
                        options: ["1", "2", "3", "4"],
                        correct: 1
                    }
                ]
            },
            neck: {
                questions: [
                    {
                        question: "What does the neck connect?",
                        options: ["Arms to body", "Head to body", "Legs to body", "Hands to arms"],
                        correct: 1
                    },
                    {
                        question: "What important tube runs through the neck?",
                        options: ["Stomach", "Throat", "Heart", "Liver"],
                        correct: 1
                    }
                ]
            },
            torso: {
                questions: [
                    {
                        question: "Which organs are mainly located in the torso?",
                        options: ["Brain and eyes", "Heart and lungs", "Hands and feet", "Hair and nails"],
                        correct: 1
                    },
                    {
                        question: "What protects the organs in the torso?",
                        options: ["Skull", "Rib cage", "Leg bones", "Arm bones"],
                        correct: 1
                    }
                ]
            },
            "left-arm": {
                questions: [
                    {
                        question: "What joint connects the arm to the shoulder?",
                        options: ["Elbow", "Wrist", "Shoulder joint", "Knee"],
                        correct: 2
                    },
                    {
                        question: "What is the main function of arms?",
                        options: ["Walking", "Breathing", "Lifting and grabbing", "Thinking"],
                        correct: 2
                    }
                ]
            },
            "right-arm": {
                questions: [
                    {
                        question: "How many main bones are in the upper arm?",
                        options: ["1", "2", "3", "4"],
                        correct: 0
                    },
                    {
                        question: "What connects the upper and lower arm?",
                        options: ["Shoulder", "Wrist", "Elbow", "Hand"],
                        correct: 2
                    }
                ]
            },
            "left-hand": {
                questions: [
                    {
                        question: "How many fingers does a typical hand have?",
                        options: ["4", "5", "6", "10"],
                        correct: 1
                    },
                    {
                        question: "What connects the hand to the arm?",
                        options: ["Elbow", "Shoulder", "Wrist", "Finger"],
                        correct: 2
                    }
                ]
            },
            "right-hand": {
                questions: [
                    {
                        question: "What is the thumb's special ability?",
                        options: ["It's the longest finger", "It can touch other fingers", "It has no joints", "It can't bend"],
                        correct: 1
                    },
                    {
                        question: "What do we use our hands for most?",
                        options: ["Walking", "Breathing", "Grasping objects", "Hearing"],
                        correct: 2
                    }
                ]
            },
            waist: {
                questions: [
                    {
                        question: "What important organs are near the waist?",
                        options: ["Brain", "Stomach and kidneys", "Eyes", "Feet"],
                        correct: 1
                    },
                    {
                        question: "What does the waist help the body do?",
                        options: ["Think", "See", "Bend and twist", "Hear"],
                        correct: 2
                    }
                ]
            },
            "left-leg": {
                questions: [
                    {
                        question: "What is the main function of legs?",
                        options: ["Thinking", "Walking and standing", "Breathing", "Eating"],
                        correct: 1
                    },
                    {
                        question: "What is the strongest bone in the human body?",
                        options: ["Arm bone", "Skull", "Thigh bone", "Rib"],
                        correct: 2
                    }
                ]
            },
            "right-leg": {
                questions: [
                    {
                        question: "What joint is in the middle of the leg?",
                        options: ["Ankle", "Hip", "Knee", "Shoulder"],
                        correct: 2
                    },
                    {
                        question: "How many legs do humans have?",
                        options: ["1", "2", "3", "4"],
                        correct: 1
                    }
                ]
            },
            "left-foot": {
                questions: [
                    {
                        question: "How many toes does a typical foot have?",
                        options: ["4", "5", "6", "10"],
                        correct: 1
                    },
                    {
                        question: "What do feet help us do?",
                        options: ["Think", "Breathe", "Balance and walk", "See"],
                        correct: 2
                    }
                ]
            },
            "right-foot": {
                questions: [
                    {
                        question: "What connects the foot to the leg?",
                        options: ["Knee", "Hip", "Ankle", "Toe"],
                        correct: 2
                    },
                    {
                        question: "What part of the foot touches the ground first when walking?",
                        options: ["Toes", "Heel", "Side", "Top"],
                        correct: 1
                    }
                ]
            }
        };

        function startGame() {
            document.getElementById('startScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
            initializeDragAndDrop();
        }

        function goHome() {
            resetGame();
            document.getElementById('gameScreen').classList.add('hidden');
            document.getElementById('endScreen').classList.add('hidden');
            document.getElementById('startScreen').classList.remove('hidden');
        }

        function resetGame() {
            score = 0;
            lives = 3;
            correctPlacements = 0;
            updateUI();
            
            // Reset drop zones
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.classList.remove('filled', 'placed-part');
                zone.innerHTML = zone.innerHTML.replace(/<div class="body-part.*?<\/div>/, '');
                // Restore original text
                const part = zone.dataset.part;
                switch(part) {
                    case 'head': zone.textContent = 'Head'; break;
                    case 'neck': zone.textContent = 'Neck'; break;
                    case 'torso': zone.textContent = 'Torso'; break;
                    case 'left-arm': zone.textContent = 'L.Arm'; break;
                    case 'right-arm': zone.textContent = 'R.Arm'; break;
                    case 'left-hand': zone.textContent = 'L.Hand'; break;
                    case 'right-hand': zone.textContent = 'R.Hand'; break;
                    case 'waist': zone.textContent = 'Waist'; break;
                    case 'left-leg': zone.textContent = 'L.Leg'; break;
                    case 'right-leg': zone.textContent = 'R.Leg'; break;
                    case 'left-foot': zone.textContent = 'L.Foot'; break;
                    case 'right-foot': zone.textContent = 'R.Foot'; break;
                }
            });
            
            // Reset body parts
            document.querySelectorAll('.body-part').forEach(part => {
                part.style.display = 'flex';
                part.classList.remove('correct-answer', 'wrong-answer');
            });
        }

        function restartGame() {
            resetGame();
            document.getElementById('endScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
        }

        function updateUI() {
            document.getElementById('score').textContent = score;
            document.getElementById('lives').textContent = lives;
        }

        function initializeDragAndDrop() {
            const bodyParts = document.querySelectorAll('.body-part');
            const dropZones = document.querySelectorAll('.drop-zone');

            bodyParts.forEach(part => {
                part.addEventListener('dragstart', handleDragStart);
                part.addEventListener('dragend', handleDragEnd);
            });

            dropZones.forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('drop', handleDrop);
                zone.addEventListener('dragenter', handleDragEnter);
                zone.addEventListener('dragleave', handleDragLeave);
            });
        }

        let draggedElement = null;

        function handleDragStart(e) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDragEnter(e) {
            if (!e.target.classList.contains('filled')) {
                e.target.classList.add('highlight');
            }
        }

        function handleDragLeave(e) {
            e.target.classList.remove('highlight');
        }

        function handleDrop(e) {
            e.preventDefault();
            e.target.classList.remove('highlight');
            
            const targetZone = e.target;
            const draggedPart = draggedElement.dataset.part;
            const targetPart = targetZone.dataset.part;

            if (draggedPart === targetPart && !targetZone.classList.contains('filled')) {
                // Correct placement
                targetZone.classList.add('filled', 'placed-part');
                targetZone.textContent = draggedElement.textContent;
                draggedElement.style.display = 'none';
                correctPlacements++;
                
                playSound('correct');
                showQuiz(draggedPart);
                
                if (correctPlacements === totalParts) {
                    setTimeout(endGame, 1500);
                }
            } else if (targetZone.classList.contains('filled')) {
                // Zone already filled
                return;
            } else {
                // Wrong placement
                lives--;
                updateUI();
                playSound('wrong');
                vibrate();
                showPopup('wrongPlacementPopup');
                
                if (lives <= 0) {
                    setTimeout(endGame, 1500);
                }
            }
        }

        function showQuiz(bodyPart) {
            const questions = gameData[bodyPart].questions;
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            
            document.getElementById('quizQuestion').textContent = randomQuestion.question;
            
            const optionsContainer = document.getElementById('quizOptions');
            optionsContainer.innerHTML = '';
            
            randomQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.onclick = () => checkAnswer(index, randomQuestion.correct);
                optionsContainer.appendChild(button);
            });
            
            showPopup('quizPopup');
        }

        function checkAnswer(selectedIndex, correctIndex) {
            hidePopup('quizPopup');
            
            if (selectedIndex === correctIndex) {
                score += 10;
                updateUI();
                showPopup('correctPopup');
                playSound('correct');
            } else {
                showPopup('wrongPopup');
                playSound('wrong');
            }
        }

        function showPopup(popupId) {
            document.getElementById(popupId).classList.remove('hidden');
        }

        function hidePopup(popupId) {
            document.getElementById(popupId).classList.add('hidden');
        }

        function endGame() {
            document.getElementById('finalScore').textContent = score;
            document.getElementById('finalLives').textContent = lives;
            
            const completionMessage = document.getElementById('completionMessage');
            if (correctPlacements === totalParts) {
                completionMessage.textContent = "🎉 Perfect! You built a complete human body!";
            } else if (lives > 0) {
                completionMessage.textContent = `Good effort! You placed ${correctPlacements} out of ${totalParts} parts correctly.`;
            } else {
                completionMessage.textContent = "💪 Don't give up! Try again to build the complete body!";
            }
            
            document.getElementById('gameScreen').classList.add('hidden');
            document.getElementById('endScreen').classList.remove('hidden');
        }

        function playSound(type) {
            // Create audio context for sound effects
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                if (type === 'correct') {
                    oscillator.frequency.value = 800;
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                } else {
                    oscillator.frequency.value = 200;
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                }
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                // Fallback if audio context fails
                console.log('Audio not supported');
            }
        }

        function vibrate() {
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Visual shake effect
            document.querySelector('.game-container').classList.add('shake');
            setTimeout(() => {
                document.querySelector('.game-container').classList.remove('shake');
            }, 500);
        }

        // Initialize the game when page loads
        document.addEventListener('DOMContentLoaded', function() {
            updateUI();
        });