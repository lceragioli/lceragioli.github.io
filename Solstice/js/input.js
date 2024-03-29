var input = (function() {

    var MOUSE_LEFT = 1;
    var MOUSE_MIDDLE = 2;
    var MOUSE_RIGHT = 3;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_ENTER = 13;
    var KEY_ESC = 27;
    var KEY_CTRL = 17;
    var KEY_SPACE = 32;


    function InputHandler(gm) {

        var mouseX = 0;
        var mouseY = 0;
        var mouseMoved = false;

        var mouseLeft = false;
        var mouseLeftPress = false;
        var mouseLeftRel = false;

        var mouseMiddle = false;
        var mouseMiddlePress = false;
        var mouseMiddleRel = false;

        var mouseRight = false;
        var mouseRightPress = false;
        var mouseRightRel = false;

        var key = [];
        var keyPress = [];
        var keyRel= [];
	
	
        window.addEventListener("keydown", function(e) {
	        if(!key[e.keyCode]){
		        keyPress[e.keyCode] = true;
		        key[e.keyCode] = true;
	        }
            if(e.keyCode == 80) {
                var canvas = game.getCanvas();
                if(!canvas.isFullscreen) {
                    if(canvas.webkitRequestFullScreen) {
                        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                    else {
                        canvas.mozRequestFullScreen();
                    }
                }
            }
        }, false);

        window.addEventListener("keyup", function(e) {
	        keyRel[e.keyCode] = true;
	        key[e.keyCode] = false; 
        }, false);

        window.addEventListener("mousemove", function(e) {
	        mouseMoved = true;
	        mouseX = Math.round(e.pageX - gm.getCanvas().offsetLeft );
	        mouseY = Math.round(e.pageY - gm.getCanvas().offsetTop );
        }, false);

        window.addEventListener("mousedown", function(e) { 
	        switch (e.which) {
	        case 1:
		        mouseLeft = true;
		        mouseLeftPress = true;
		        break; 
	        case 2:
		        mouseMiddle = true;
		        mouseMiddlePress = true;
		        break; 
	        case 3: 
		        mouseRight = true;
		        mouseRightPress = true;
		        break;
	        }
        }, false);

        window.addEventListener("mouseup", function(e) { 
	        switch (e.which) {
	        case 1: 
		        mouseLeft = false;
		        mouseLeftRel = true;
		        break; 
	        case 2: 
		        mouseMiddle = false;
		        mouseMiddleRel = true;
		        break; 
	        case 3: 
		        mouseRight = false;
		        mouseRightRel = true;
		        break;
	        }
        }, false);


        window.addEventListener("touchmove", function(s) {
	        mouseX = Math.round(s.pageX - gm.ctx.getCanvas().offsetLeft );
	        mouseY = Math.round(s.pageY - gm.ctx.getCanvas().offsetTop );
        }, false);

        window.addEventListener("touchstart", function(e) { 
	        mouseLeft = true;
	        mouseLeftPress = true;
        }, false);

        window.addEventListener("touchend", function() { 
	        mouseLeft = false;
	        mouseLeftRel = true;
        }, false);
         


        this.clear = function(){
	        mouseLeftPress = false;
	        mouseLeftRel = false;
	        mouseMiddlePress = false;
	        mouseMiddleRel = false;
	        mouseRightPress = false;
	        mouseRightRel = false;
	        mouseMoved = false; 
	        keyPress = [];
	        keyRel= [];
        };

        this.getKeyDown = function(k){
	        if(typeof(k) == "string"){
		        k = k.charCodeAt(0);
	        }
	        return (key[k] == true);
        };

        this.getKeyPress = function(k){
	        if(typeof(k) == "string"){
		        k = k.charCodeAt(0);
	        }
	        return (keyPress[k] == true);
        };

        this.getKeyRelease = function(k){
	        if(typeof(k) == "string"){
		        k = k.charCodeAt(0);
	        }
	        return (keyRel[k] == true);
        };

        this.getMouseDown = function(b){
	        if(b == 1) return mouseLeft;
	        if(b == 2) return mouseMiddle;
	        if(b == 3) return mouseRight;
        };

        this.getMousePress = function(b){
	        if(b == 1) return mouseLeftPress;
	        if(b == 2) return mouseMiddlePress;
	        if(b == 3) return mouseRightPress;
        };

        this.getMouseRelease = function(b){
	        if(b == 1) return mouseLeftRel;
	        if(b == 2) return mouseMiddleRel;
	        if(b == 3) return mouseRightRel;
        };

        this.getMouseX = function(){
            return mouseX;
        };

        this.getMouseY = function(){
            return mouseY;
        };

        this.mouseInsideRect = function(x, y, w, h){
	        return (mouseX >= x && mouseY >= y && mouseX <= x + w && mouseY <= y + h);
        };

        this.mouseInsideText = function(str, h1, h2, x, y){
	        var w = gm.getContext().measureText(str).width;
	        return (mouseX > x - w/2  && mouseY > y - h1 && mouseX < x + w/2  && mouseY < y + h2);
        };
    };

    return {
        InputHandler : InputHandler,
        MOUSE_LEFT : MOUSE_LEFT,
        MOUSE_MIDDLE : MOUSE_MIDDLE,
        MOUSE_RIGHT : MOUSE_RIGHT,
        KEY_LEFT : KEY_LEFT,
        KEY_RIGHT : KEY_RIGHT,
        KEY_UP : KEY_UP,
        KEY_DOWN : KEY_DOWN,
        KEY_ENTER : KEY_ENTER,
        KEY_ESC : KEY_ESC,
        KEY_CTRL : KEY_CTRL,
        KEY_SPACE : KEY_SPACE
    };
})();




