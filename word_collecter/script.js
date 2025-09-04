class WordCollectorGame3D {
    constructor() {
        this.gameState = 'menu';
        this.playerPos = { lane: 1, y: 0, z: 0 }; // 0=left, 1=center, 2=right
        this.lives = 3;
        this.score = 0;
        this.wordsCompleted = 0;
        this.gameSpeed = 0.14;
        this.obstacles = [];
        this.letters = [];
        this.tunnelSegments = [];
        this.currentWord = '';
        this.collectedLetters = [];
        this.targetLetters = [];
        this.ageGroup = 5;
        this.isPaused = false;
        this.isJumping = false;
        this.isSliding = false;
        this.jumpHeight = 0;
        this.slideOffset = 0;
        this.runningAnimation = 0;
        this.trees = [];

        this.words_5_10 = ['CAT', 'DOG', 'SUN', 'MOON', 'TREE', 'FISH', 'BIRD', 'CAKE', 'BOOK', 'BALL', 'HOUSE', 'WATER', 'HAPPY', 'SMILE', 'PLAY', 'JUMP'];
        this.words_10_15 = ['PLANET', 'OCEAN', 'FOREST', 'PUZZLE', 'BRIDGE', 'CASTLE', 'DRAGON', 'MAGIC', 'WONDER', 'BRAVE', 'DREAM', 'QUEST', 'HERO', 'STORM'];

        this.lanes = [-2, 0, 2]; // x positions for 3 lanes

        this.setupEventListeners();
        this.init3D();
    }

 init3D() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x87ceeb, 10, 100); // Sky blue fog

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, 780 / 750, 0.1, 1000);
    this.camera.position.set(0, 2.5, 8);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameCanvas'),
        antialias: true
    });
    this.renderer.setSize(780, 750);
    this.renderer.setClearColor(0x87ceeb); // Sky blue
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4040ff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(30, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4caf50 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Add sky (large blue sphere above)
    const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.y = 40;
    this.scene.add(sky);

    // Add trees on left and right
    for (let z = -10; z > -200; z -= 10) {
        this.addTree(-7, z); // left side
        this.addTree(7, z);  // right side
    }

    // Create player
    this.createPlayer();

    // Create track segments (no tunnel)
    for (let i = 0; i < 50; i++) {
        this.createTrackSegment(i * -4);
    }

    // Start render loop
    this.animate();

    // Hide loading text
    document.getElementById('loadingText').style.display = 'none';
}

addTree(x, z) {
    // Randomize tree height and color
    const trunkHeight = 1 + Math.random() * 0.7;
    const leavesSize = 0.6 + Math.random() * 0.5;
    const leafColors = [0x228B22, 0x2ecc40, 0x27ae60, 0x16a085];
    const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, trunkHeight, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8d5524 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, -1.5 + trunkHeight / 2, z);
    trunk.castShadow = true;

    // Leaves (random shape: sphere or cone)
    let leaves;
    if (Math.random() > 0.5) {
        const leavesGeometry = new THREE.SphereGeometry(leavesSize, 12, 12);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: leafColor });
        leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    } else {
        const leavesGeometry = new THREE.ConeGeometry(leavesSize, leavesSize * 1.5, 12);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: leafColor });
        leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    }
    leaves.position.set(x, -1.5 + trunkHeight + leavesSize / 2, z);
    leaves.castShadow = true;

    this.scene.add(trunk);
    this.scene.add(leaves);

    // Store for movement
    this.trees.push({ trunk, leaves, x, z });
}

// Remove or comment out the tunnel creation in createTunnel()
// You can delete the tunnel mesh and tunnel lights part, but keep track segments creation if needed.
createTunnel() {
    // Only create track segments
    for (let i = 0; i < 50; i++) {
        this.createTrackSegment(i * -4);
    }
}



