  // Game State
        let scene, camera, renderer, controls;
        let world = {};
        let currentBlock = 'grass';
        let selectedSlot = 0;
        let player = {
            position: { x: 0, y: 10, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            onGround: false,
            speed: 0.1,
            jumpPower: 0.3
        };

        // Input handling
        let keys = {};
        let mouse = { x: 0, y: 0, sensitivity: 0.002 };
        let isPointerLocked = false;

        // Block types and colors
        const blockTypes = {
            grass: 0x7CFC00,
            stone: 0x808080,
            wood: 0x8B4513,
            sand: 0xF4A460,
            water: 0x1E90FF,
            lava: 0xFF4500
        };

        // Initialize game
        function init() {
            const canvas = document.getElementById('gameCanvas');
            
            // Scene setup
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.Fog(0x87CEEB, 0.1, 100);

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, 780 / 750, 0.1, 1000);
            camera.position.set(0, 10, 0);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
            renderer.setSize(780, 750);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);

            // Generate initial world
            generateWorld();

            // Setup controls
            setupControls();

            // Start game loop
            animate();
        }

        function generateWorld() {
            // Generate a simple terrain
            for (let x = -20; x <= 20; x++) {
                for (let z = -20; z <= 20; z++) {
                    const height = Math.floor(Math.sin(x * 0.1) * Math.cos(z * 0.1) * 3) + 2;
                    for (let y = 0; y <= height; y++) {
                        let blockType = 'stone';
                        if (y === height) blockType = 'grass';
                        if (y === 0) blockType = 'stone';
                        
                        placeBlock(x, y, z, blockType);
                    }
                }
            }

            // Add some trees
            for (let i = 0; i < 10; i++) {
                const x = Math.floor(Math.random() * 30) - 15;
                const z = Math.floor(Math.random() * 30) - 15;
                const height = getHighestBlock(x, z) + 1;
                
                // Tree trunk
                for (let y = height; y < height + 4; y++) {
                    placeBlock(x, y, z, 'wood');
                }
                
                // Tree leaves (simple)
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dz = -1; dz <= 1; dz++) {
                        placeBlock(x + dx, height + 4, z + dz, 'grass');
                        if (Math.random() > 0.3) {
                            placeBlock(x + dx, height + 5, z + dz, 'grass');
                        }
                    }
                }
            }
        }

        function placeBlock(x, y, z, type) {
            const key = `${x},${y},${z}`;
            if (world[key]) {
                scene.remove(world[key]);
            }

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshLambertMaterial({ color: blockTypes[type] });
            const block = new THREE.Mesh(geometry, material);
            
            block.position.set(x, y, z);
            block.castShadow = true;
            block.receiveShadow = true;
            block.userData = { type: type };
            
            scene.add(block);
            world[key] = block;
        }

        function removeBlock(x, y, z) {
            const key = `${x},${y},${z}`;
            if (world[key]) {
                scene.remove(world[key]);
                delete world[key];
            }
        }

        function getBlock(x, y, z) {
            const key = `${x},${y},${z}`;
            return world[key] || null;
        }

        function getHighestBlock(x, z) {
            for (let y = 50; y >= 0; y--) {
                if (getBlock(x, y, z)) return y;
            }
            return -1;
        }

        function setupControls() {
            const canvas = document.getElementById('gameCanvas');

            // Mouse controls
            canvas.addEventListener('click', () => {
                canvas.requestPointerLock();
            });

            document.addEventListener('pointerlockchange', () => {
                isPointerLocked = document.pointerLockElement === canvas;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isPointerLocked) return;

                mouse.x -= e.movementX * mouse.sensitivity;
                mouse.y -= e.movementY * mouse.sensitivity;
                mouse.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, mouse.y));

                camera.rotation.order = 'YXZ';
                camera.rotation.y = mouse.x;
                camera.rotation.x = mouse.y;
            });

            canvas.addEventListener('mousedown', (e) => {
                if (!isPointerLocked) return;

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera({ x: 0, y: 0 }, camera);
                
                const intersects = raycaster.intersectObjects(Object.values(world));
                
                if (intersects.length > 0) {
                    const intersection = intersects[0];
                    const block = intersection.object;
                    const pos = block.position;
                    
                    if (e.button === 0) { // Left click - mine
                        removeBlock(pos.x, pos.y, pos.z);
                    } else if (e.button === 2) { // Right click - place
                        const normal = intersection.face.normal;
                        const newPos = {
                            x: pos.x + normal.x,
                            y: pos.y + normal.y,
                            z: pos.z + normal.z
                        };
                        
                        // Don't place block where player is
                        const playerPos = camera.position;
                        const distance = Math.sqrt(
                            Math.pow(newPos.x - playerPos.x, 2) +
                            Math.pow(newPos.y - playerPos.y, 2) +
                            Math.pow(newPos.z - playerPos.z, 2)
                        );
                        
                        if (distance > 1.5) {
                            placeBlock(newPos.x, newPos.y, newPos.z, currentBlock);
                        }
                    }
                }
            });

            canvas.addEventListener('contextmenu', (e) => e.preventDefault());

            // Keyboard controls
            document.addEventListener('keydown', (e) => {
                keys[e.key.toLowerCase()] = true;

                // Number keys for block selection
                const num = parseInt(e.key);
                if (num >= 1 && num <= 6) {
                    selectBlock(num - 1);
                }
            });

            document.addEventListener('keyup', (e) => {
                keys[e.key.toLowerCase()] = false;
            });

            // Inventory selection
            document.querySelectorAll('.inventory-slot').forEach((slot, index) => {
                slot.addEventListener('click', () => selectBlock(index));
            });
        }

        function selectBlock(index) {
            document.querySelectorAll('.inventory-slot').forEach(slot => {
                slot.classList.remove('selected');
            });
            
            const slots = document.querySelectorAll('.inventory-slot');
            if (slots[index]) {
                slots[index].classList.add('selected');
                currentBlock = slots[index].dataset.block;
                selectedSlot = index;
            }
        }

        function updatePlayer() {
            const direction = new THREE.Vector3();
            const right = new THREE.Vector3();
            
            camera.getWorldDirection(direction);
            right.crossVectors(camera.up, direction).normalize();

            // Movement
            if (keys['w']) camera.position.add(direction.multiplyScalar(player.speed));
            if (keys['s']) camera.position.add(direction.multiplyScalar(-player.speed));
            if (keys['a']) camera.position.add(right.multiplyScalar(player.speed));
            if (keys['d']) camera.position.add(right.multiplyScalar(-player.speed));

            // Jumping
            if (keys[' '] && player.onGround) {
                player.velocity.y = player.jumpPower;
                player.onGround = false;
            }

            // Gravity
            player.velocity.y -= 0.01;
            camera.position.y += player.velocity.y;

            // Ground collision
            const groundY = getHighestBlock(
                Math.floor(camera.position.x), 
                Math.floor(camera.position.z)
            ) + 1.8;

            if (camera.position.y <= groundY) {
                camera.position.y = groundY;
                player.velocity.y = 0;
                player.onGround = true;
            }

            // Prevent falling through world
            if (camera.position.y < -10) {
                camera.position.set(0, 10, 0);
                player.velocity.y = 0;
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            if (isPointerLocked) {
                updatePlayer();
            }

            renderer.render(scene, camera);
        }

        // UI Functions
        function startGame() {
            document.getElementById('loadingScreen').style.display = 'flex';
            document.getElementById('startScreen').classList.add('hidden');

            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('gameCanvas').classList.remove('hidden');
                document.getElementById('gameUI').classList.remove('hidden');
                
                init();
            }, 2000);
        }

        function goHome() {
            // Reset game state
            if (renderer) {
                renderer.dispose();
            }
            
            document.getElementById('startScreen').classList.remove('hidden');
            document.getElementById('gameCanvas').classList.add('hidden');
            document.getElementById('gameUI').classList.add('hidden');
            
            // Clear world
            Object.values(world).forEach(block => scene.remove(block));
            world = {};
            
            // Exit pointer lock
            if (document.exitPointerLock) {
                document.exitPointerLock();
            }
        }

        function showInstructions() {
    openPopup("📖 How to Play", `
        <p>🖱️ <b>Mouse Controls:</b><br>
        • Click canvas to start playing<br>
        • Move mouse to look around<br>
        • Left click = Mine blocks<br>
        • Right click = Place blocks</p>

        <p>⌨️ <b>Keyboard Controls:</b><br>
        • W/A/S/D: Move<br>
        • SPACE: Jump<br>
        • 1-6: Select blocks</p>

        <p>💡 Tip: Press ESC to free your cursor!</p>
    `);
}

