const canvas = document.getElementById('spaceCanvas');
        const ctx = canvas.getContext('2d');
        
        let gameState = {
            objects: [],
            isSimulating: false,
            sun: null,
            orbits: [],
            planets: [],
            stars: []
        };
        
        let history = [];
        let historyIndex = -1;
        
        function saveState() {
            if (gameState.isSimulating) return;
            
            historyIndex++;
            history = history.slice(0, historyIndex);
            
            // Create a deep copy without circular references
            const stateCopy = {
                objects: gameState.objects.map(obj => {
                    const copy = { ...obj };
                    // Remove circular references
                    if (copy.orbit) {
                        copy.orbitId = copy.orbit.x + '_' + copy.orbit.y + '_' + copy.orbit.radius;
                        delete copy.orbit;
                    }
                    if (copy.planet) {
                        delete copy.planet;
                    }
                    return copy;
                }),
                isSimulating: gameState.isSimulating,
                sun: gameState.sun ? { ...gameState.sun } : null,
                orbits: gameState.orbits.map(orbit => ({ 
                    ...orbit, 
                    planet: null // Remove circular reference
                })),
                planets: gameState.planets.map(planet => {
                    const copy = { ...planet };
                    if (copy.orbit) {
                        copy.orbitId = copy.orbit.x + '_' + copy.orbit.y + '_' + copy.orbit.radius;
                        delete copy.orbit;
                    }
                    return copy;
                }),
                stars: [...gameState.stars]
            };
            
            history.push(stateCopy);
            
            if (history.length > 50) {
                history.shift();
                historyIndex--;
            }
            
            updateUndoRedoButtons();
        }
        
        function undo() {
            if (historyIndex > 0) {
                historyIndex--;
                restoreState(history[historyIndex]);
                updateUndoRedoButtons();
                draw();
            }
        }
        
        function redo() {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                restoreState(history[historyIndex]);
                updateUndoRedoButtons();
                draw();
            }
        }
        
        function restoreState(savedState) {
            gameState = {
                objects: [...savedState.objects],
                isSimulating: savedState.isSimulating,
                sun: savedState.sun,
                orbits: [...savedState.orbits],
                planets: [...savedState.planets],
                stars: [...savedState.stars]
            };
            
            // Restore circular references
            gameState.orbits.forEach(orbit => {
                const planet = gameState.planets.find(p => p.orbitId === (orbit.x + '_' + orbit.y + '_' + orbit.radius));
                if (planet) {
                    orbit.planet = planet;
                    orbit.hasPlanet = true;
                    planet.orbit = orbit;
                    delete planet.orbitId;
                } else {
                    orbit.hasPlanet = false;
                    orbit.planet = null;
                }
            });
            
            updateObjectArrays();
        }
        
        
        function togglePanel() {
            const controlPanel = document.getElementById('controlPanel');
            const toggleBtn = document.getElementById('toggleBtn');
            
            if (controlPanel.classList.contains('minimized')) {
                controlPanel.classList.remove('minimized');
                toggleBtn.innerHTML = '−';
                toggleBtn.title = 'Minimize Panel';
            } else {
                controlPanel.classList.add('minimized');
                toggleBtn.innerHTML = '+';
                toggleBtn.title = 'Maximize Panel';
            }
        }
        
        function updateUndoRedoButtons() {
            document.getElementById('undoBtn').disabled = historyIndex <= 0 || gameState.isSimulating;
            document.getElementById('redoBtn').disabled = historyIndex >= history.length - 1 || gameState.isSimulating;
        }
        
        function updateObjectArrays() {
            gameState.sun = gameState.objects.find(obj => obj.type === 'sun') || null;
            gameState.orbits = gameState.objects.filter(obj => obj.type === 'orbit');
            gameState.planets = gameState.objects.filter(obj => obj.type === 'planet');
            gameState.stars = gameState.objects.filter(obj => obj.type === 'star');
        }
        
        function updateControls() {
            const objectType = document.getElementById('objectType').value;
            const speedControl = document.getElementById('speedControl');
            const sizeControl = document.getElementById('sizeControl');
            const addBtn = document.getElementById('addBtn');
            
            if (objectType === 'planet') {
                speedControl.style.display = 'block';
                sizeControl.style.display = 'block';
            } else if (objectType === 'orbit') {
                speedControl.style.display = 'none';
                sizeControl.style.display = 'block';
            } else {
                speedControl.style.display = 'none';
                sizeControl.style.display = 'block';
            }
            
            // Disable add button if trying to add sun when one exists
            if (objectType === 'sun' && gameState.sun) {
                addBtn.disabled = true;
                addBtn.textContent = 'Sun Already Added';
            } else {
                addBtn.disabled = false;
                addBtn.textContent = 'Add Object';
            }
        }
        
        function updateSizeValue() {
            document.getElementById('sizeValue').textContent = document.getElementById('sizeSlider').value;
        }
        
        function updateSpeedValue() {
            document.getElementById('speedValue').textContent = document.getElementById('speedSlider').value;
        }
        
        canvas.addEventListener('click', function(event) {
            if (gameState.isSimulating) return;
            
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            
            addObjectAt(x, y);
        });
        
        function addObject() {
            // Add at center for button click
            addObjectAt(canvas.width / 2, canvas.height / 2);
        }
        
        function addObjectAt(x, y) {
            if (gameState.isSimulating) return;
            
            const objectType = document.getElementById('objectType').value;
            const size = parseInt(document.getElementById('sizeSlider').value);
            const speed = parseFloat(document.getElementById('speedSlider').value);
            
            if (objectType === 'sun' && gameState.sun) {
                alert('Only one sun allowed!');
                return;
            }
            
            if (objectType === 'planet') {
                // Check if clicked on an orbit
                let targetOrbit = null;
                for (let orbit of gameState.orbits) {
                    const distance = Math.sqrt((x - orbit.x) ** 2 + (y - orbit.y) ** 2);
                    if (Math.abs(distance - orbit.radius) < 20) {
                        if (!orbit.hasPlanet) {
                            targetOrbit = orbit;
                            break;
                        } else {
                            alert('This orbit already has a planet!');
                            return;
                        }
                    }
                }
                
                if (!targetOrbit) {
                    alert('Click on an orbit to place a planet!');
                    return;
                }
                
                const angle = Math.atan2(y - targetOrbit.y, x - targetOrbit.x);
                const planetX = targetOrbit.x + Math.cos(angle) * targetOrbit.radius;
                const planetY = targetOrbit.y + Math.sin(angle) * targetOrbit.radius;
                
                const planet = {
                    type: 'planet',
                    x: planetX,
                    y: planetY,
                    size: size,
                    speed: speed,
                    angle: angle,
                    orbit: targetOrbit,
                    color: getRandomColor()
                };
                
                targetOrbit.hasPlanet = true;
                targetOrbit.planet = planet;
                gameState.objects.push(planet);
                gameState.planets.push(planet);
            } else if (objectType === 'orbit') {
                if (!gameState.sun) {
                    alert('Add a sun first!');
                    return;
                }
                
                const radius = Math.sqrt((x - gameState.sun.x) ** 2 + (y - gameState.sun.y) ** 2);
                if (radius < gameState.sun.size + 20) {
                    alert('Orbit too close to sun!');
                    return;
                }
                
                const orbit = {
                    type: 'orbit',
                    x: gameState.sun.x,
                    y: gameState.sun.y,
                    radius: radius,
                    size: 2,
                    hasPlanet: false,
                    planet: null
                };
                
                gameState.objects.push(orbit);
                gameState.orbits.push(orbit);
            } else {
                const obj = {
                    type: objectType,
                    x: x,
                    y: y,
                    size: size,
                    color: objectType === 'sun' ? '#FFD700' : getRandomColor()
                };
                
                gameState.objects.push(obj);
                
                if (objectType === 'sun') {
                    gameState.sun = obj;
                } else if (objectType === 'star') {
                    gameState.stars.push(obj);
                }
            }
            
            saveState();
            updateControls();
            draw();
        }
        
        function getRandomColor() {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function startSimulation() {
            if (gameState.objects.length === 0) {
                alert('Add some objects first!');
                return;
            }
            
            gameState.isSimulating = true;
            
            // Hide building controls
            document.getElementById('addBtn').style.display = 'none';
            document.getElementById('submitBtn').style.display = 'none';
            document.getElementById('undoBtn').disabled = true;
            document.getElementById('redoBtn').disabled = true;
            document.getElementById('restartBtn').style.display = 'block';
            
            // Update status
            document.getElementById('status').className = 'status running';
            document.getElementById('status').textContent = 'Simulation Running';
            
            animate();
        }
        
        function animate() {
            if (!gameState.isSimulating) return;
            
            // Update planet positions
            for (let planet of gameState.planets) {
                if (planet.orbit) {
                    planet.angle += planet.speed * 0.01;
                    planet.x = planet.orbit.x + Math.cos(planet.angle) * planet.orbit.radius;
                    planet.y = planet.orbit.y + Math.sin(planet.angle) * planet.orbit.radius;
                }
            }
            
            draw();
            requestAnimationFrame(animate);
        }
        
        function restart() {
            gameState = {
                objects: [],
                isSimulating: false,
                sun: null,
                orbits: [],
                planets: [],
                stars: []
            };
            
            history = [];
            historyIndex = -1;
            saveState();
            
            // Show building controls
            document.getElementById('addBtn').style.display = 'block';
            document.getElementById('submitBtn').style.display = 'block';
            document.getElementById('restartBtn').style.display = 'none';
            
            // Update status
            document.getElementById('status').className = 'status building';
            document.getElementById('status').textContent = 'Building Mode - Click to add objects';
            
            updateControls();
            updateUndoRedoButtons();
            draw();
        }
        
        let zoom = 1;
const minZoom = 0.5;
const maxZoom = 2.5;
const zoomStep = 0.1;

// Pan variables
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

// Zoom functionality for canvas drawing
document.getElementById('zoomInBtn').addEventListener('click', function () {
    zoom = Math.min(maxZoom, zoom + zoomStep);
    draw();
});

document.getElementById('zoomOutBtn').addEventListener('click', function () {
    zoom = Math.max(minZoom, zoom - zoomStep);
    draw();
});

// Drag (pan) functionality
canvas.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.style.cursor = 'grab';
});

