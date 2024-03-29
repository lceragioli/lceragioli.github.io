var game = null;

function Game() {

    /*  state constant  */
    var PLAY = 0; 
    var PAUSE = 1; 
    var MENU = 2;
    var TRANSITION = 3;
    var WIN = 4;

    var div = null;
    var resourceHandler = null;
    var inputHandler = null;
    var state = null;
    var player = null;
    var gameObjects = [];

    var canvas = null;
    var ctx = null;
    var scale = 0;
    var actualLevel = null;
    var actualStage = null;
    var music = null;
    var invalidatedScene = true;
    var count = 0;
    var checkPoint = {stage: null, x: 0, y: 0, z: 0};


    div = document.getElementById("gameDiv");    
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    if(!ctx){
         alert("Il tuo browser non supporta HTML5, aggiornalo!");
    }        
    div.style.width = "1024px";
    div.style.height = "600px"
    canvas.setAttribute("width","1024");
    canvas.setAttribute("height","600");
    canvas.defaultWidth = canvas.width;
    canvas.defaultHeight = canvas.height;
    canvas.style.cursor = "none";
    canvas.isFullscreen = false;

    /*  Problemi scala dimensione canvas    */
    //ctx.imageSmoothingEnabled = false;
    //ctx.webkitImageSmoothingEnabled = false;
    //ctx.mozImageSmoothingEnabled = false;

    resourceHandler = new ResourceHandler(canvas, ctx, start);
    inputHandler = new input.InputHandler(this);
    scale = Math.ceil(Math.max(stage.totalWidth/canvas.width, stage.totalHeight/canvas.height));

    this.win = function() {
        state = WIN;
        music.pause();
        music = audio.getSounds().ending.audio;
        music.loop = false;
        music.play();        
    };

    this.getCanvas = function() {
        return canvas;
    };

    this.getContext = function() {
        return ctx;
    };

    this.getScale = function() {
        return scale;
    };

    this.getStage = function() {
        return actualStage;
    };

    this.getPlayer = function() {
        return player;
    };

    this.getGameObjects = function() {
        return gameObjects;
    };

    this.pauseMusic = function() {
        music.pause();
    }
    
    this.getHitObj = function(obj) {

        if(obj.name != player.name && player.inside(obj)) {
            return player;
        }
        for(var i = gameObjects.length - 1; i >= 0 ; i--) {
            if(gameObjects[i] != obj && gameObjects[i].solid && gameObjects[i].inside(obj)) {
                return gameObjects[i];
            }
        }
    };

    this.restoreCheckpoint = function() {
        loadStage(checkPoint.stage);
        music.load();
        music.loop = true;
        music.play();        
        player.moveTo(checkPoint.x, checkPoint.y, checkPoint.z);
    };

    this.load = function() {

        /*  Tiles Loading  */
        resourceHandler.loadTiles();

        /*  Sprites Loading  */
        resourceHandler.loadSprites();

        /*  Sound Loading  */
        resourceHandler.loadAudio();
    };

    function start() {

        /*  Levels Loading  */
        resourceHandler.loadLevels();

        /*  Stages Loading  */
        resourceHandler.loadStages();

        state = MENU;

        music = audio.getSounds().menu.audio;
        music.load();        
        music.loop = true;
        music.play();

        window.requestAnimFrame(gameLoop);
    };

    this.loadLevel = loadLevel;

    function loadLevel(newLevel) {
        music.pause();
        actualLevel = newLevel;
        music = actualLevel.music.audio;
        music.load();
        music.loop = true;
        music.play();
    };

    this.loadStage = loadStage;

    function loadStage(newStage) {

        if(actualLevel == null || newStage.level.name != actualLevel.name) {
            loadLevel(newStage.level);
            checkPoint.stage = newStage;
            checkPoint.x = player.x;
            checkPoint.y = player.y;
            checkPoint.z = player.z;
        }
        actualStage = newStage;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameObjects = newStage.gameObjects.slice();

        for(var i = 0; i < gameObjects.length; i++) {
            gameObjects[i].reset();
        }
        player.semiReset();
        invalidatedScene = true;
        state = TRANSITION;
    };

    function gameLoop() {
            
        update();
 
        draw();
       
        /*  Set action for next loop iteration  */
        window.requestAnimFrame(gameLoop);
    };

    function update() {

        if(inputHandler.getKeyPress("P")) {
            setFullscreen();
        }
        if(inputHandler.getKeyPress(input.KEY_ESC)) {
            cancFullscreen();
        }

        switch (state) {
            case MENU:
                /*  middle of canvas  */
                var cx = canvas.width / 2;
                var cy = canvas.height / 2;
                if(inputHandler.getKeyPress(input.KEY_ENTER)) {
                        player = new gameObject.Player(inputHandler, 286, 352, 300);
                        loadStage(stages.getStages().a1);
                        state = TRANSITION;
                        player.moveTo(286, 352, 300);
                }
                break;
            case PLAY:
                if(inputHandler.getKeyPress(input.KEY_ENTER)) {
                    state = PAUSE;
                    music.pause();
                }
                for(var i = 0; i < gameObjects.length; i++) {
                    if(player.alive) {
                        gameObjects[i].update();
                    }
                }
                player.update();
                break;
            case PAUSE:
                if(inputHandler.getKeyPress(input.KEY_ENTER)) {
                    state = PLAY;
                    music.play();
                }
                break;
            case TRANSITION:
                count++;
                if(count == 3) {
                    state = PLAY;
                    count = 0;
                }
                break;
            case WIN:
        }

        inputHandler.clear();

    };

    function draw() {

        switch(state) {
            case MENU :
                drawMenu();
                break;
            case PLAY :
                actualStage.draw(invalidatedScene, gameObjects.concat([player]));
                invalidatedScene = false;
                break;
            case PAUSE :
                drawPause();
                break;
            case TRANSITION :
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            case WIN:
                drawEnding();             
        }
    };

    function drawPause() {
    };

    function drawMenu() {
        /*  background  */
        ctx.save();
        var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, "#0c0a36");
        grd.addColorStop(1, "#000000");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
       
        ctx.font = "32pt 'BlackwoodCastle'"
        ctx.textAlign = "center";
         
        /*  middle of canvas  */
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
         
        /*  menu  */
       	ctx.fillStyle = "#eee";
	    ctx.fillText("press Stat to Play", cx, cy);   
    };

    function drawEnding() {
        /*  background  */
        ctx.save();
        var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, "#0c0a36");
        grd.addColorStop(1, "#000000");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
       
        ctx.font = "32pt 'BlackwoodCastle'"
        ctx.textAlign = "center";
         
        /*  middle of canvas  */
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
         
        /*  menu  */
        ctx.fillStyle = "#ea4";
        ctx.fillText("Congratulations !", cx, cy);   
    };    

    function setFullscreen() {
        if(!canvas.isFullscreen) {
            var ratio = canvas.defaultHeight / canvas.defaultWidth;
            div.style.width = screen.width + "px";
            div.style.height = screen.height + "px";
            canvas.setAttribute("width", screen.width);
            canvas.setAttribute("height", screen.height);
            scale = Math.ceil(Math.max(stage.totalWidth/canvas.width, stage.totalHeight/canvas.height));
            invalidatedScene = true;
            canvas.isFullscreen = true;
        }
    };

    function cancFullscreen() {
        if(canvas.isFullscreen) {
            div.style.width = canvas.defaultWidth + "px";
            div.style.height = canvas.defaultHeight + "px";
            canvas.setAttribute("width","1024");
            canvas.setAttribute("height","600");
            scale = Math.ceil(Math.max(stage.totalWidth/canvas.width, stage.totalHeight/canvas.height));
            invalidatedScene = true;
            canvas.isFullscreen = false;
        }
    };

};
 
window.addEventListener('load', function() { game = new Game(); game.load() }, true);
