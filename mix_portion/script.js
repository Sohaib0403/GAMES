   let currentLevel = 1;
        let lives = 6;
        let score = 0;
        let currentPotion = [];
        let targetRecipe = [];
        let availableIngredients = [];
        let isBrewingAnimation = false;
        
        // Three.js variables
        let scene, camera, renderer, smokeParticles = [], explosionParticles = [];
        
        const ingredients = [
            { symbol: '🍄', color: '#8b4513', name: 'Mushroom' },
            { symbol: '🌟', color: '#ffd700', name: 'Star Dust' },
            { symbol: '🕷️', color: '#444444', name: 'Spider' },
            { symbol: '🦇', color: '#2d1b69', name: 'Bat Wing' },
            { symbol: '🌙', color: '#c0c0c0', name: 'Moon Stone' },
            { symbol: '👁️', color: '#228b22', name: 'Eye of Newt' },
            { symbol: '💀', color: '#f5f5f5', name: 'Skull Powder' },
            { symbol: '🔥', color: '#ff4500', name: 'Dragon Fire' },
            { symbol: '❄️', color: '#87ceeb', name: 'Ice Crystal' },
            { symbol: '⚡', color: '#ffff00', name: 'Lightning' },
            { symbol: '🌿', color: '#32cd32', name: 'Herb' },
            { symbol: '💎', color: '#9370db', name: 'Gem' }
        ];

        const witchMessages = [
            "Excellent! You're a natural alchemist!",
            "Perfect brewing! The potion sparkles with magic!",
            "Wonderful! Your potion-making skills improve!",
            "Marvelous! The ingredients dance together beautifully!",
            "Spectacular! You've mastered this recipe!",
            "Oh no! That's not quite right. Try again!",
            "Hmm, something's missing from this potion...",
            "The mixture doesn't look right. Be more careful!",
            "This potion won't work. Check the recipe again!",
            "Focus, young one! The recipe must be followed exactly!"
        ];

        // Initialize Three.js
        function initThreeJS() {
            const container = document.getElementById('three-container');
            
            // Scene setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            
            camera.position.z = 5;
            
            // Start render loop
            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // Update smoke particles
            smokeParticles.forEach((particle, index) => {
                particle.position.y += particle.userData.velocity.y;
                particle.position.x += particle.userData.velocity.x;
                particle.rotation.z += particle.userData.rotation;
                particle.scale.multiplyScalar(particle.userData.scale);
                particle.material.opacity *= particle.userData.fade;
                
                if (particle.material.opacity < 0.01) {
                    scene.remove(particle);
                    smokeParticles.splice(index, 1);
                }
            });
            
            // Update explosion particles
            explosionParticles.forEach((particle, index) => {
                particle.position.add(particle.userData.velocity);
                particle.userData.velocity.multiplyScalar(0.98); // Deceleration
                particle.userData.velocity.y -= 0.01; // Gravity
                particle.rotation.z += particle.userData.rotation;
                particle.material.opacity *= particle.userData.fade;
                
                if (particle.material.opacity < 0.01) {
                    scene.remove(particle);
                    explosionParticles.splice(index, 1);
                }
            });
            
            renderer.render(scene, camera);
        }

        function createSmokeEffect() {
            const smokeGeometry = new THREE.PlaneGeometry(0.5, 0.5);
            const colors = [0x9c27b0, 0x6a0dad, 0xff6b35, 0x4caf50];
            
            for (let i = 0; i < 20; i++) {
                const smokeMaterial = new THREE.MeshBasicMaterial({
                    color: colors[Math.floor(Math.random() * colors.length)],
                    transparent: true,
                    opacity: 0.6
                });
                
                const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
                smoke.position.set(
                    (Math.random() - 0.5) * 2,
                    -2 + Math.random() * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
                
                smoke.userData = {
                    velocity: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: 0.03 + Math.random() * 0.02
                    },
                    rotation: (Math.random() - 0.5) * 0.05,
                    scale: 1.005,
                    fade: 0.98
                };
                
                scene.add(smoke);
                smokeParticles.push(smoke);
            }
        }

        function createExplosionEffect() {
            const explosionGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const colors = [0xffd700, 0xff6b35, 0x4caf50, 0x9c27b0, 0xffff00];
            
            for (let i = 0; i < 30; i++) {
                const explosionMaterial = new THREE.MeshBasicMaterial({
                    color: colors[Math.floor(Math.random() * colors.length)],
                    transparent: true,
                    opacity: 0.9
                });
                
                const particle = new THREE.Mesh(explosionGeometry, explosionMaterial);
                particle.position.set(0, -1, 0);
                
                const angle = (Math.PI * 2 * i) / 30;
                const speed = 0.1 + Math.random() * 0.1;
                
                particle.userData = {
                    velocity: new THREE.Vector3(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed + 0.05,
                        (Math.random() - 0.5) * 0.05
                    ),
                    rotation: (Math.random() - 0.5) * 0.1,
                    fade: 0.95
                };
                
                scene.add(particle);
                explosionParticles.push(particle);
            }
        }

        function startGame() {
            currentLevel = 1;
            lives = 6;
            score = 0;
            currentPotion = [];
            isBrewingAnimation = false;
            showScreen('game-screen');
            generateLevel();
            updateDisplay();
            
            // Initialize Three.js if not already done
            if (!scene) {
                initThreeJS();
            }
        }

        function goHome() {
            showScreen('start-screen');
            // Clear any ongoing animations
            smokeParticles.forEach(particle => scene.remove(particle));
            explosionParticles.forEach(particle => scene.remove(particle));
            smokeParticles = [];
            explosionParticles = [];
        }

        function showScreen(screenName) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.querySelector('.' + screenName).classList.add('active');
        }

        function generateLevel() {
            // Generate target recipe (2-4 ingredients for current level)
            const recipeLength = Math.min(2 + Math.floor(currentLevel / 2), 5);
            targetRecipe = [];
            
            for (let i = 0; i < recipeLength; i++) {
                const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
                targetRecipe.push(randomIngredient);
            }

            // Generate available ingredients (include recipe ingredients + extras)
            availableIngredients = [...targetRecipe];
            
            // Add some random ingredients to make it challenging
            const extraIngredients = Math.min(4, 8 - targetRecipe.length);
            for (let i = 0; i < extraIngredients; i++) {
                let randomIngredient;
                do {
                    randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
                } while (availableIngredients.some(ing => ing.symbol === randomIngredient.symbol));
                availableIngredients.push(randomIngredient);
            }

            // Shuffle available ingredients
            availableIngredients = availableIngredients.sort(() => Math.random() - 0.5);
            
            currentPotion = [];
            updateWitchMessage(`Level ${currentLevel}: Create a potion with these ingredients!`);
        }

        function updateDisplay() {
            // Update level
            document.getElementById('level').textContent = currentLevel;

            // Update lives
            const heartsContainer = document.getElementById('lives');
            heartsContainer.innerHTML = '';
            for (let i = 0; i < 6; i++) {
                const heart = document.createElement('span');
                heart.className = i < lives ? 'heart' : 'heart lost';
                heart.textContent = '❤️';
                heartsContainer.appendChild(heart);
            }

            // Update target recipe
            const targetContainer = document.getElementById('target-ingredients');
            targetContainer.innerHTML = '';
            targetRecipe.forEach(ingredient => {
                const ingredientDiv = document.createElement('div');
                ingredientDiv.className = 'target-ingredient';
                ingredientDiv.style.setProperty('--color', ingredient.color);
                ingredientDiv.textContent = ingredient.symbol;
                ingredientDiv.title = ingredient.name;
                targetContainer.appendChild(ingredientDiv);
            });

            // Update available ingredients
            const ingredientsContainer = document.getElementById('ingredients-panel');
            ingredientsContainer.innerHTML = '';
            availableIngredients.forEach((ingredient, index) => {
                const ingredientDiv = document.createElement('div');
                ingredientDiv.className = 'ingredient';
                ingredientDiv.style.setProperty('--color', ingredient.color);
                ingredientDiv.textContent = ingredient.symbol;
                ingredientDiv.title = ingredient.name;
                ingredientDiv.onclick = () => addIngredient(index);
                ingredientsContainer.appendChild(ingredientDiv);
            });

            // Update current potion
            updatePotionDisplay();
        }

        function updatePotionDisplay() {
            const potionContainer = document.getElementById('current-potion');
            potionContainer.innerHTML = '';
            
            if (currentPotion.length === 0) {
                potionContainer.innerHTML = '<div style="color: #666; font-style: italic;">Empty cauldron - add ingredients!</div>';
                return;
            }

            currentPotion.forEach(ingredient => {
                const ingredientDiv = document.createElement('div');
                ingredientDiv.className = 'potion-ingredient';
                ingredientDiv.style.setProperty('--color', ingredient.color);
                ingredientDiv.textContent = ingredient.symbol;
                ingredientDiv.title = ingredient.name;
                potionContainer.appendChild(ingredientDiv);
            });
        }

        function addIngredient(index) {
            if (isBrewingAnimation) return;
            
            if (currentPotion.length < 6) {
                const ingredient = availableIngredients[index];
                currentPotion.push(ingredient);
                updatePotionDisplay();
                
                // Visual feedback
                const ingredientElement = document.querySelectorAll('.ingredient')[index];
                ingredientElement.classList.add('selected');
                setTimeout(() => {
                    ingredientElement.classList.remove('selected');
                }, 200);
            } else {
                updateWitchMessage("The cauldron is full! Brew the potion or clear it first.");
            }
        }

        function clearPotion() {
            if (isBrewingAnimation) return;
            
            currentPotion = [];
            updatePotionDisplay();
            updateWitchMessage("Cauldron cleared! Start brewing a fresh potion.");
        }

        function brewPotion() {
            if (isBrewingAnimation) return;
            
            if (currentPotion.length === 0) {
                updateWitchMessage("You can't brew an empty cauldron! Add some ingredients first.");
                return;
            }

            isBrewingAnimation = true;
            
            // Disable buttons
            document.getElementById('brew-btn').disabled = true;
            document.getElementById('clear-btn').disabled = true;
            
            // Show brewing overlay
            const brewingOverlay = document.getElementById('brewing-overlay');
            const brewingText = document.getElementById('brewing-text');
            brewingOverlay.classList.add('active');
            
            // Start smoke effect
            createSmokeEffect();
            
            // Animate brewing text
            const brewingTexts = [
                "Mixing magical ingredients...",
                "Adding mystical essence...",
                "Stirring the cauldron...",
                "Channeling ancient magic...",
                "Almost ready..."
            ];
            
            let textIndex = 0;
            const textInterval = setInterval(() => {
                if (textIndex < brewingTexts.length) {
                    brewingText.textContent = brewingTexts[textIndex];
                    textIndex++;
                }
            }, 800);
            
            // Continue generating smoke during brewing
            const smokeInterval = setInterval(() => {
                createSmokeEffect();
            }, 300);
            
            // After brewing animation (3.5 seconds)
            setTimeout(() => {
                clearInterval(textInterval);
                clearInterval(smokeInterval);
                
                if (checkPotionMatch()) {
                    // Correct potion - explosion effect!
                    brewingText.textContent = "Perfect! Creating magical explosion!";
                    createExplosionEffect();
                    
                    setTimeout(() => {
                        // Hide brewing overlay
                        brewingOverlay.classList.remove('active');
                        
                        // Success feedback
                        score += currentLevel * 100;
                        updateWitchMessage(witchMessages[Math.floor(Math.random() * 5)]);
                        showSuccessEffect();
                        
                        // Move to next level
                        setTimeout(() => {
                            currentLevel++;
                            if (currentLevel > 10) {
                                // Game won!
                                document.getElementById('final-score').textContent = score;
                                showScreen('congratulations');
                            } else {
                                generateLevel();
                                updateDisplay();
                            }
                            isBrewingAnimation = false;
                            document.getElementById('brew-btn').disabled = false;
                            document.getElementById('clear-btn').disabled = false;
                        }, 2000);
                    }, 1500);
                    
                } else {
                    // Wrong potion - no explosion, just smoke dissipates
                    brewingText.textContent = "Hmm... something's not right...";
                    
                    setTimeout(() => {
                        brewingOverlay.classList.remove('active');
                        
                        lives--;
                        updateWitchMessage(witchMessages[5 + Math.floor(Math.random() * 5)]);
                        showFailureEffect();
                        
                        if (lives <= 0) {
                            // Game over
                            setTimeout(() => {
                                document.getElementById('game-over-score').textContent = score;
                                showScreen('game-over');
                            }, 2000);
                        } else {
                            currentPotion = [];
                            updateDisplay();
                            isBrewingAnimation = false;
                            document.getElementById('brew-btn').disabled = false;
                            document.getElementById('clear-btn').disabled = false;
                        }
                    }, 1500);
                }
            }, 3500);
        }

        function checkPotionMatch() {
            if (currentPotion.length !== targetRecipe.length) {
                return false;
            }

            // Create copies for comparison
            const potionCopy = [...currentPotion];
            const recipeCopy = [...targetRecipe];

            // Check if all ingredients match (order doesn't matter)
            for (let i = 0; i < potionCopy.length; i++) {
                const potionIngredient = potionCopy[i];
                const recipeIndex = recipeCopy.findIndex(ing => ing.symbol === potionIngredient.symbol);
                
                if (recipeIndex === -1) {
                    return false;
                }
                
                recipeCopy.splice(recipeIndex, 1);
            }
            
            return recipeCopy.length === 0;
        }

        function updateWitchMessage(message) {
            document.getElementById('witch-text').textContent = message;
            document.getElementById('witch-text').classList.add('fade-in');
            setTimeout(() => {
                document.getElementById('witch-text').classList.remove('fade-in');
            }, 500);
        }

        function showSuccessEffect() {
            // Create success burst effect
            const cauldronElement = document.querySelector('.cauldron-icon');
            const burst = document.createElement('div');
            burst.className = 'success-burst';
            burst.textContent = '✨🎉✨';
            burst.style.position = 'absolute';
            burst.style.top = '50%';
            burst.style.left = '50%';
            burst.style.transform = 'translate(-50%, -50%)';
            
            cauldronElement.style.position = 'relative';
            cauldronElement.appendChild(burst);
            
            // Remove effect after animation
            setTimeout(() => {
                if (cauldronElement.contains(burst)) {
                    cauldronElement.removeChild(burst);
                }
            }, 1000);
            
            // Make cauldron glow temporarily
            cauldronElement.style.filter = 'drop-shadow(0 0 20px #4caf50)';
            setTimeout(() => {
                cauldronElement.style.filter = '';
            }, 2000);
        }

        function showFailureEffect() {
            // Shake the cauldron
            const cauldronElement = document.querySelector('.cauldron');
            cauldronElement.classList.add('failure-shake');
            
            setTimeout(() => {
                cauldronElement.classList.remove('failure-shake');
            }, 600);
            
            // Make cauldron red temporarily
            const cauldronIcon = document.querySelector('.cauldron-icon');
            cauldronIcon.style.filter = 'drop-shadow(0 0 20px #ff1744)';
            setTimeout(() => {
                cauldronIcon.style.filter = '';
            }, 1500);
        }

        // Handle window resize for Three.js
        window.addEventListener('resize', () => {
            if (renderer && camera) {
                const container = document.getElementById('three-container');
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });

        // Initialize the game
        updateDisplay();