createPlayer() {
    this.playerGroup = new THREE.Group();

    // --- Cart ---
    const cartGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.2);
    const cartMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const cartBody = new THREE.Mesh(cartGeometry, cartMaterial);
    cartBody.position.y = 0.2;
    cartBody.castShadow = true;
    this.playerGroup.add(cartBody);

    // Cart wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(i * 0.35, 0.05, j * 0.5);
            this.playerGroup.add(wheel);
        }
    }

    // --- Sitting Person ---
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.35, 16);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x3498db });
    this.playerBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.playerBody.position.set(0, 0.55, 0.15);
    this.playerGroup.add(this.playerBody);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.16, 16, 16);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    this.playerHead = new THREE.Mesh(headGeometry, headMaterial);
    this.playerHead.position.set(0, 0.78, 0.15);
    this.playerGroup.add(this.playerHead);

    // Legs (bent, sitting)
    const legGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.22, 12);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
    this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    this.leftLeg.position.set(-0.09, 0.38, 0.38);
    this.leftLeg.rotation.x = Math.PI / 2.5;
    this.playerGroup.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    this.rightLeg.position.set(0.09, 0.38, 0.38);
    this.rightLeg.rotation.x = Math.PI / 2.5;
    this.playerGroup.add(this.rightLeg);

    // Arms (resting on lap)
    const armGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12);
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
    this.leftArm.position.set(-0.18, 0.62, 0.18);
    this.leftArm.rotation.z = Math.PI / 4;
    this.playerGroup.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
    this.rightArm.position.set(0.18, 0.62, 0.18);
    this.rightArm.rotation.z = -Math.PI / 4;
    this.playerGroup.add(this.rightArm);

    // Position the whole group
    // this.playerGroup.position.set(0, 0.5, 4);
    this.playerGroup.position.set(0, 0.1, 4); // Lower Y value brings player closer to track
    this.scene.add(this.playerGroup);
}


    // createTunnel() {
    //     const tunnelGeometry = new THREE.CylinderGeometry(8, 8, 200, 16, 1, true);
    //     const tunnelMaterial = new THREE.MeshLambertMaterial({
    //         color: 0x2a5298,
    //         side: THREE.BackSide
    //     });

    //     this.tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    //     this.tunnel.rotation.x = Math.PI / 2;
    //     this.tunnel.position.z = -50;
    //     this.tunnel.receiveShadow = true;
    //     this.scene.add(this.tunnel);

    //     // Add tunnel lights
    //     for (let i = 0; i < 20; i++) {
    //         const lightRing = new THREE.Group();

    //         for (let j = 0; j < 8; j++) {
    //             const angle = (j / 8) * Math.PI * 2;
    //             const lightGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    //             const lightMaterial = new THREE.MeshLambertMaterial({
    //                 color: 0x667eea,
    //                 emissive: 0x333377
    //             });
    //             const light = new THREE.Mesh(lightGeometry, lightMaterial);
    //             light.position.x = Math.cos(angle) * 7;
    //             light.position.y = Math.sin(angle) * 7;
    //             lightRing.add(light);
    //         }

    //         lightRing.position.z = i * -10;
    //         this.scene.add(lightRing);
    //     }

    //     // Create track segments
    //     for (let i = 0; i < 50; i++) {
    //         this.createTrackSegment(i * -4);
    //     }
    // }

    createTrackSegment(zPos) {
        const segmentGroup = new THREE.Group();

        // Main track with gradient colors
        const trackGeometry = new THREE.BoxGeometry(6, 0.1, 2);
        const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x764ba2 });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.position.y = -1.5;
        track.receiveShadow = true;
        segmentGroup.add(track);

        // Rails with metallic look
        for (let x of [-2.5, 2.5]) {
            const railGeometry = new THREE.BoxGeometry(0.2, 0.3, 2);
            const railMaterial = new THREE.MeshLambertMaterial({
                color: 0xcccccc,
                emissive: 0x111111
            });
            const rail = new THREE.Mesh(railGeometry, railMaterial);
            rail.position.set(x, -1.3, 0);
            rail.castShadow = true;
            segmentGroup.add(rail);
        }

        // Colorful lane dividers
        for (let x of [-1, 1]) {
            const dividerGeometry = new THREE.BoxGeometry(0.1, 0.05, 2);
            const dividerMaterial = new THREE.MeshLambertMaterial({
                color: 0xf093fb,
                emissive: 0x331133
            });
            const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
            divider.position.set(x, -1.4, 0);
            segmentGroup.add(divider);
        }

        segmentGroup.position.z = zPos;
        this.scene.add(segmentGroup);
        this.tunnelSegments.push(segmentGroup);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Touch/swipe controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (this.gameState !== 'playing') return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 30) this.movePlayer('right');
                else if (deltaX < -30) this.movePlayer('left');
            } else {
                if (deltaY < -30) this.jump();
                else if (deltaY > 30) this.slide();
            }
        });
    }

    handleKeyPress(e) {
        if (this.gameState !== 'playing') return;

        switch (e.key) {
            case 'ArrowLeft':
                this.movePlayer('left');
                break;
            case 'ArrowRight':
                this.movePlayer('right');
                break;
            case 'ArrowUp':
                this.jump();
                break;
            case 'ArrowDown':
                this.slide();
                break;
        }
    }

    movePlayer(direction) {
        if (direction === 'left' && this.playerPos.lane > 0) {
            this.playerPos.lane--;
        } else if (direction === 'right' && this.playerPos.lane < 2) {
            this.playerPos.lane++;
        }
        this.updatePlayerPosition();
    }

  // ...existing code...
