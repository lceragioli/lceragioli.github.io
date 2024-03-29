var form = (function () {

    /*  Interface   */

    var cellFormsInfo = [
        new formInfo("noInvisible", [["noInvisible"]], tile.tileWidth, tile.tileHeight),
        new formInfo("grotta", [["grotta"]], tile.tileWidth, tile.tileHeight),
        new formInfo("mattoni", [["mattoni"]], tile.tileWidth, tile.tileHeight),
        new formInfo("sfera", [["sfera"]], tile.tileWidth, tile.tileHeight),        
        new formInfo("paretePietraNord", [["paretePietraNord"]], tile.tileWidth, tile.tileHeight),
        new formInfo("paretePietraEst", [["paretePietraEst"]], tile.tileWidth, tile.tileHeight),
        new formInfo("prato", [["prato"]], tile.tileWidth, tile.tileHeight),
        new formInfo("giardino", [["giardino"]], tile.tileWidth, tile.tileHeight),
        new formInfo("tronco", [["tronco"]], tile.tileWidth, tile.tileHeight),
        new formInfo("chioma1", [["chioma1"]], tile.tileWidth, tile.tileHeight),
        new formInfo("chioma2", [["chioma2"]], tile.tileWidth, tile.tileHeight),
        new formInfo("chioma3", [["chioma3"]], tile.tileWidth, tile.tileHeight),        
        new formInfo("pratone", [["prato", "prato"], ["prato", "prato"]], 2 * tile.tileWidth, 3 * tile.tileHeight / 2),
        new formInfo("piastrellona", [["piastrellaSu", "piastrellaSin"], ["piastrellaDes", "piastrellaGiu"]], 2 * tile.tileWidth, 3 * tile.tileHeight / 2),
        new formInfo("frecciaSud", [["frecciaSudSu", "frecciaSudSin"], ["frecciaSudDes", "frecciaSudGiu"]], 2 * tile.tileWidth, 3 * tile.tileHeight / 2),
        new formInfo("frecciaEst", [["frecciaEstSu", "frecciaEstSin"], ["frecciaEstDes", "frecciaEstGiu"]], 2 * tile.tileWidth, 3 * tile.tileHeight / 2),
        new formInfo("piastrellina", [["piastrellaBase"]], tile.tileWidth, tile.tileHeight),
        new formInfo("pareteSin", [["pareteSin"]], tile.tileWidth, tile.tileHeight),
        new formInfo("pareteDes", [["pareteDes"]], tile.tileWidth, tile.tileHeight)
    ];

    var objectFormsInfo = [
        "Zombie",
        "Goblin",
        "Platform",
        "Enemy",
        "Ghost",
        "Fire",
        "Spine",
        "Key",
        "Gate"
    ];
    
    function Form(type, name, cells, img, width, height) {
        this.type = type;
        this.name = name;
        this.cells = cells;
        this.width = width;
        this.height = height;
        this.image = img;
    };
    
    function getForms() {
        return forms;
    };
    
    function select(f) {
        if(f != null && selected != f) {
            if(selected != null) {
                document.getElementById(selected).className = "form"
            }
            selected = f;
            document.getElementById(f).className = "selectedForm"
        }
    };     
    

    function getSelected() {
        return selected == null ? null : forms[selected];
    };

    function getTile(form, x, y){
       var cell = form.cells[y];
       if(cell && (cell = cell[x])) {
           return cell;
       }
       else { return null; }
    };

    /*  Implementation  */
    
    var forms = {};
    var selected = null;

    function formInfo(name, cells, width, height) {
        this.name = name;
        this.cells = cells;
        this.width = width;
        this.height = height;
    };

    return {
        Form : Form,
        cellFormsInfo : cellFormsInfo,
        objectFormsInfo : objectFormsInfo,        
        getForms : getForms,
        select : select,
        getSelected : getSelected,
        getTile : getTile,
    }

})();