function showCredits() {
    openPopup("ℹ️ About", `
        <p>🌍 <b>CraftWorld 3D</b><br>
        A Minecraft-inspired voxel game built with:</p>
        <p>✔ Three.js for 3D graphics<br>
        ✔ HTML5 Canvas<br>
        ✔ JavaScript ES6</p>
        <p>Features: Mining, building, multiple blocks, procedural terrain, and more!</p>
    `);
}

// Popup controls
function openPopup(title, content) {
    document.getElementById("popupTitle").innerHTML = title;
    document.getElementById("popupContent").innerHTML = content;
    document.getElementById("popupOverlay").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("popupOverlay").classList.add("hidden");
}


//         function showInstructions() {
//             alert(`🎮 HOW TO PLAY CRAFTWORLD 3D:

// 🖱️ MOUSE CONTROLS:
// • Click canvas to start playing
// • Move mouse to look around
// • Left click to PLACE blocks
// • Right click to MINE blocks
// • Press ESC to free cursor for UI

// ⌨️ KEYBOARD CONTROLS:
// • W/A/S/D OR Arrow Keys: Move around
// • SPACE: Jump
// • 1-6: Select different blocks
// • ESC: Exit pointer lock

// 🏗️ BUILDING:
// • Select blocks from the inventory
// • Left-click to place blocks
// • Right-click to mine blocks
// • Build amazing structures!

// 💡 TIP: Press ESC to free your cursor so you can click the Home button!

// Have fun crafting! 🌍`);
//         }

//         function showCredits() {
//             alert(`🌍 CRAFTWORLD 3D

// A Minecraft-inspired voxel game built with:
// • Three.js for 3D graphics
// • HTML5 Canvas
// • JavaScript ES6

// Features:
// ✓ 3D voxel world
// ✓ Mining and building
// ✓ Multiple block types
// ✓ Physics simulation
// ✓ Procedural terrain
// ✓ First-person controls

// Enjoy your crafting adventure! 🎮`);
//         }