window.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    panX += (e.clientX - dragStartX) / zoom;
    panY += (e.clientY - dragStartY) / zoom;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    draw();
});

window.addEventListener('mouseup', function() {
    isDragging = false;
    canvas.style.cursor = 'default';
});

// Update draw function to use zoom and pan
function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan, center on canvas
    ctx.setTransform(
        zoom, 0, 0, zoom,
        canvas.width / 2 * (1 - zoom) + panX * zoom,
        canvas.height / 2 * (1 - zoom) + panY * zoom
    );

    // Draw stars in background
    drawStarField();

    // Draw orbits first (behind other objects)
    for (let orbit of gameState.orbits) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(orbit.x, orbit.y, orbit.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw sun
    if (gameState.sun) {
        const sun = gameState.sun;
        const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.size);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF4500');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Sun glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    // Draw planets
    for (let planet of gameState.planets) {
        const gradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.size);
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(1, darkenColor(planet.color, 0.3));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw stars
    for (let star of gameState.stars) {
        drawStar(star.x, star.y, star.size / 3, star.color);
    }
}

function drawStarField() {
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawStar(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5;
        const xPos = x + Math.cos(angle) * size;
        const yPos = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

function darkenColor(color, amount) {
    const num = parseInt(color.slice(1), 16);
    const R = (num >> 16) * (1 - amount);
    const G = (num >> 8 & 0x00FF) * (1 - amount);
    const B = (num & 0x0000FF) * (1 - amount);
    return `rgb(${Math.floor(R)}, ${Math.floor(G)}, ${Math.floor(B)})`;
}
        
        // Initialize
        saveState();
        updateControls();
        updateUndoRedoButtons();
        draw();
        
        // 3. Toggle controls visibility
function toggleControls() {
    const controls = document.getElementById('controlsSection');
    // Only hide controls, keep h1 and toggle visible
    if (controls.classList.contains('hidden')) {
        controls.classList.remove('hidden');
    } else {
        controls.classList.add('hidden');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".toggle");
    const controlsInner = document.getElementById("controlsInner");

    toggleBtn.addEventListener("click", function () {
        controlsInner.classList.toggle("hidden");
    });
});