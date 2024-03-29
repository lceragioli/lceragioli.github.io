var level = (function() {

    /*  Interface   */

    function loadLevels() {
        levels = {
            level0 : new Level("level0", audio.getSounds().audio0),
            level1 : new Level("level1", audio.getSounds().audio1),
            level2 : new Level("level2", audio.getSounds().audio2),
            level3 : new Level("level3", audio.getSounds().audio3)
        };
    };

    function Level(name, music) {
        this.name = name;
        this.music = music;
    };

    function getLevels() {
        return levels;
    };
    
    /*  Implementation  */

    var levels = null;


    return {
        Level : Level,
        getLevels : getLevels,
        loadLevels : loadLevels
    };
})();
