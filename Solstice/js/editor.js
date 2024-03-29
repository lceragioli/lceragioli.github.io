var formContainer;
var stageContainer;
var commandContainer;
var resourceHandler;

window.addEventListener("load", init);
window.addEventListener("resize", display);

function init() {
    
    var canvas = document.getElementById("stage");
    canvas.tabIndex = 1000;
    var ctx = canvas.getContext("2d");
    if(!ctx){
        alert("Il tuo browser non supporta HTML5, aggiornalo!");
    };
    
    resourceHandler = new ResourceHandler(canvas, ctx, start);
    
    /*  Tiles Loading  */
    resourceHandler.loadTiles();

    /*  Sprites Loading  */
    resourceHandler.loadSprites();
    
    /*  Sound Loading  */
    resourceHandler.loadAudio();
};

function start() {
    resourceHandler.loadForms();
    resourceHandler.loadLevels();
    resourceHandler.loadStages();
    
    formContainer = new FormContainer();
    stageContainer = new StageContainer();
    commandContainer = new CommandContainer();   
    display();        
};

function display() {
    stageContainer.draw();
};


function FormContainer() {
    var containerExt = document.getElementById("formsDiv");
    var container = document.getElementById("forms");

    (function insertForms() {
        var f;
        var fm;
        var formNode;        
        for(f in form.getForms()) {
            fm = form.getForms()[f];
            formNode = fm.image;
            formNode.id = fm.name;
            formNode.className = "form";
            formNode.addEventListener("click", function() { form.select(this.id); });
            container.appendChild(formNode);
        }
    })();
};

