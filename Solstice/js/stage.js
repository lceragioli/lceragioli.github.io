var stage = (function() {

    /*  Implementation  */

    var xCellsNum = 34;
    var yCellsNum = 34;
    var zCellsNum = 15;

    /*  Interface   */

    var totalWidth = 1330;
    var totalHeight = 1080;
    var cellSize = 22;
    var Xmax = cellSize * xCellsNum;
    var Ymax = cellSize * yCellsNum;
    var Zmax = cellSize * zCellsNum;

    function inside(x, y, z) {
        return (x >= 0 &&  x <= Xmax &&
                y >= 0 &&  y <= Ymax &&
                z >= 0 &&  z <= Zmax);
    };

    function insideCell(xc, yc, zc) {
        return (xc >= 0 &&  xc < xCellsNum &&
                yc >= 0 &&  yc < yCellsNum &&
                zc >= 0 &&  zc < zCellsNum);
    };

    function w2v(x, y, z) {
            if(z != 0) {
                base = w2v(x, y, 0);
                return {
                    x : base.x,
                    y : base.y - z * 20 / 22
                }
            }
            else {
                var vistaY = originY + Math.ceil((y + x) * 10 / 22);
                var vistaX = originX + Math.ceil((y - x) * Math.ceil(tile.tileWidth / 2) / cellSize);

                return {
                    x : vistaX,
		            y : vistaY
                }
            }
    };
             
    function v2w(vistaX, vistaY, z) {
        if(z != 0) {
            return v2w(vistaX, vistaY + (z * 20 / 22 * cellSize), 0);
        }
        else {
            var mondoY = (((vistaY - originY) * 22 / 10) + (vistaX - originX) * cellSize / Math.ceil(tile.tileWidth / 2)) / 2;
            var mondoX = ((vistaY - originY) * 22 / 10) - mondoY;

            return {
                x : mondoX,
		        y : mondoY,
                z : z
            }
        }
    };
    
    function drawGrid(zmax, ct) {

        ct.save();
  
        ct.beginPath();
        ct.strokeStyle="#f57900";
        ct.lineWidth = 1;

        var p0 = w2v(0, 0, 0);
        var p1 = w2v(0, 0, (zCellsNum - 1) * cellSize);
        ct.moveTo(p0.x, p0.y);
        ct.lineTo(p1.x, p1.y);

        for(var z = 0; z < zCellsNum; z++) {
            p0 = w2v(cellSize, 0, z * cellSize);
            p1 = w2v(0, 0, z * cellSize);
            ct.moveTo(p0.x, p0.y);
            ct.lineTo(p1.x, p1.y);
            p0 = w2v(0, cellSize, z * cellSize);
            ct.moveTo(p0.x, p0.y);
            ct.lineTo(p1.x, p1.y);
        }
        for(var x = 0; x <= xCellsNum; x++) {
            p0 = w2v(x * cellSize, 0, zmax * cellSize);
            p1 = w2v(x * cellSize, yCellsNum * cellSize, zmax * cellSize);
            ct.moveTo(p0.x, p0.y);
            ct.lineTo(p1.x, p1.y);
        }
        for(var y = 0; y <= yCellsNum; y++) {
            p0 = w2v(0, y * cellSize, zmax * cellSize);
            p1 = w2v(xCellsNum * cellSize, y * cellSize, zmax * cellSize);
            ct.moveTo(p0.x, p0.y);
            ct.lineTo(p1.x, p1.y);
        }
        ct.stroke();
        ct.restore();
    };

    function depth(gameObj) {
        if(gameObj.name != 'platform') {
            return Math.floor((gameObj.x + gameObj.y + gameObj.z) / cellSize);
        } else {
            return Math.floor((gameObj.x + gameObj.y + gameObj.z - 12) / cellSize);
        }
    };

    function removeBorder(cells) {

        var z = cells.length - 1;
        var cellsNB = [];

        for(; z >= 0; z--) {
            cellsNB[z] = [];
            var y = cells[z].length - 1;
            for(; y >= 0; y--) {
                cellsNB[z][y] = [];
                var x = cells[z][y].length - 1;
                for(; x >= 0; x--) {
                    if(cells[z][y][x] && cells[z][y][x].name != "invisible") {
                        cellsNB[z][y][x] = cells[z][y][x];
                    }
                }
            }
        }

        return cellsNB;
    };

    function StageInfo(name, tileList, gameObjects) {
        
        var invalidated = true;

        this.cells = tileList;
        this.name = name;
        this.gameObjects = [];
        
        this.maxZ = zCellsNum - 1;
        this.maxY = yCellsNum - 1;
        this.maxX = xCellsNum - 1;

        function insert(cell, x, y, z, stg) {
            if( x >= 0 && y >= 0 && z >= 0 &&
                x < xCellsNum && y < yCellsNum && z < zCellsNum ) {

                    var cells = stg.cells[z];
                    if(cells) {
                        if (cells[y]) {
                            cells[y][x] = cell;
                        }
                        else {
                            cells[y] = [];
                            cells[y][x] = cell;
                        }
                    }
                    else {
                        stg.cells[z] = [];
                        stg.cells[z][y] = [];
                        stg.cells[z][y][x] = cell;
                    }
            }
        }

        function setObject(obj, stg) {

            var x = Math.floor(obj.x / cellSize);
            var y = Math.floor(obj.y / cellSize);
            var z = Math.floor((obj.z + obj.size.z / 2) / cellSize);

            var dz = Math.ceil((obj.size.z / 2 - cellSize / 2) / cellSize);
            for(; dz >= 0; dz--) {
                var dy = Math.ceil((obj.size.y / 2 - cellSize / 2) / cellSize);
                for(; dy >= 0; dy--) {
                    var dx = Math.ceil((obj.size.x / 2 - cellSize / 2) / cellSize);
                    for(; dx >= 0; dx--) {

                        stg.free(x + dx, y + dy, z + dz);
                        stg.free(x + dx, y + dy, z - dz);
                        stg.free(x + dx, y - dy, z + dz);
                        stg.free(x + dx, y - dy, z - dz);
                        stg.free(x - dx, y + dy, z + dz);
                        stg.free(x - dx, y + dy, z - dz);
                        stg.free(x - dx, y - dy, z + dz);
                        stg.free(x - dx, y - dy, z - dz);

                        insert(obj, x + dx, y + dy, z + dz, stg);
                        insert(obj, x + dx, y + dy, z - dz, stg);
                        insert(obj, x + dx, y - dy, z + dz, stg);
                        insert(obj, x + dx, y - dy, z - dz, stg);
                        insert(obj, x - dx, y + dy, z + dz, stg);
                        insert(obj, x - dx, y + dy, z - dz, stg);
                        insert(obj, x - dx, y - dy, z + dz, stg);
                        insert(obj, x - dx, y - dy, z - dz, stg);
                    }
                }
            }

            stg.gameObjects.push(obj);
        }

        this.invalidate = function() { invalidated = true; };
        
        this.setObject = function(obj) {
            setObject(obj, this);
        };

        this.removeObject = function(obj) {

            var x = Math.floor(obj.x / cellSize);
            var y = Math.floor(obj.y / cellSize);
            var z = Math.floor((obj.z + obj.size.z / 2) / cellSize);

            var dz = Math.ceil((obj.size.z / 2 - cellSize / 2) / cellSize);
            for(; dz >= 0; dz--) {
                var dy = Math.ceil((obj.size.y / 2 - cellSize / 2) / cellSize);
                for(; dy >= 0; dy--) {
                    var dx = Math.ceil((obj.size.x / 2 - cellSize / 2) / cellSize);
                    for(; dx >= 0; dx--) {

                        this.freeCell(z + dz, y + dy, x + dx);
                        this.freeCell(z + dz, y + dy, x - dx);
                        this.freeCell(z + dz, y - dy, x + dx);
                        this.freeCell(z + dz, y - dy, x - dx);
                        this.freeCell(z - dz, y + dy, x + dx);
                        this.freeCell(z - dz, y + dy, x - dx);
                        this.freeCell(z - dz, y - dy, x + dx);
                        this.freeCell(z - dz, y - dy, x - dx);

                    }
                }
            }
            this.gameObjects = this.gameObjects.filter(function(go) {
                    return go.x != obj.x || go.y != obj.y || go.z != obj.z;
                });

        };

        this.hit = function(viewX, viewY, actualZ) {

            var wp = v2w(viewX, viewY, actualZ);

            return {
                x : Math.floor(wp.x / cellSize),
                y : Math.floor(wp.y / cellSize),
                z : actualZ
            }
        };

        this.getCellCoord = function(x, y, z) {
            var cellX = Math.floor(x/cellSize);
            var cellY = Math.floor(y/cellSize);
            var cellZ = Math.floor(z/cellSize);
            var cell = this.getCell(cellX, cellY, cellZ);

            return {x: cellX * cellSize, y: cellY * cellSize, z: cellZ * cellSize, cont: cell};
        };

        this.draw = function(zmax, ct, showGrid) {

            var cell;
            var d;
            var z;
            var y;
            var x;
            var view;            
    
            if(invalidated) {
    
                ct.save();
                ct.fillStyle = "#000000";
                ct.fillRect(-10, -10, totalWidth + 20, totalHeight + 20);
                ct.restore();

                for(d = 0; d < zmax + xCellsNum + yCellsNum; d++) {
                    for(z = 0; z < zmax; z++) {
                        for(y = 0; y + z <= d; y++) {
                            x = d - z - y;
                            if(cell = this.getCell(x, y, z)) {
                                if(cell.size) { /*  gameObject  */
                                    cell.show(ct);
                                }
                                else {
                                    if(cell.image) {    /*  mind invisibles cells   */
                                        view = w2v(x * cellSize, y * cellSize, z * cellSize);
                                        ct.drawImage(cell.image, view.x  - Math.ceil(tile.tileWidth / 2), view.y - Math.ceil(tile.tileHeight / 2));
                                    }
                                }
                            }
                        }
                    }
                }

                if(showGrid) {
                    drawGrid(zmax, ct);
                }
                invalidated = false;
            }

            for(d = zmax; d <= zmax + xCellsNum + yCellsNum; d++) {
                z = zmax;
                for(y = 0; y + z <= d; y++) {
                    x = d - z - y;
                    if(cell = this.getCell(x, y, z)) {
                        if(cell.size) { /*  gameObject  */
                            cell.show(ct);
                        }
                        else {
                            if(cell.image) {    /*  mind invisibles cells   */
                                view = w2v(x * cellSize, y * cellSize, z * cellSize);
                                ct.drawImage(cell.image, view.x  - Math.ceil(tile.tileWidth / 2), view.y - Math.ceil(tile.tileHeight / 2));
                            }
                        }
                    }
                }
            }
        };

        this.getCell = function(x, y, z) {
            var cell = this.cells[z];
            if(cell && (cell = cell[y]) && (cell = cell[x])) {
                return cell;
            }
            else { return null; }
        };
        
        this.isFree = function(x, y, z){
            if(this.cells[z] && this.cells[z][y] && this.cells[z][y][x]) {
                return false;
            }
            else { return true; }
        };
        
        this.setCell = function(x, y, z, val) {
            this.free(x, y, z);
            insert(val, x, y, z, this);
        };

        this.freeCell = function(z, y, x) {
            if(this.cells[z] && this.cells[z][y] && this.cells[z][y][x]) {
                delete this.cells[z][y][x];
            }            
        }
        
        this.free = function(x, y, z) {
            if(this.cells[z] && this.cells[z][y] && this.cells[z][y][x]) {
                if(this.cells[z][y][x].size) {   /*  object free     */
                    this.removeObject(this.cells[z][y][x]);
                }
                else {                              /*  tile free       */
                    delete this.cells[z][y][x];
                }
                invalidated = true;
            }
        };

        this.addBorder = function() {   /*  considera anche i gameObject che altrimenti verrebbero cancellati automaticamente dalle tile invisibili */
            var x;
            var y;
            var z;

            var s = "";

            var min;
            var max;
            var cell;
            for(x = 0; x < xCellsNum; x++) {    /*  border on X     */
                min = yCellsNum;
                max = 0;
                for(y = 0; y < yCellsNum; y++) {
                    for(z = 0; z < zCellsNum; z++) {
                        cell = this.getCell(x, y, z);
                        if(cell){
                            min = Math.min(min, y);
                            max = Math.max(max, y);
                        }
                    }
                }
                if(min != yCellsNum && min != 0) {
                    for(z = 0; z < zCellsNum; z++) {
                        this.setCell(x, min - 1, z, tile.getTiles().invisible);
                        s = s + "(" + x + ", " + min + ", " + z + ")";
                    }
                }
                if(max != yCellsNum && max != 0) {
                    for(z = 0; z < zCellsNum; z++) {
                        this.setCell(x, max + 1, z, tile.getTiles().invisible);
                        s = s + "(" + x + ", " + max + ", " + z + ")";
                    }
                }
            }

            for(y = 0; y < yCellsNum; y++) {    /*  border on Y     */
                min = xCellsNum;
                max = 0;
                for(x = 0; x < xCellsNum; x++) {
                    for(z = 0; z < zCellsNum; z++) {
                        cell = this.getCell(x, y, z);
                        if(cell){
                            min = Math.min(min, x);
                            max = Math.max(max, x);
                        }
                    }
                }
                if(min != xCellsNum && min != 0) {
                    for(z = 0; z < zCellsNum; z++) {
                        this.setCell(min - 1, y, z, tile.getTiles().invisible);
                        s = s + "(" + min + ", " + y + ", " + z + ")";
                    }
                }
                if(max != xCellsNum && max != 0) {
                    for(z = 0; z < zCellsNum; z++) {
                        this.setCell(max + 1, y, z, tile.getTiles().invisible);
                        s = s + "(" + max + ", " + y + ", " + z + ")";
                    }
                }
            };
        };
        
        this.removeBorder = function() {
            this.cells = removeBorder(this.cells);
        };

        this.cellsToString = function() {
            var z = 0;
            var out = "[";
            for(; z < zCellsNum; z++) {
                out = out + "[";
                for(var y = 0; y < yCellsNum; y++) {
                    out = out + "[";
                    for(var x = 0; x < xCellsNum; x++) {
                        cell = this.getCell(x, y, z);
                        if(cell && !cell.size){
                            out = out + "tile.getTiles()." + cell.name;
                        }
                        if(x < xCellsNum - 1) {
                            out = out + ",";
                        }
                    }
                    out = out + "]";
                    if(y < yCellsNum - 1) {
                        out = out + ",";
                    }
                }
                out = out + "]";
                if(z < zCellsNum - 1) {
                    out = out + ",";
                }
            }
            out = out + "]";
            return out;
        };

        this.objectsToString = function() {
         
            var out = "[";
            var objn;
            var obj;

            for(objn in this.gameObjects) {
                obj = this.gameObjects[objn];
                if(out.length != 1) {
                    out = out + ", ";
                }
                out = out + "new gameObject." + obj.name.slice(0, 1).toUpperCase() + obj.name.slice(1) + "(" + obj.x + ", " + obj.y + ", " + obj.z + ")";
            }
            out = out + "]";

            return out;
        };

        (function(stg) {
            /*  removing border    */
            var tile;
            var z = stg.cells.length - 1;
            var y;
            for(; z >= 0; z--) {
                if(stg.cells[z]) {
                    for(y = stg.cells[z].length - 1; y >= 0; y--) {
                        if(stg.cells[z][y]) {
                            for(i = stg.cells[z][y].length - 1; i >= 0; i--) {
                                tile = stg.cells[z][y][i];
                                if(tile && tile.name == "invisible") {
                                    delete stg.cells[z][y][i];
                                }
                            }
                        }
                    }
                }
            }

            /*  gameObject setting  */
            var i = gameObjects.length - 1;
            for(; i >= 0; i--) {
                setObject(gameObjects[i], stg);                
            }
        })(this);        
    };

    function Stage(name, level, cellsList, gameObjectList, over, under, light) {

        this.cells = cellsList;
        this.gameObjects = gameObjectList;
        this.name = name;
        this.level = level;
        this.over = over;
        this.under = under;
        this.light = light;

        this.stageInfo = function() {
            return (new StageInfo(this.name, removeBorder(this.cells), this.gameObjects));
        };

        this.getCells = function() {
            return this.cells;
        };

        this.getViewHitCell = function(viewX, viewY, actualZ) {

            var wp = v2w(viewX, viewY, actualZ);

            return {
                x : Math.floor(wp.x / cellSize),
                y : Math.floor(wp.y / cellSize),
                z : actualZ
            }
        };

        this.getHitCell = function(object) {

            var cell = null;

            var Xmin = Math.floor((object.x - object.size.x/2) / cellSize);
            var Ymin = Math.floor((object.y - object.size.y/2) / cellSize);
            var Zmin = Math.floor(object.z / cellSize);

            var Xmax = Math.floor((object.x + object.size.x/2) / cellSize);
            var Ymax = Math.floor((object.y + object.size.y/2) / cellSize);
            var Zmax = Math.floor((object.z + object.size.z) / cellSize);

            var x = Xmin;
            var y = 0;
            var z = 0;
            while(x <= Xmax && cell == null) {
                y = Ymin;
                while(y <= Ymax && cell == null) {
                    z = Zmin;
                    while(z <= Zmax && cell == null) {
                        if(this.getCell(x, y, z) != null) {

                            cell = {x: x * cellSize, 
                                    y: y * cellSize, 
                                    z: z * cellSize,
                                    size: cellSize};
                        }
                        z++;
                    }
                    y++;
                }
                x++;
            }

            return cell;
        };

        this.getCellCoord = function(x, y, z) {
            var cellX = Math.floor(x/cellSize);
            var cellY = Math.floor(y/cellSize);
            var cellZ = Math.floor(z/cellSize);
            var cell = this.getCell(cellX, cellY, cellZ);

            return {x: cellX * cellSize, y: cellY * cellSize, z: cellZ * cellSize, cont: cell};
        };

        this.draw = function(all, actualGameObjects) {
            var i;
            var ct = game.getContext();
			var cv = game.getCanvas();
			var scale = game.getScale();

            ct.save();

            if(all) {
                ct.fillRect(0, 0, 2*totalWidth, 2*totalHeight);
                game.getPlayer().draw(ct);                
            }

            ct.scale(1/scale, 1/scale);
			ct.translate((cv.width - (totalWidth/scale))/2, (cv.height - (totalHeight/scale))/2);

            /*  clipping    */
            if(!all && this.light) {
                var clip;

                ct.beginPath();
                for(i = 0; i < actualGameObjects.length; i++) {
                    if(actualGameObjects[i].clipRect != null) {
                        clip = actualGameObjects[i].clipRect;
                        ct.rect(Math.floor(clip.x), Math.floor(clip.y), Math.ceil(clip.width), Math.ceil(clip.height));
                    }
                }
                ct.clip();
            }
            else if(!this.light) {
                /*  backGround  */    
                ct.fillStyle = "#000000";
                ct.fillRect(0, 0, 2*totalWidth, 2*totalHeight);
                game.getPlayer().draw(ct);

                var l;
                var lightPoint;

                ct.beginPath();
                for(i = 0; i < actualGameObjects.length; i++) {
                    if(actualGameObjects[i].light != null) {
                        l = actualGameObjects[i].light;
                        lightPoint = w2v(l.x, l.y, l.z);
                        ct.arc(lightPoint.x, lightPoint.y, l.radius, 0, 2 * Math.PI);
                        ct.closePath();
                    }
                }
                ct.clip();
            }

            /*  backGround  */
            ct.fillStyle = "#000000";
            ct.fillRect(0, 0, 2*totalWidth, 2*totalHeight);
    
            /*  gameObject record   */
            var go;
            var objectToDraw = {};

            for(i = 0; i < actualGameObjects.length; i++) {
                go = actualGameObjects[i];
                var d = depth(go);
                if(objectToDraw[d]) {
                    objectToDraw[d].push(go);
                }
                else {
                    objectToDraw[d] = [go];
                }
            }

            /*  cells and gameObjects drawing   */
            var cell;
            var d;
            var z;
            var y;
            var x;
            var view;

            for(d = 0; d < zCellsNum + xCellsNum + yCellsNum; d++) {
                for(z = 0; z <= d; z++) {
                    for(y = 0; y + z <= d; y++) {
                        x = d - z - y;
                        if(cell = this.getCell(x, y, z)) {
                            if(cell.image && cell.name != "noInvisible") {
                                view = w2v(x * cellSize, y * cellSize, z * cellSize); 
                                ct.drawImage(cell.image, view.x - Math.ceil(tile.tileWidth / 2), view.y - Math.ceil(tile.tileHeight / 2), cell.image.width, cell.image.height);
                            }
                        }
                    }
                }
                if(objectToDraw[d]) {
                    for(i = 0; i < objectToDraw[d].length; i++) {
                        objectToDraw[d][i].draw(ct);
                    }
                }
            }

            ct.restore();
        };

        this.getCell = function(x, y, z) {
            var cell = this.cells[z];
            if(cell && (cell = cell[y]) && (cell = cell[x])) {
                return cell;
            }
            else { return null; }
        };
    };

    /*  Implementation  */

    var originX = Math.floor(totalWidth / 2);
    var originY = zCellsNum * cellSize;

    function isInClip(view, clip) {
        if(clip && view.x > clip.x - 2*cellSize && view.x < clip.x + clip.width + 2*cellSize &&
           view.y > clip.y - 2*cellSize && view.y < clip.y + clip.height + 2*cellSize) {
            return true;
        }
        else {
            return false;
        }
    }

    return {
        Stage : Stage,
        StageInfo : StageInfo,
        v2w : v2w,
        w2v : w2v,
        totalWidth : totalWidth,
        totalHeight : totalHeight,
        cellSize : cellSize,
        inside : inside,
        insideCell : insideCell,
        Xmax : Xmax,
        Ymax : Ymax,
        Zmax : Zmax
    };
})();
    



