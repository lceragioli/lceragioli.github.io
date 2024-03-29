function ResourceHandler(canvas, ctx, callback) {

    var resNumber = sprite.spritesInfo.length + 
                    tile.tilesInfo.length + 
                    audio.soundsInfo.length;
    var resLoaded = 0;

    var errors = [];
    var status = 0; /* loading % */
    var loading = false;


    this.loadSprites = function(funct) {

        loading = true;
 
        var i;
        for(i = 0; i < sprite.spritesInfo.length; i++) {
            var info = sprite.spritesInfo[i];

            var img = new Image();
            img.src = info.url;
             
            img.addEventListener("load", function() { 
             
                if(funct != undefined) {
                    funct();
                }
                resLoaded ++;
                checkLoaded();
            });
         
            img.addEventListener("error", function(e) {
                 
                errors.push([info.url, e]);
                checkLoaded();
            });
     
            sprite.getSprites()[info.name] = (new sprite.Sprite(info.name, img, info.frameNum));
        }
    };

    this.loadTiles = function(funct) {

        loading = true;

        var i;
        for(i = 0; i < tile.tilesInfo.length; i++) {
            var info = tile.tilesInfo[i];

            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous");            
            img.src = info.url;

            img.addEventListener("load", function() {
             
                if(funct != undefined) {
                    funct();
                }

                resLoaded ++;
                checkLoaded();
            });
         
            img.addEventListener("error", function(e) {
                 
                errors.push([info.url, e]);
                checkLoaded();
            });
     
            tile.getTiles()[info.name] = (new tile.Tile(info.name, img));
        }
    };
    
    this.loadAudio = function(funct) {
        loading = true;

        var i;
        for(i = 0; i < audio.soundsInfo.length; i++) {
            var info = audio.soundsInfo[i];

            var sound = new Audio();
            sound.src = info.url + audio.soundsExts[0];
            sound.formatIndex = 0;
            sound.volume = 0.5;
             
            sound.addEventListener("canplaythrough", function() {

                if(funct != undefined) {
                    funct();
                }

                resLoaded ++; 
                checkLoaded();
            }, false);
             
            sound.addEventListener("error", function(e) {
                 
                if(sound.formatIndex >= audio.soundsExts.length) {
                     
                    errors.push([url, e.currentTarget.error.code]);
                    checkLoaded();
                } else {
                    sound.formatIndex ++;
                    sound.src = info.url + audio.soundsExts[sound.formatIndex];
                }
            });
             
            audio.getSounds()[info.name] = (new audio.Sound(info.name, sound));
        }
    };    
    
    this.loadForms = function(funct) {
    
        loading = true;

        var i;
        var k;
        var j;
        for(i = 0; i < form.cellFormsInfo.length; i++) {
            var info = form.cellFormsInfo[i];

            var img = new Image();
            
            var cv = document.createElement("canvas");
            cv.height = "" + info.height;
            cv.width = "" + info.width;
            var ct = cv.getContext("2d");
            var x = 0 + Math.ceil(info.width / 2) - Math.ceil(tile.tileWidth / 2);
            var y = 0;

            /*  Drawing */
            for(k = 0; k < info.cells.length; k++) {
                var dx = x;
                var dy = y;
                for(j = 0; j < info.cells[k].length; j++) {
                    ct.drawImage(tile.getTiles()[info.cells[k][j]].image, dx, dy);
                    dx = dx - Math.ceil(tile.tileWidth / 2);
                    dy = dy + (tile.tileHeight / 2 - 1) / 2;
                }
                x = x + Math.ceil(tile.tileWidth / 2);
                y = y + (tile.tileHeight / 2 - 1) / 2;
            }
            img.src = cv.toDataURL("image/gif");

            var cells = [];
            for(k = 0; k < info.cells.length; k++) {
                cells[k] = [];
                for(j = 0; j < info.cells[k].length; j++) {
                    cells[k][j] = tile.getTiles()[info.cells[k][j]];
                }
            }
     
            form.getForms()[info.name] = (new form.Form("cell", info.name, cells, img, info.width, info.height));
        }
    
        for(i = 0; i < form.objectFormsInfo.length; i++) {
            var info = form.objectFormsInfo[i];

            var img = sprite.getSprites()[info].img;

            form.getForms()[info] = (new form.Form("object", info, [], img, img.width, img.height));
        }
    };

    this.loadLevels = function(funct) {
        level.loadLevels();
        if(funct != undefined) {
            funct();
        }
    };

    this.loadStages = function(funct) {
        stages.loadStages();
        if(funct != undefined) {
            funct();
        }
    };


    function checkLoaded() {
        if(!loading) return null;

        //percentuale di caricamento
        status = (resLoaded) / (resNumber + errors.length);

        drawLoading();
         
        if(resLoaded + errors.length >= resNumber) {
            if(callback != null) {
                callback();
            }
            resNumber = 0;
            resLoaded = 0;
            loading = false;
        }
    };

    function drawLoading() {

        //centro del canvas
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
 
        //imposta il colore di riempimento
        ctx.fillStyle = "#333";
 
        //disegna un rettangolo grande quanto il canvas
        ctx.fillRect(0, 0, canvas.width, canvas.height);
     
        //avvia il path di disegno primitive
        ctx.beginPath();
        ctx.strokeStyle = "#222";
         
        //imposta lo spessore della linea da disegnare
        ctx.lineWidth = 25;
         
        //aggiunge un arco al path (una corona circolare di raggio 80)
        ctx.arc(cx, cy, 80, 0, Math.PI*2, false);
         
        //disegna il path
        ctx.stroke();
     
        //calcola i radianti del secondo arco, 
        var radians = (360 * status) * Math.PI / 180;
         
        //disegna il secondo arco
        ctx.beginPath();
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 25;
        ctx.arc(cx, cy, 80, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false);
        ctx.stroke();
     
        //Imposta un font e disegna il testo al centro del cerchio di caricamento
 //       ctx.font = '22pt Segoe UI Light';
        ctx.fillStyle = '#ddd';
        ctx.fillText(Math.floor(status*100) + "%",cx-25,cy+10);
    };
};
