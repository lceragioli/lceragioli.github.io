var tile = (function() {

    /*  Interface   */

    var tilesInfo = [
        new tileInfo("prato", "prato"),
        new tileInfo("piastrellaBase", "piastrellabase"),
        new tileInfo("piastrellaSu", "piastrellasu"),
        new tileInfo("piastrellaGiu", "piastrellagiu"),
        new tileInfo("piastrellaSin", "piastrellasin"),
        new tileInfo("piastrellaDes", "piastrellades"),
        new tileInfo("frecciaSudSu", "frecciaSudSu"),
        new tileInfo("frecciaSudGiu", "frecciaSudGiu"),
        new tileInfo("frecciaSudSin", "frecciaSudSin"),
        new tileInfo("frecciaSudDes", "frecciaSudDes"),
        new tileInfo("frecciaEstSu", "frecciaEstSu"),
        new tileInfo("frecciaEstGiu", "frecciaEstGiu"),
        new tileInfo("frecciaEstSin", "frecciaEstSin"),
        new tileInfo("frecciaEstDes", "frecciaEstDes"),        
        new tileInfo("pareteDes", "paretenord"),
        new tileInfo("pareteSin", "pareteest"),
        new tileInfo("noInvisible", "noInvisible"),
        new tileInfo("paretePietraNord", "paretePietraNord"),
        new tileInfo("paretePietraEst", "paretePietraEst"),
        new tileInfo("mattoni", "mattoni"),
        new tileInfo("sfera", "sfera"),        
        new tileInfo("grotta", "grotta"),
        new tileInfo("tronco", "tronco"),
        new tileInfo("chioma1", "chioma1"),
        new tileInfo("chioma2", "chioma2"),
        new tileInfo("chioma3", "chioma3"),
        new tileInfo("giardino", "giardino"),
        new tileInfo("noInvisible", "noInvisible"),
        new tileInfo("noInvisible", "noInvisible"),
        new tileInfo("noInvisible", "noInvisible"),
    ];

    var tileWidth = 39;
    var tileHeight = 42;

    function Tile(name, img) {
        this.name = name;
        this.image = img;
    };

    function getTiles() {
        return tiles;
    };

    /*  Implementation  */
    
    var tilePath = "tiles/";
    var ext = ".gif";

    var tiles = {invisible: new Tile("invisible", null)};

    function tileInfo(name, path) {
        this.name = name;
        this.url = "tiles/" + path + ".gif";
    };

    return {
        Tile : Tile,
        tilesInfo : tilesInfo,
        tileWidth : tileWidth,
        tileHeight : tileHeight,
        getTiles : getTiles,
    }

})();


