window.onload = function () {

    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    var audioplay = true;
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    var initialized = false;

    var level = {
        x: 4,
        y:55,
        width: 0,
        height: 0,
        columns: 15,
        rows: 14,
        tilewidth: 50,
        tileheight: 50,
        rowheight: 45,
        radius: 20,
        tiles: []
    };


    var Tile = function (x, y, type, shift) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.removed = false;
        this.shift = shift;
        this.velocity = 0;
        this.alpha = 1;
        this.processed = false;
    };


    var player = {
        x: 0,
        y: 0,
        angle: 0,
        tiletype: 0,
        bubble: {
            x: 0,
            y: 0,
            angle: 0,
            speed: 1000,
            dropspeed: 900,
            tiletype: 0,
            visible: false
        },
        nextbubble: {
            x: 0,
            y: 0,
            tiletype: 0
        }
    };


    var neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], // Even row tiles
    [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];  // Odd row tiles


    var bubblecolors = 7;


    var gamestates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, gameover: 4 };
    var gamestate = gamestates.init;


    var score = 0;

    var turncounter = 0;
    var rowoffset = 0;


    var animationstate = 0;
    var animationtime = 0;


    var showcluster = false;
    var cluster = [];
    var floatingclusters = [];


    var images = [];
    var bubbleimage;


    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;


    function loadImages(imagefiles) {

        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;


        var loadedimages = [];
        for (var i = 0; i < imagefiles.length; i++) {

            var image = new Image();


            image.onload = function () {
                loadcount++;
                if (loadcount == loadtotal) {

                    preloaded = true;
                }
            };


            image.src = imagefiles[i];


            loadedimages[i] = image;
        }

        // Return an array of images
        return loadedimages;
    }


    function init() {

        images = loadImages(["media/bubble-sprites.png"]);
        bubbleimage = images[0];

        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);

        // Initialize the two-dimensional tile array
        for (var i = 0; i < level.columns; i++) {
            level.tiles[i] = [];
            for (var j = 0; j < level.rows; j++) {
                // Define a tile type and a shift parameter for animation
                level.tiles[i][j] = new Tile(i, j, 0, 0);
            }
        }

        level.width = level.columns * level.tilewidth + level.tilewidth / 2;
        level.height = (level.rows - 1) * level.rowheight + level.tileheight;

        // Init the player
        player.x = level.x + level.width / 2 - level.tilewidth / 2;
        player.y = level.y + level.height;
        player.angle = 90;
        player.tiletype = 0;

        player.nextbubble.x = player.x - 2 * level.tilewidth;
        player.nextbubble.y = player.y;

        // New game
        newGame();

        // Enter main loop
        main(0);
    }

    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

        if (!initialized) {
            // Preloader

            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the frame
            drawFrame();

            // Draw a progress bar
            var loadpercentage = loadcount / loadtotal;
            context.strokeStyle = "#e7ecff";
            context.lineWidth = 3;
            context.strokeRect(18.5, 0.5 + canvas.height - 51, canvas.width - 37, 32);
            context.fillStyle = "#e7ecff";
            context.fillRect(18.5, 0.5 + canvas.height - 51, loadpercentage * (canvas.width - 37), 32);

            // Draw the progress text
            var loadtext = "Loaded " + loadcount + "/" + loadtotal + " images";
            context.fillStyle = "#e7ecff";
            context.font = "16px Verdana";
            context.fillText(loadtext, 18, 0.5 + canvas.height - 63);

            if (preloaded) {
                // Add a delay for demonstration purposes
                setTimeout(function () { initialized = true; }, 1000);
            }
        } else {
            // Update and render the game
            update(tframe);
            render();
            // console.log(context.canvas.width, context.canvas.height);
        }
    }


    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;


        updateFps(dt);

        if (gamestate == gamestates.ready) {

        } else if (gamestate == gamestates.shootbubble) {

            stateShootBubble(dt);
        } else if (gamestate == gamestates.removecluster) {

            stateRemoveCluster(dt);
        }
    }

    function setGameState(newgamestate) {
        gamestate = newgamestate;

        animationstate = 0;
        animationtime = 0;
    }

    function stateShootBubble(dt) {

        player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));
        player.bubble.y += dt * player.bubble.speed * -1 * Math.sin(degToRad(player.bubble.angle));


        if (player.bubble.x <= level.x) {

            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x;
        } else if (player.bubble.x + level.tilewidth >= level.x + level.width) {

            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x + level.width - level.tilewidth;
        }


        if (player.bubble.y <= level.y) {

            player.bubble.y = level.y;
            snapBubble();
            return;
        }


        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows; j++) {
                var tile = level.tiles[i][j];


                if (tile.type < 0) {
                    continue;
                }


                var coord = getTileCoordinate(i, j);
                if (circleIntersection(player.bubble.x + level.tilewidth / 2,
                    player.bubble.y + level.tileheight / 2,
                    level.radius,
                    coord.tilex + level.tilewidth / 2,
                    coord.tiley + level.tileheight / 2,
                    level.radius)) {

                    // Intersection with a level bubble
                    snapBubble();
                    return;
                }
            }
        }
    }

    function stateRemoveCluster(dt) {
        if (animationstate == 0) {
            resetRemoved();


            for (var i = 0; i < cluster.length; i++) {
                // Set the removed flag
                cluster[i].removed = true;
                if (audioplay == true) {  shotpop()};
            }


            score += cluster.length * 10;


            floatingclusters = findFloatingClusters();

            if (floatingclusters.length > 0) {

                for (var i = 0; i < floatingclusters.length; i++) {
                    for (var j = 0; j < floatingclusters[i].length; j++) {
                        var tile = floatingclusters[i][j];
                        tile.shift = 0;
                        tile.shift = 1;
                        tile.velocity = player.bubble.dropspeed;

                        score += 10;
                    }
                }
            }

            animationstate = 1;
        }

        if (animationstate == 1) {
            // Pop bubbles
            var tilesleft = false;
            for (var i = 0; i < cluster.length; i++) {
                var tile = cluster[i];

                if (tile.type >= 0) {
                    tilesleft = true;

                    // Alpha animation
                    tile.alpha -= dt * 15;
                    if (tile.alpha < 0) {
                        tile.alpha = 0;
                    }

                    if (tile.alpha == 0) {
                        tile.type = -1;
                        tile.alpha = 1;
                    }
                }
            }


            for (var i = 0; i < floatingclusters.length; i++) {
                for (var j = 0; j < floatingclusters[i].length; j++) {
                    var tile = floatingclusters[i][j];

                    if (tile.type >= 0) {
                        tilesleft = true;


                        tile.velocity += dt * 700;
                        tile.shift += dt * tile.velocity;


                        tile.alpha -= dt * 8;
                        if (tile.alpha < 0) {
                            tile.alpha = 0;
                        }


                        if (tile.alpha == 0 || (tile.y * level.rowheight + tile.shift > (level.rows - 1) * level.rowheight + level.tileheight)) {
                            tile.type = -1;
                            tile.shift = 0;
                            tile.alpha = 1;
                        }
                    }

                }
            }

            if (!tilesleft) {
                // if (audioplay == true) {
                //     shotpop();
                // }

                // Next bubble
                nextBubble();

                // Check for game over
                var tilefound = false
                for (var i = 0; i < level.columns; i++) {
                    for (var j = 0; j < level.rows; j++) {
                        if (level.tiles[i][j].type != -1) {
                            tilefound = true;
                            break;
                        }
                    }
                }
                
                if (tilefound) {
                    setGameState(gamestates.ready);
                   
                } else {
                    // No tiles left, game over
                    setGameState(gamestates.gameover);
                }
            }
        }
    }


    function snapBubble() {
        if (audioplay == true) {
            shotwrong();
        }

        var centerx = player.bubble.x + level.tilewidth / 2;
        var centery = player.bubble.y + level.tileheight / 2;
        var gridpos = getGridPosition(centerx, centery);


        if (gridpos.x < 0) {
            gridpos.x = 0;
        }

        if (gridpos.x >= level.columns) {
            gridpos.x = level.columns - 1;
        }

        if (gridpos.y < 0) {
            gridpos.y = 0;
        }

        if (gridpos.y >= level.rows) {
            gridpos.y = level.rows - 1;
        }


        var addtile = false;
        if (level.tiles[gridpos.x][gridpos.y].type != -1) {

            for (var newrow = gridpos.y + 1; newrow < level.rows; newrow++) {
                if (level.tiles[gridpos.x][newrow].type == -1) {
                    gridpos.y = newrow;
                    addtile = true;
                    break;
                }
            }
        } else {
            addtile = true;
        }


        if (addtile) {

            player.bubble.visible = false;


            level.tiles[gridpos.x][gridpos.y].type = player.bubble.tiletype;


            if (checkGameOver()) {
                return;
            }


            cluster = findCluster(gridpos.x, gridpos.y, true, true, false);

            if (cluster.length >= 3) {

                setGameState(gamestates.removecluster);
                return;
            }
        }


        turncounter++;
        if (turncounter >= 5) {
            // Add a row of bubbles
            addBubbles();
            turncounter = 0;
            rowoffset = (rowoffset + 1) % 2;

            if (checkGameOver()) {
                return;
            }
        }

        // Next bubble
        nextBubble();
        setGameState(gamestates.ready);
    }

    function checkGameOver() {

        for (var i = 0; i < level.columns; i++) {

            if (level.tiles[i][level.rows - 1].type != -1) {
                // Game over
                nextBubble();
                setGameState(gamestates.gameover);
                if (audioplay == true) {gameOversnd();}
                return true;
            }
        }

        return false;
    }

    function addBubbles() {

        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows - 1; j++) {
                level.tiles[i][level.rows - 1 - j].type = level.tiles[i][level.rows - 1 - j - 1].type;
            }
        }


        for (var i = 0; i < level.columns; i++) {

            level.tiles[i][0].type = getExistingColor();
        }
    }


    function findColors() {
        var foundcolors = [];
        var colortable = [];
        for (var i = 0; i < bubblecolors; i++) {
            colortable.push(false);
        }

        // Check all tiles
        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows; j++) {
                var tile = level.tiles[i][j];
                if (tile.type >= 0) {
                    if (!colortable[tile.type]) {
                        colortable[tile.type] = true;
                        foundcolors.push(tile.type);
                    }
                }
            }
        }

        return foundcolors;
    }


    function findCluster(tx, ty, matchtype, reset, skipremoved) {

        if (reset) {
            resetProcessed();
        }


        var targettile = level.tiles[tx][ty];


        var toprocess = [targettile];
        targettile.processed = true;
        var foundcluster = [];

        while (toprocess.length > 0) {

            var currenttile = toprocess.pop();


            if (currenttile.type == -1) {
                continue;
            }


            if (skipremoved && currenttile.removed) {
                continue;
            }


            if (!matchtype || (currenttile.type == targettile.type)) {

                foundcluster.push(currenttile);


                var neighbors = getNeighbors(currenttile);


                for (var i = 0; i < neighbors.length; i++) {
                    if (!neighbors[i].processed) {

                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
            }
        }

        // Return the found cluster
        return foundcluster;
    }

    // Find floating clusters
    function findFloatingClusters() {
        // Reset the processed flags
        resetProcessed();

        var foundclusters = [];

        // Check all tiles
        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows; j++) {
                var tile = level.tiles[i][j];
                if (!tile.processed) {
                    // Find all attached tiles
                    var foundcluster = findCluster(i, j, false, false, true);

                    // There must be a tile in the cluster
                    if (foundcluster.length <= 0) {
                        continue;
                    }

                    // Check if the cluster is floating
                    var floating = true;
                    for (var k = 0; k < foundcluster.length; k++) {
                        if (foundcluster[k].y == 0) {
                            // Tile is attached to the roof
                            floating = false;
                            break;
                        }
                    }

                    if (floating) {
                        // Found a floating cluster
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }

        return foundclusters;
    }

    // Reset the processed flags
    function resetProcessed() {
        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows; j++) {
                level.tiles[i][j].processed = false;
            }
        }
    }

    // Reset the removed flags
    function resetRemoved() {
        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows; j++) {
                level.tiles[i][j].removed = false;
            }
        }
    }

    // Get the neighbors of the specified tile
    function getNeighbors(tile) {
        var tilerow = (tile.y + rowoffset) % 2; // Even or odd row
        var neighbors = [];

        // Get the neighbor offsets for the specified tile
        var n = neighborsoffsets[tilerow];

        // Get the neighbors
        for (var i = 0; i < n.length; i++) {
            // Neighbor coordinate
            var nx = tile.x + n[i][0];
            var ny = tile.y + n[i][1];

            // Make sure the tile is valid
            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                neighbors.push(level.tiles[nx][ny]);
            }
        }

        return neighbors;
    }

    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate fps
            fps = Math.round(framecount / fpstime);

            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }

        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }

    // Draw text that is centered
    function drawCenterText(text, x, y, width) {
        var textdim = context.measureText(text);
        context.fillText(text, x + (width - textdim.width) / 2, y);
    }

    // Render the game
    function render() {
        // Draw the frame around the game
        drawFrame();

        var yoffset = level.tileheight / 2;

        // Draw level background
        context.fillStyle = "#e7ecff";
        context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 4 - yoffset);

        // Render tiles
        renderTiles();

        // Draw level bottom
        context.fillStyle = "#97adff";
        context.fillRect(level.x - 4, level.y - 4 + level.height + 4 - yoffset, level.width + 8, 2 * level.tileheight + 3);

        // Draw score
        // context.fillStyle = "#ffffff";
        // context.font = "18px Verdana";
        // var scorex = level.x + level.width - 150;
        // var scorey = level.y + level.height + level.tileheight - yoffset - 8;
        // drawCenterText("Score:", scorex, scorey, 150);
        // context.font = "24px Verdana";
        // drawCenterText(score, scorex, scorey + 30, 150);

        $("#scorevalue").html(score);

        // Render cluster
        if (showcluster) {
            renderCluster(cluster, 255, 128, 128);

            for (var i = 0; i < floatingclusters.length; i++) {
                var col = Math.floor(100 + 100 * i / floatingclusters.length);
                renderCluster(floatingclusters[i], col, col, col);
            }
        }


        // Render player bubble
        renderPlayer();
        // Game Over overlay
        if (gamestate == gamestates.gameover) {
            context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 2 * level.tileheight + 8 - yoffset);
            $("#instruction_1").show();
            context.fillStyle = "#ffffff";
            context.font = "24px Verdana";
            drawCenterText("Game Over!", level.x, level.y + level.height / 2 + 10, level.width);
            drawCenterText("Click to replay", level.x, level.y + level.height / 2 + 40, level.width);
            $("#restart").show();
        }
    }


    function drawFrame() {
        // Draw background
        context.fillStyle = "#e8eaec";
        context.fillRect(0, 0, canvas.width, canvas.height);


        context.fillStyle = "#97adff";
        context.fillRect(0, 0, canvas.width, 79);


        // context.fillStyle = "#ffffff";
        // context.font = "28px Verdana";
        // context.fillText("Bubble Shooter Game", 10, 37);



    }


    function renderTiles() {
        // Top to bottom
        for (var j = 0; j < level.rows; j++) {
            for (var i = 0; i < level.columns; i++) {
                // Get the tile
                var tile = level.tiles[i][j];

                // Get the shift of the tile for animation
                var shift = tile.shift;

                // Calculate the tile coordinates
                var coord = getTileCoordinate(i, j);

                // Check if there is a tile present
                if (tile.type >= 0) {
                    // Support transparency
                    context.save();
                    context.globalAlpha = tile.alpha;

                    // Draw the tile using the color
                    drawBubble(coord.tilex, coord.tiley + shift, tile.type);

                    context.restore();
                }
            }
        }
    }

    // Render cluster
    function renderCluster(cluster, r, g, b) {
        for (var i = 0; i < cluster.length; i++) {
            // Calculate the tile coordinates
            var coord = getTileCoordinate(cluster[i].x, cluster[i].y);

            // Draw the tile using the color
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            context.fillRect(coord.tilex + level.tilewidth / 4, coord.tiley + level.tileheight / 4, level.tilewidth / 2, level.tileheight / 2);
        }
    }

    // Render the player bubble
    function renderPlayer() {
        var centerx = player.x + level.tilewidth / 2;
        var centery = player.y + level.tileheight / 2;

        // Draw player background circle
        context.fillStyle = "#7a7a7a";
        context.beginPath();
        context.arc(centerx, centery, level.radius + 12, 0, 2 * Math.PI, false);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "#8c8c8c";
        context.stroke();

        // Draw the angle
        context.lineWidth = 2;
        context.strokeStyle = "#0000ff";
        context.beginPath();
        context.moveTo(centerx, centery);
        context.lineTo(centerx + 1.5 * level.tilewidth * Math.cos(degToRad(player.angle)), centery - 1.5 * level.tileheight * Math.sin(degToRad(player.angle)));
        context.stroke();

        var arrowSize = 10; // Adjust the arrowhead size as needed
        context.beginPath();
        context.moveTo(centerx + 1.5 * level.tilewidth * Math.cos(degToRad(player.angle)), centery - 1.5 * level.tileheight * Math.sin(degToRad(player.angle)));
        context.lineTo(
            centerx + 1.5 * level.tilewidth * Math.cos(degToRad(player.angle)) + arrowSize * Math.cos(degToRad(player.angle - 135)),
            centery - 1.5 * level.tileheight * Math.sin(degToRad(player.angle)) - arrowSize * Math.sin(degToRad(player.angle - 135))
        );
        context.lineTo(
            centerx + 1.5 * level.tilewidth * Math.cos(degToRad(player.angle)) + arrowSize * Math.cos(degToRad(player.angle + 135)),
            centery - 1.5 * level.tileheight * Math.sin(degToRad(player.angle)) - arrowSize * Math.sin(degToRad(player.angle + 135))
        );
        context.closePath();
        context.fillStyle = "#0000ff"; // Set arrowhead color
        context.fill();

        // Draw the next bubble
        drawBubble(player.nextbubble.x, player.nextbubble.y, player.nextbubble.tiletype);

        // Draw the bubble
        if (player.bubble.visible) {
            drawBubble(player.bubble.x, player.bubble.y, player.bubble.tiletype);
        }

    }

    // Get the tile coordinate
    function getTileCoordinate(column, row) {
        var tilex = level.x + column * level.tilewidth;

        // X offset for odd or even rows
        if ((row + rowoffset) % 2) {
            tilex += level.tilewidth / 2;
        }

        var tiley = level.y + row * level.rowheight;
        return { tilex: tilex, tiley: tiley };
    }

    // Get the closest grid position
    function getGridPosition(x, y) {
        var gridy = Math.floor((y - level.y) / level.rowheight);

        // Check for offset
        var xoffset = 0;
        if ((gridy + rowoffset) % 2) {
            xoffset = level.tilewidth / 2;
        }
        var gridx = Math.floor(((x - xoffset) - level.x) / level.tilewidth);

        return { x: gridx, y: gridy };
    }


    // Draw the bubble
    function drawBubble(x, y, index) {
        if (index < 0 || index >= bubblecolors)
            return;

        // Draw the bubble sprite
        context.drawImage(bubbleimage, index * 40, 0, 40, 40, x, y, level.tilewidth, level.tileheight);
    }

    // Start a new game
    function newGame() {
        $("#instruction_1").hide();
        $("#instruction").hide();
        $("#restart").hide();
        // Reset score
        score = 0;

        turncounter = 0;
        rowoffset = 0;

        // Set the gamestate to ready
        setGameState(gamestates.ready);

        // Create the level
        createLevel();

        // Init the next bubble and set the current bubble
        nextBubble();
        nextBubble();
    }

    // Create a random level
    function createLevel() {
        // Create a level with random tiles
        for (var j = 0; j < level.rows; j++) {
            var randomtile = randRange(0, bubblecolors - 1);
            var count = 0;
            for (var i = 0; i < level.columns; i++) {
                if (count >= 2) {
                    // Change the random tile
                    var newtile = randRange(0, bubblecolors - 1);

                    // Make sure the new tile is different from the previous tile
                    if (newtile == randomtile) {
                        newtile = (newtile + 1) % bubblecolors;
                    }
                    randomtile = newtile;
                    count = 0;
                }
                count++;

                if (j < level.rows / 2) {
                    level.tiles[i][j].type = randomtile;
                } else {
                    level.tiles[i][j].type = -1;
                }
            }
        }
    }

    // Create a random bubble for the player
    function nextBubble() {
        // Set the current bubble
        player.tiletype = player.nextbubble.tiletype;
        player.bubble.tiletype = player.nextbubble.tiletype;
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.visible = true;

        // Get a random type from the existing colors
        var nextcolor = getExistingColor();

        // Set the next bubble
        player.nextbubble.tiletype = nextcolor;
    }

    // Get a random existing color
    function getExistingColor() {
        existingcolors = findColors();

        var bubbletype = 0;
        if (existingcolors.length > 0) {
            bubbletype = existingcolors[randRange(0, existingcolors.length - 1)];
        }

        return bubbletype;
    }

    // Get a random int between low and high, inclusive
    function randRange(low, high) {
        return Math.floor(low + Math.random() * (high - low + 1));
    }

    // Shoot the bubble
    function shootBubble() {
        // Shoot the bubble in the direction of the mouse
        player.bubble.x = player.x;
        player.bubble.y = player.y ;
        player.bubble.angle = player.angle;
        player.bubble.tiletype = player.tiletype;

        // Set the gamestate
        setGameState(gamestates.shootbubble);
    }

    // Check if two circles intersect
    function circleIntersection(x1, y1, r1, x2, y2, r2) {
        // Calculate the distance between the centers
        var dx = x1 - x2;
        var dy = y1 - y2;
        var len = Math.sqrt(dx * dx + dy * dy);

        if (len < r1 + r2) {
            // Circles intersect
            return true;
        }

        return false;
    }

    // Convert radians to degrees
    function radToDeg(angle) {
        return angle * (180 / Math.PI);
    }

    // Convert degrees to radians
    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    // On mouse movement
    function onMouseMove(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);

        // Get the mouse angle
        var mouseangle = radToDeg(Math.atan2((player.y + level.tileheight / 2) - pos.y, pos.x - (player.x + level.tilewidth / 2)));

        // Convert range to 0, 360 degrees
        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }

        // Restrict angle to 8, 172 degrees
        var lbound = 8;
        var ubound = 172;
        if (mouseangle > 90 && mouseangle < 270) {
            // Left
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        } else {
            // Right
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }

        // Set the player angle
        player.angle = mouseangle;
    }

    // On mouse button click
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);

        if (gamestate == gamestates.ready) {
            shootBubble();
            if (audioplay == true) {
                shot();
            }

        } else if (gamestate == gamestates.gameover) {

        }
    }

    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    $("#replay").bind("click", function () {
        newGame();
        if (audioplay == true) { clickbtn()};
    })
    $("#restart").bind("click", function () {
        newGame();
        if (audioplay == true) { clickbtn()};
    })
    $("#playbutton").bind("click", function () {
        $("#instruction").hide();
        if (audioplay == true) { clickbtn()};
    })
    $("#instructionbtn").bind("click", function () {
        $("#instruction").show();
        if (audioplay == true) { clickbtn()};
    })

    $("#play_audio").bind("click", playbgm);
    $("#pause_audio").bind("click", pausebgm);

    var objshot = document.createElement("audio");
    objshot.src = "media/audio/canon_woosh.mp3";

    var objshotwrong = document.createElement("audio");
    objshotwrong.src = "media/audio/bubble_hit.mp3";

    var objshotpop = document.createElement("audio");
    objshotpop.src = "media/audio/bubble_pop.mp3";


    var clicktitle = document.createElement("audio");
    clicktitle.src = "media/audio/click_title.mp3";
    var gmover = document.createElement("audio");
    gmover.src = "media/audio/gameover.mp3";

    function playbgm() {
        audioplay = true;
    }
    function pausebgm() {
        audioplay = false;
    }
    