jump() {
    if (this.isJumping || this.isSliding) return;
    this.isJumping = true;
    this.jumpHeight = 0;

    const jumpAnimation = () => {
        if (this.jumpHeight < Math.PI) {
            this.jumpHeight += 0.045; // Even smaller increment for longer, smoother jump
            this.playerGroup.position.y = 0.5 + Math.sin(this.jumpHeight) * 2.8; // Higher multiplier for longer jump
            requestAnimationFrame(jumpAnimation);
        } else {
            this.isJumping = false;
            this.jumpHeight = 0;
            this.playerGroup.position.y = 0.5;
        }
    };
    jumpAnimation();
}

    slide() {
        if (this.isJumping || this.isSliding) return;
        this.isSliding = true;

        // Scale player down and move lower
        this.playerGroup.scale.y = 0.5;
        this.playerGroup.position.y = 0.2;

        setTimeout(() => {
            this.isSliding = false;
            this.playerGroup.scale.y = 1;
            this.playerGroup.position.y = 0.5;
        }, 500);
    }

    updatePlayerPosition() {
        const targetX = this.lanes[this.playerPos.lane];
        this.playerGroup.position.x = targetX;
    }

    create3DObstacle(lane, zPos) {
        const obstacleGroup = new THREE.Group();

        // Main obstacle body with gradient color
        const obstacleGeometry = new THREE.BoxGeometry(1.5, 1.5, 1);
        const obstacleMaterial = new THREE.MeshLambertMaterial({
            color: 0xff4757,
            emissive: 0x330000
        });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.y = 0.25;
        obstacle.castShadow = true;
        obstacle.receiveShadow = true;
        obstacleGroup.add(obstacle);

        // Warning stripes with bright colors
        for (let i = 0; i < 3; i++) {
            const stripeGeometry = new THREE.BoxGeometry(1.6, 0.1, 1.1);
            const stripeMaterial = new THREE.MeshLambertMaterial({
                color: 0xffa502,
                emissive: 0x442200
            });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.y = 0.2 + (i * 0.3);
            obstacleGroup.add(stripe);
        }

        obstacleGroup.position.set(this.lanes[lane], -1, zPos);
        this.scene.add(obstacleGroup);

        return {
            lane: lane,
            z: zPos,
            mesh: obstacleGroup
        };
    }

 create3DLetter(lane, zPos, letter) {
    const letterGroup = new THREE.Group();

    // Draw the letter on a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    ctx.font = 'bold 110px Arial';
    ctx.fillStyle = '#FFD700'; // Gold color for the letter
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 64, 80);

    // Optionally add a white outline for visibility
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fff';
    ctx.strokeText(letter, 64, 80);

    // Create a plane with the letter texture
    const texture = new THREE.CanvasTexture(canvas);
    const textGeometry = new THREE.PlaneGeometry(0.9, 0.9);
  const textMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
});
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.y = 0.5;
    letterGroup.add(textMesh);

    // Animation data
    letterGroup.userData = {
        rotationSpeed: 0.07,
        floatOffset: Math.random() * Math.PI * 2
    };

    letterGroup.position.set(this.lanes[lane], 0, zPos);
    this.scene.add(letterGroup);

    return {
        lane: lane,
        z: zPos,
        letter: letter,
        mesh: letterGroup
    };
}

    startGame(ageGroup) {
        this.ageGroup = ageGroup;
        this.resetGame();
        this.generateNewWord();
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        this.gameState = 'playing';
    }

    resetGame() {
        this.lives = 3;
        this.score = 0;
        this.wordsCompleted = 0;
        this.gameSpeed = 0.14;
        this.obstacles = [];
        this.letters = [];
        this.collectedLetters = [];
        this.playerPos = { lane: 1, y: 0, z: 0 };
        this.updatePlayerPosition();
        this.updateUI();
        this.clearGameObjects();
    }

    generateNewWord() {
        const wordList = this.ageGroup <= 10 ? this.words_5_10 : this.words_10_15;
        this.currentWord = wordList[Math.floor(Math.random() * wordList.length)];
        this.targetLetters = [...this.currentWord];
        this.collectedLetters = [];
        document.getElementById('currentWord').textContent = this.currentWord;
        this.updateCollectedLetters();
    }

    updateCollectedLetters() {
        const container = document.getElementById('collectedLetters');
        container.innerHTML = '';

        for (let i = 0; i < this.currentWord.length; i++) {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'collected-letter';
            letterDiv.textContent = this.collectedLetters[i] || '_';
            container.appendChild(letterDiv);
        }
    }

    spawnObstacle() {
        // Reduce obstacle spawn rate significantly
        if (Math.random() < 0.008) {
            const lane = Math.floor(Math.random() * 3);
            const obstacle = this.create3DObstacle(lane, -60);
            this.obstacles.push(obstacle);
        }
    }

    spawnLetter() {
        // Increase letter spawn rate
        if (Math.random() < 0.012 && this.targetLetters.length > 0) {
            const lane = Math.floor(Math.random() * 3);
            const neededLetters = this.targetLetters.filter(letter =>
                !this.collectedLetters.includes(letter)
            );

            if (neededLetters.length === 0) return;

            const letterToSpawn = Math.random() < 0.7 ?
                neededLetters[0] :
                neededLetters[Math.floor(Math.random() * neededLetters.length)];

            const letter = this.create3DLetter(lane, -60, letterToSpawn);
            this.letters.push(letter);
        }
    }

    updateGame() {
        if (this.gameState !== 'playing' || this.isPaused) return;

        this.spawnObstacle();
        this.spawnLetter();
        this.moveObjects();
        this.checkCollisions();
        this.cleanupObjects();
        this.updateAnimations();
        // this.updateRunningAnimation();
        this.increaseSpeedByTime();
    }

    updateRunningAnimation() {
        // Animate running movement
        this.runningAnimation += 0.2;

        // Animate arms swinging
        this.leftArm.rotation.x = Math.sin(this.runningAnimation) * 0.5;
        this.rightArm.rotation.x = -Math.sin(this.runningAnimation) * 0.5;

        // Animate legs running
        this.leftLeg.rotation.x = Math.sin(this.runningAnimation + Math.PI) * 0.8;
        this.rightLeg.rotation.x = Math.sin(this.runningAnimation) * 0.8;

        // Slight body bob
        this.playerBody.position.y = 0.5 + Math.sin(this.runningAnimation * 2) * 0.05;
        this.playerHead.position.y = 1.0 + Math.sin(this.runningAnimation * 2) * 0.05;
    }

    moveObjects() {
        // Move tunnel segments
        this.tunnelSegments.forEach(segment => {
            segment.position.z += this.gameSpeed;
            if (segment.position.z > 20) {
                segment.position.z -= 200;
            }
        });

        // Move obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.z += this.gameSpeed;
            obstacle.mesh.position.z = obstacle.z;
        });

        // Move letters
        this.letters.forEach(letter => {
            letter.z += this.gameSpeed;
            letter.mesh.position.z = letter.z;
        });

         this.trees.forEach(tree => {
        tree.z += this.gameSpeed;
        tree.trunk.position.z = tree.z;
        tree.leaves.position.z = tree.z;

        // Recycle trees that pass the player
        if (tree.z > 15) {
            tree.z -= 200;
            tree.trunk.position.z = tree.z;
            tree.leaves.position.z = tree.z;
        }
    });
    }

   updateAnimations() {
    // Animate letters with floating only (no rotation)
    this.letters.forEach(letter => {
        letter.mesh.position.y = Math.sin(Date.now() * 0.005 + letter.mesh.userData.floatOffset) * 0.3 + 0.5;
    });

    // Animate obstacles with slight rotation
    this.obstacles.forEach(obstacle => {
        obstacle.mesh.rotation.y += 0.01;
    });

       this.trees.forEach(tree => {
        tree.leaves.rotation.y = Math.sin(Date.now() * 0.001 + tree.z) * 0.2;
    });
}

    checkCollisions() {
        const playerLane = this.playerPos.lane;
        const playerZ = 4;

        // Check obstacle collisions
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            if (obstacle && obstacle.lane === playerLane &&
                obstacle.z >= playerZ - 1 && obstacle.z <= playerZ + 1 &&
                !this.isJumping) {
                this.hitObstacle(i);
                break;
            }
        }

        // Check letter collections
        for (let i = this.letters.length - 1; i >= 0; i--) {
            const letter = this.letters[i];
            if (letter && letter.lane === playerLane &&
                letter.z >= playerZ - 1 && letter.z <= playerZ + 1) {
                this.collectLetter(i, letter.letter);
                break;
            }
        }
    }

    hitObstacle(index) {
        if (this.obstacles[index] && this.obstacles[index].mesh) {
            this.scene.remove(this.obstacles[index].mesh);
            this.obstacles.splice(index, 1);
            this.lives--;
            this.updateUI();

            // Flash effect with vibrant colors
            this.playerHead.material.color.setHex(0xff4757);
            this.playerBody.material.color.setHex(0xff4757);
            setTimeout(() => {
                this.playerHead.material.color.setHex(0xffdbac);
                this.playerBody.material.color.setHex(0x333333);
            }, 200);

            if (this.lives <= 0) {
                this.endGame();
            }
        }
    }

    collectLetter(index, letter) {
        if (this.letters[index] && this.letters[index].mesh) {
            this.scene.remove(this.letters[index].mesh);
            this.letters.splice(index, 1);

            // Check if this letter is needed
            const nextNeededIndex = this.collectedLetters.length;
            if (nextNeededIndex < this.currentWord.length &&
                this.currentWord[nextNeededIndex] === letter) {
                this.collectedLetters.push(letter);
                this.score += 10;
                this.updateCollectedLetters();
                this.updateUI();

                // Success effect - make player glow with rainbow colors
                this.playerBody.material.color.setHex(0x2ed573);
                this.playerHead.material.emissive.setHex(0x005500);
                setTimeout(() => {
                    this.playerBody.material.color.setHex(0x333333);
                    this.playerHead.material.emissive.setHex(0x000000);
                }, 300);

                // Check if word is complete
                if (this.collectedLetters.length === this.currentWord.length) {
                    this.completeWord();
                }
            }
        }
    }

    completeWord() {
        this.wordsCompleted++;
        this.score += 50;
        this.gameSpeed += 0.03;

        // Flash effect for word completion
        document.getElementById('currentWord').style.color = '#2ed573';

        // Make entire player flash with rainbow colors
        [this.playerHead, this.playerBody, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg].forEach((part, index) => {
            const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xF093FB, 0xFFD700];
            const originalColor = part.material.color.getHex();
            part.material.color.setHex(colors[index]);
            part.material.emissive.setHex(0x333333);
            setTimeout(() => {
                part.material.color.setHex(originalColor);
                part.material.emissive.setHex(0x000000);
            }, 1000);
        });

        setTimeout(() => {
            document.getElementById('currentWord').style.color = '#FFD700';
            this.generateNewWord();
        }, 1000);

        this.updateUI();
    }

    increaseSpeedByTime() {
    const now = Date.now();
    // Every 2 minutes (120,000 ms)
    if (now - this.lastSpeedIncrease >= 120000) {
        this.gameSpeed *= 1.05; // Increase by 5%
        this.gameSpeed = Math.min(this.gameSpeed, 0.8); // Cap at max speed
        this.lastSpeedIncrease = now;
    }
}

    increaseSpeed() {
        this.gameSpeed = Math.min(0.2 + (this.wordsCompleted * 0.03), 0.8);
    }

    cleanupObjects() {
        // Remove obstacles that are behind player
        this.obstacles = this.obstacles.filter(obstacle => {
            if (obstacle && obstacle.z > 15) {
                if (obstacle.mesh && obstacle.mesh.parent) {
                    this.scene.remove(obstacle.mesh);
                }
                return false;
            }
            return true;
        });

        // Remove letters that are behind player
        this.letters = this.letters.filter(letter => {
            if (letter && letter.z > 15) {
                if (letter.mesh && letter.mesh.parent) {
                    this.scene.remove(letter.mesh);
                }
                return false;
            }
            return true;
        });
    }

    clearGameObjects() {
        // Clear obstacles
        this.obstacles.forEach(obstacle => {
            if (obstacle && obstacle.mesh && obstacle.mesh.parent) {
                this.scene.remove(obstacle.mesh);
            }
        });
        this.obstacles = [];

        // Clear letters
        this.letters.forEach(letter => {
            if (letter && letter.mesh && letter.mesh.parent) {
                this.scene.remove(letter.mesh);
            }
        });
        this.letters = [];
    }

    updateUI() {
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('score').textContent = this.score;
        document.getElementById('wordsCompleted').textContent = this.wordsCompleted;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
    }

    endGame() {
        this.gameState = 'ended';
        this.clearGameObjects();
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalWords').textContent = this.wordsCompleted;
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('endScreen').classList.remove('hidden');
    }

    goHome() {
        this.gameState = 'menu';
        this.clearGameObjects();
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('endScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
    }

    restartGame() {
        this.startGame(this.ageGroup);
        document.getElementById('endScreen').classList.add('hidden');
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateGame();

        // Camera shake effect when hit (reduced)
        if (this.lives < 3) {
            this.camera.position.x += (Math.random() - 0.5) * 0.01;
            this.camera.position.y += (Math.random() - 0.5) * 0.01;
        }

        // Smooth camera follow
        this.camera.position.x += (this.playerGroup.position.x - this.camera.position.x) * 0.1;

        // Add some dynamic camera movement
        this.camera.position.y = 2.5 + Math.sin(Date.now() * 0.001) * 0.3;

        this.renderer.render(this.scene, this.camera);
    }
}

// Global functions for buttons
let game;

function startGame(ageGroup) {
    if (!game) game = new WordCollectorGame3D();
    game.startGame(ageGroup);
}

function togglePause() {
    if (game) game.togglePause();
}

function goHome() {
    if (game) game.goHome();
}

function restartGame() {
    if (game) game.restartGame();
}

// Initialize game
window.onload = () => {
    game = new WordCollectorGame3D();
};