function StageContainer() {
    var containerExt = document.getElementById("stageDiv");
    var container = document.getElementById("stageCanvasDiv");

    var canvas = document.getElementById("stage");
    canvas.tabIndex = 1000;
    var ctx = canvas.getContext("2d");
    if(!ctx){
        alert("Il tuo browser non supporta HTML5, aggiornalo!");
    };

    var switchShowGridButton = document.getElementById("switchShowGrid");
    var switchActionButton = document.getElementById("switchAction");
    var layerUpButton = document.getElementById("layerUp");
    var layerDownButton = document.getElementById("layerDown");

    var actualStage = new stage.StageInfo("actualStage", [], []);
    var zlevel = 0;

    var setting = false;
    var action = "insert";
    var showGrid = true;
    var deltaX = 0;

    var objCount = 0;

    var commandSprite = ["url('commandSprite/commandSprite0.gif')",
                         "url('commandSprite/commandSprite1.gif')"];

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    switchShowGridButton.addEventListener("click", switchShowGrid);
    switchActionButton.addEventListener("click", switchAction);
    layerUpButton.addEventListener("click", increaseZLevel);
    layerDownButton.addEventListener("click", decreaseZLevel);


    this.draw = drawStage;
    this.stage = actualStage;
    this.openStage = openNewStage;

    function openNewStage(stageName) {
        var stg = stages.getStages()[stageName];        
        
        if(stg != null) {
            actualStage = stg.stageInfo();
            this.stage = actualStage;
            drawStage(); 
        }
        else {
            alert("there is not a stage named " + stageName);
        }
    };

    function drawStage() {
        actualStage.draw(zlevel, ctx, showGrid);
    };

    function onMouseDown(e) {
        setting = true;

	    var mouseX = Math.round(e.pageX - window.pageXOffset - (canvas.getBoundingClientRect().left));
	    var mouseY = Math.round(e.pageY - window.pageYOffset - (canvas.getBoundingClientRect().top));
        maybeSet(mouseX - deltaX, mouseY);
    };

    function onMouseMove(e) {
        if(setting) {        

	        var mouseX = Math.round(e.pageX - window.pageXOffset - (canvas.getBoundingClientRect().left));
	        var mouseY = Math.round(e.pageY - window.pageYOffset - (canvas.getBoundingClientRect().top));
            maybeSetMove(mouseX - deltaX, mouseY);
        }
    };

    function onMouseUp() {
        setting = false;
    };

    function maybeSet(mouseX, mouseY) {
    
        var sel = actualStage.hit(mouseX, mouseY, zlevel);

        setAll(sel);
        drawStage();
    };

    function maybeSetMove(mouseX, mouseY) {
        var sel = actualStage.hit(mouseX, mouseY, zlevel);

        if((sel != null && action == "insert" && actualStage.isFree(sel.x, sel.y, zlevel)) || 
          (action == "remove" && !(actualStage.isFree(sel.x, sel.y, zlevel))) 
        ) {
            setAll(sel);
            drawStage();
        }
    };

    function setAll(selectedCube) {
        var selectedForm = form.getSelected();
        
        if(selectedForm != null) {
            if(selectedForm.type == "cell") {
                var actualTile = null;        

                for(var y = 0; y < selectedForm.cells.length; y++) {
                    for(var x = 0; x < selectedForm.cells[y].length; x++) {
                        if(actualTile = form.getTile(selectedForm, x, y)) {
                            if(action == "insert") {
                                actualStage.setCell(selectedCube.x + x, selectedCube.y + y, selectedCube.z, actualTile); 
                            }
                            else { actualStage.free(selectedCube.x + x, selectedCube.y + y, selectedCube.z); }
                        }
                    }
                }
            }
            else {  /*  if selectedForm.type == "object"   */
                
                if(action == "insert" && stage.insideCell(selectedCube.x, selectedCube.y, zlevel)) {
                    var obj = new gameObject[selectedForm.name](selectedCube.x * stage.cellSize + stage.cellSize/2, selectedCube.y * stage.cellSize + stage.cellSize/2, stage.cellSize * zlevel);
                    actualStage.setObject(obj);
                }
                else {
                    actualStage.free(selectedCube.x, selectedCube.y, selectedCube.z);
                }
            }
        }
    };

    function increaseZLevel() {
        if(zlevel < actualStage.maxZ) {
            zlevel ++;
            actualStage.invalidate();
            drawStage();
        }
    }

    function decreaseZLevel() {
        if(zlevel > 0) {
            zlevel --;
            actualStage.invalidate();
            drawStage();
        }
    }

    function switchAction() {
        if(action == "remove") { 
            action = "insert";
            switchActionButton.style.backgroundImage = commandSprite[0];
        }
        else {
        action = "remove"; 
        switchActionButton.style.backgroundImage = commandSprite[1];
        }

    };

    function switchShowGrid() {
        showGrid = !showGrid;
        actualStage.invalidate();
        if(showGrid) {
            switchShowGridButton.style.backgroundImage = commandSprite[0];
        }
        else {
            switchShowGridButton.style.backgroundImage = commandSprite[1];
        }
        drawStage();
    };

    function moveLeft() {
        deltaX = deltaX - 10;
        ctx.translate(-10, 0);
        actualStage.invalidate();
        drawStage();
    };

    function moveRight() {
        deltaX = deltaX + 10;
        ctx.translate(10, 0);
        actualStage.invalidate();
        drawStage();
    };

    function onKeyDown(e) {

        switch(e.keyCode) {
            case 81 :   /*  case Q   */
                increaseZLevel();
                break;
            case 65 :   /*  case A   */
                decreaseZLevel();
                break;
            case 90 :   /*  case Z   */
                switchAction();
                break;
            case 71 :   /*  case G   */
                switchShowGrid();
                break;
            case 37 :   /*  case ArrowLeft   */
                moveRight();
                break;
            case 39 :   /*  case ArrowRight   */
                moveLeft();
                break;
        }
    };
};

function CommandContainer() {
    var exportButton = document.getElementById("export");
    var outputArea = document.getElementById("output");
    var openButton = document.getElementById("open");
    var stagesList = document.getElementById("stages");
    var stageName = document.getElementById("stageName");
    var levelName = document.getElementById("levelName");
    var overStage = document.getElementById("overStage");
    var underStage = document.getElementById("underStage");
    var underStage = document.getElementById("underStage");    
    var light = document.getElementById("light");

    (function() {
        var st;
        var stgs = stages.getStages();
        for(st in stgs) {
            var opt = document.createElement("option");
            opt.value = (st);
            stagesList.appendChild(opt);
        }
        
        var lv;
        var lvls = level.getLevels();
        var levelList = document.getElementById("levels");
        for(lv in lvls) {
            var opt = document.createElement("option");
            opt.value = (lv);
            levelList.appendChild(opt);
        }
    })();

    exportButton.addEventListener("click", writeStage);
    openButton.addEventListener("click", openStage);

    function openStage() {
        stageContainer.openStage(stageSelect.value);
    }

    function writeStage() {
        stageContainer.stage.addBorder();
        
        var cells = stageContainer.stage.cellsToString();
        var objs = stageContainer.stage.objectsToString();

        outputArea.value = "new stage.Stage(" + "'" + stageName.value + "'" + ", level.getLevels()." + levelName.value + " ," + cells + ", " + objs + ", '" + overStage.value + "', '" + underStage.value + "', " + light.value + ")";
        stageContainer.stage.removeBorder();
    }
};