function clickbtn(){
stopall();
clicktitle.play();
}
function gameOversnd(){
stopall();
gmover.play();
}

    function shot() {
        stopall();
        objshot.play();
    }
    function shotwrong() {
        stopall();
        objshotwrong.play();
    }
    function shotpop() {
        // stopall();
        objshotpop.play();
    }

    function stopall() {
        objshot.pause();
        objshotwrong.pause();
        objshotpop.pause();
        clicktitle.pause();
        gmover.pause();
        objshot.currentTime = 0;
        objshotwrong.currentTime = 0;
        objshotpop.currentTime = 0;
        clicktitle.currentTime = 0;
        gmover.currentTime = 0;

    }

    // Call init to start the game
    init();

    var w_width;
    var h_height;

    function scaleStage() {

        var isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        if (isMobile.any()) {

            var wdt = screen.width;
            var hgt = screen.height;
            if (hgt > wdt) {
                w_width = 780;
                h_height = 750;

                $("#wrapper").removeClass("wrapper_m2").addClass("wrapper_m1");
                $("#viewport").removeClass("viewport_m2").addClass("viewport_m1");
                $("#score").removeClass("score_m2").addClass("score_m1");
                $("#scorevalue").removeClass("scorevalue_m2").addClass("scorevalue_m1");
                $("#replay").removeClass("replay_m2").addClass("replay_m1");
                $("#restart").removeClass("restart_m2").addClass("restart_m1");
                $("#logo").removeClass("logo_m2").addClass("logo_m1");
                $("#instruction").removeClass("instruction_m2").addClass("instruction_m1");
                $("#instruction_1").removeClass("instruction_1_m2").addClass("instruction_1_m1");
                $("#text").removeClass("text_m2").addClass("text_m1");
                $("#playbutton").removeClass("playbutton_m2").addClass("playbutton_m1");
                $("#instructionbtn").removeClass("instructionbtn_m2").addClass("instructionbtn_m1");
                $("#play_audio").removeClass("play_audio_m2").addClass("play_audio_m1");
                $("#pause_audio").removeClass("pause_audio_m2").addClass("pause_audio_m1");



            } else {
                w_width = 780;
                h_height = 750;

                $("#wrapper").removeClass("wrapper_m1").addClass("wrapper_m2");
                $("#viewport").removeClass("viewport_m1").addClass("viewport_m2");
                $("#score").removeClass("score_m1").addClass("score_m2");
                $("#scorevalue").removeClass("scorevalue_m1").addClass("scorevalue_m2");
                $("#replay").removeClass("replay_m1").addClass("replay_m2");
                $("#restart").removeClass("restart_m1").addClass("restart_m2");
                $("#logo").removeClass("logo_m1").addClass("logo_m2");
                $("#instruction").removeClass("instruction_m1").addClass("instruction_m2");
                $("#instruction_1").removeClass("instruction_1_m1").addClass("instruction_1_m2");
                $("#text").removeClass("text_m1").addClass("text_m2");
                $("#playbutton").removeClass("playbutton_m1").addClass("playbutton_m2");
                $("#instructionbtn").removeClass("instructionbtn_m1").addClass("instructionbtn_m2");
                $("#play_audio").removeClass("play_audio_m1").addClass("play_audio_m2");
                $("#pause_audio").removeClass("pause_audio_m1").addClass("pause_audio_m2");


            }

        } else {
            w_width = 780;
            h_height = 750;

            $("#wrapper").removeClass("wrapper_m2").removeClass("wrapper_m1");
            $("#viewport").removeClass("viewport_m2").removeClass("viewport_m1");
            $("#score").removeClass("score_m2").removeClass("score_m1");
            $("#scorevalue").removeClass("scorevalue_m2").removeClass("scorevalue_m1");
            $("#replay").removeClass("replay_m2").removeClass("replay_m1");
            $("#restart").removeClass("restart_m2").removeClass("restart_m1");
            $("#logo").removeClass("logo_m2").removeClass("logo_m1");
            $("#instruction").removeClass("instruction_m2").removeClass("instruction_m1");
            $("#instruction_1").removeClass("instruction_1_m2").removeClass("instruction_1_m1");
            $("#text").removeClass("text_m2").removeClass("text_m1");
            $("#playbutton").removeClass("playbutton_m2").removeClass("playbutton_m1");
            $("#instructionbtn").removeClass("instructionbtn_m2").removeClass("instructionbtn_m1");
            $("#play_audio").removeClass("play_audio_m2").removeClass("play_audio_m1");
            $("#pause_audio").removeClass("pause_audio_m2").removeClass("pause_audio_m1");
        }




        var scale = {
            x: 1,
            y: 1
        },
            zoomFactor = 1,
            stageLeft = 0,
            config = {
                'stageWidth': w_width,
                'stageHeight': h_height
            };

        var rootElem = document.getElementById("wrapper");
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

        let newHeight = Number(newScale.split(',')[0]) * config['stageHeight'];
        let TopPos = (window.innerHeight - newHeight) / 2;


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
            'top': TopPos + 'px',
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

    $(window).on("orientationchange", function (event) {
        scaleStage();
    });
    $(window).orientationchange();
    window.addEventListener("resize", scaleStage);
};
