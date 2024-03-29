var audio = (function() {

    /*  Interface   */

    var soundsExts = [".mp3", ".ogg"];

    function Sound(name, audio) {
        this.name = name;
        this.audio = audio;
    };

    function getSounds() {
        return sounds;
    };

    /*  Implementation  */

    var soundsDir = "audio/";

    var sounds = {};
    var soundsInfo = [
        new soundInfo("menu", "castle"),
        new soundInfo("audio0", "solstice"),
        new soundInfo("audio1", "uforia2"),
        new soundInfo("audio2", "icarus"),
        new soundInfo("audio3", "uforia"),

        new soundInfo("ending", "ending"),

        new soundInfo("playerDie", "playerDie"),
        new soundInfo("pickedKey", "pickedKey"),
        new soundInfo("fire", "fire"),
        new soundInfo("spell1", "spell1"),
        new soundInfo("spell2", "spell2")
    ];

    function soundInfo(name, path) {
        this.name = name;
        this.url = soundsDir + path;
    };

    return {
        Sound : Sound,
        soundsInfo : soundsInfo,
        soundsExts : soundsExts,
        getSounds : getSounds,
    };
})();
