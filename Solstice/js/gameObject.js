var gameObject = (function() {

    /*  Interface   */

    function Key(x, y, z, n) {

        var maxKey = 3;
        var n = (typeof n !== 'undefined' && n >= 0 && n <= maxKey) ? n : 0;
        var sound = audio.getSounds().pickedKey.audio;

        this.name = "key" + n;
        this.role = POWERUP;

        this.solid = false;
        this.picked = false;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);

        this.size = {x: 14, y: 14, z: 8};

        this.visible = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.width = Math.floor(sprite.getSprites()["key" + n].img.width / sprite.getSprites()["key" + n].frameNum);
        this.height = sprite.getSprites()["key" + n].img.height;
        this.sprite = sprite.getSprites()["key" + n];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.makeVisible = function() {
            /*  Volutamente lasciato vuoto  */
        };

        this.reset = function() {
            this.moveTo(x, y, z);
        };

        this.update = function() {
            var preview = this.view;

            var plr = game.getPlayer();
            if(this.inside(plr) && !this.picked) {

                switch(n) {
                    case 0: 
                        plr.doubleJump = true;
                        break;
                    case 1: 
                        //plr.light = {x: plr.x, y: plr.y, z: plr.z + 35, radius: 66};
                        plr.torch = true;
                        break;
                    case 2: 
                        plr.seeHide = true;
                        break;
                    case 3: 
                        plr.thrust = true;
                        break;
                    default:                         
                };

                this.picked = true;
                this.visible = false;

                sound.load();
                sound.play();
            }

            this.v.z -= this.gravity;
            var hit = this.updatePosition();
            this.updateClipRect(preview);
        };
    };

    function Zombie(x, y, z) {

        this.name = "zombie";
        this.role = ENEMY;

        this.solid = true;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);

        this.v = {x: 0, y: 1, z: 0};
        this.size = { x: 30, y: 30, z: 50 };
        this.state = "Walk";
        this.timeToWalk = 10;

        this.visible = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.width = Math.floor(sprite.getSprites()["zombieWalkF"].img.width / sprite.getSprites()["zombieWalkF"].frameNum);
        this.height = sprite.getSprites()["zombieWalkF"].img.height;
        this.sprite = sprite.getSprites()["zombieWalkF"];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.moveTo(x, y, z);
            this.v = { x: 0, y: 1, z: 0 };
            this.timeToWalk = 10;
            this.state = "Walk";
        };

        this.update = function() {
            if(game.getPlayer().inside(this)) {
                    game.getPlayer().kill();
            }
            else {
                var preview = this.view;
                this.v.z -= this.gravity;

                if(this.state == "Walk") {
                    this.updateVelocity();
                    this.timeToWalk = 10;
                }
                else {
                    this.timeToWalk--;
                    if (this.timeToWalk == 0) {
                        this.state = "Walk";
                        this.v.x = 0;
                        this.v.y = 0;
                        this.timeToWalk = 10;
                    }
                }
                this.updateDirection();
                var hit = this.updatePosition();
                if((hit.x != null && hit.x.name == "player") ||
                   (hit.y != null && hit.y.name == "player") ||
                   (hit.z != null && hit.z.name == "player")) {
                        game.getPlayer().kill();
                }
                this.sprite = sprite.getSprites()["zombie" + this.state + this.direction.side];
                if(this.state == "Pushed" && this.frame >= sprite.getSprites()["zombiePushedF"].frameNum) {
                    this.frame = 0;
                }
               
                if(Math.floor(Math.abs(this.v.z)) == 0) {
                    this.updateAnimation();
                }
                this.updateClipRect(preview);
            }
        };

        this.updateVelocity = function() {
            var plr = game.getPlayer();
            var dx = Math.floor(Math.abs(plr.x - this.x) / 22);
            var dy = Math.floor(Math.abs(plr.y - this.y) / 22);

            if((dx != 0 && dy == 0) || (dx > dy)) {
                this.v.y = Math.max(0, this.v.y - 1);
                if(plr.x < this.x) {
                    this.v.x = Math.max(-1, this.v.x - 1);
                }
                else {
                    this.v.x = Math.min(1, this.v.x + 1);
                }
            }
            else {
                this.v.x = Math.max(0, this.v.x - 1);
                if(plr.y < this.y) {
                    this.v.y = Math.max(-1, this.v.y - 1);
                }
                else {
                    this.v.y = Math.min(1, this.v.y + 1);
                }
            }
        };
    };

    function Goblin(x, y, z, pts) {

        this.i = 0;

        this.name = "goblin";
        this.role = ENEMY;

        this.solid = true;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);

        this.v = {x: 0, y: 2, z: 0};
        this.size = {x: 30, y: 30, z: 38};
        this.light = {x: this.x, y: this.y, z: this.z + 25, radius: 40};

        this.visible = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.width = Math.floor(sprite.getSprites()["goblinF"].img.width / sprite.getSprites()["goblinF"].frameNum);
        this.height = sprite.getSprites()["goblinF"].img.height;
        this.sprite = sprite.getSprites()["goblinF"];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.moveTo(x, y, z);
            this.v = {x: 0, y: 1, z: 0};
        };

        this.update = function() {
            if(game.getPlayer().inside(this)) {
                    game.getPlayer().kill();
            }
            else {
                var preview = this.view;
                this.v.z -= this.gravity;

                this.updateVelocity();

                var hit = this.updatePosition();
                if((hit.x != null && hit.x.name == "player") ||
                   (hit.y != null && hit.y.name == "player") ||
                   (hit.z != null && hit.z.name == "player")) {
                        game.getPlayer().kill();
                }
                this.updateDirection();
                this.sprite = sprite.getSprites()["goblin" + this.direction.side];
                
                this.updateAnimation();
                this.updateClipRect(preview);
            }
        };

        this.updateVelocity = function() {
            if(pts[this.i].x != this.x) {
                this.v.y = 0;
                if(pts[this.i].x < this.x) {
                    this.v.x = -1;
                }
                else {
                    this.v.x = 1;
                }
            }
            else if(pts[this.i].y != this.y) {
                this.v.x = 0;
                if(pts[this.i].y < this.y) {
                    this.v.y = -1;
                }
                else {
                    this.v.y = 1;
                }
            }
            else {
                this.i = (this.i + 1) % pts.length;
            }    
        };
    };

    function Ghost(x, y, z) {

        this.name = "ghost";
        this.role = ENEMY;

        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);

        this.v = {x: 0, y: 1, z: 0};
        this.size = {x: 30, y: 30, z: 50};

        this.time2hide = 250;
        this.visible = true;
        this.solid = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.state = "Walk";
        this.timeToWalk = 10;

        this.width = Math.floor(sprite.getSprites()["ghostWalkF"].img.width / sprite.getSprites()["ghostWalkF"].frameNum);
        this.height = sprite.getSprites()["ghostWalkF"].img.height;
        this.sprite = sprite.getSprites()["ghostWalkF"];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.moveTo(x, y, z);
            this.v = {x: 0, y: 1, z: 0};
            this.makeVisible();
            this.timeToWalk = 10;
            this.state = "Walk";
        };
        
        this.makeVisible = function () {
            this.time2hide = 250;
            this.visible = true;            
        }

        this.update = function () {
            if(game.getPlayer().inside(this)) {
                    game.getPlayer().kill();
            }
            else {
                if(this.time2hide == 0) {
                    this.visible = !this.visible;
                    this.time2hide = this.visible ? 250 : 750;                
                }
                else {
                    this.time2hide--;                
                }
                var preview = this.view;
                this.v.z -= this.gravity;

                if (this.state == "Walk") {
                    this.updateVelocity();
                    this.timeToWalk = 10;
                }
                else {
                    this.timeToWalk--;
                    if (this.timeToWalk == 0) {
                        this.state = "Walk";
                        this.v.x = 0;
                        this.v.y = 0;
                        this.timeToWalk = 10;
                    }
                }
                this.updateDirection();
                var hit = this.updatePosition();
                if((hit.x != null && hit.x.name == "player") ||
                   (hit.y != null && hit.y.name == "player") ||
                   (hit.z != null && hit.z.name == "player")) {
                        game.getPlayer().kill();
                }
                this.sprite = sprite.getSprites()["ghost" + this.state + this.direction.side];
                if (this.state == "Pushed" && this.frame >= sprite.getSprites()["zombiePushedF"].frameNum) {
                    this.frame = 0;
                }
                this.updateAnimation();
                this.updateClipRect(preview);
            }
        };

        this.updateVelocity = function() {
            var plr = game.getPlayer();
            var dx = Math.floor(Math.abs(plr.x - this.x) / 22);
            var dy = Math.floor(Math.abs(plr.y - this.y) / 22);

            if((dx != 0 && dy == 0) || (dx > dy)) {
                this.v.y = Math.max(0, this.v.y - 1);
                if(plr.x < this.x) {
                    this.v.x = Math.max(-1, this.v.x - 1);
                }
                else {
                    this.v.x = Math.min(1, this.v.x + 1);
                }
            }
            else {
                this.v.x = Math.max(0, this.v.x - 1);
                if(plr.y < this.y) {
                    this.v.y = Math.max(-1, this.v.y - 1);
                }
                else {
                    this.v.y = Math.min(1, this.v.y + 1);
                }
            }
        };
    };

    function Enemy(x, y, z, v) {

        var v = v != undefined ? v : {x: 2, y: 0, z: 0};

        this.name = "enemy";
        this.role = ENEMY;

        this.solid = true;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);
        this.v = v;

        this.state = "Walk";
        this.timeToWalk = 10;

        this.vi = {x: v.x, y: v.y, z: v.z};

        this.size = { x: 30, y: 30, z: 50 };

        this.visible = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.width = Math.floor(sprite.getSprites()["enemyWalkF"].img.width / sprite.getSprites()["enemyWalkF"].frameNum);
        this.height = sprite.getSprites()["enemyWalkF"].img.height;
        this.sprite = sprite.getSprites()["enemyWalkF"];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.moveTo(x, y, z);
            this.v.x = this.vi.x;
            this.v.y = this.vi.y;
            this.v.z = this.vi.z;
            this.timeToWalk = 10;
            this.state = "Walk";
        };

        this.update = function() {
            var preview = this.view;
            this.v.z -= this.gravity;

            var vel = { x: this.v.x, y: this.v.y };

            this.updateDirection();
            var hit = this.updatePosition();
            if((hit.x != null && hit.x.name == "player") ||
               (hit.y != null && hit.y.name == "player") ||
               (hit.z != null && hit.z.name == "player")) {
                   game.getPlayer().kill();
            }

            if(this.state == "Pushed") {
                this.timeToWalk--;
                if(this.timeToWalk == 0) {
                    this.state = "Walk";
                    this.timeToWalk = 10;
                }
            }
            else if ((hit.x != null || hit.y != null) && this.state == "Walk") {
                this.v.x = vel.y;
                this.v.y = -vel.x;
                this.timeToWalk = 10;
            }

            if (this.v.x == 0 && this.v.y == 0) {
                this.v.x = vel.x;
                this.v.y = vel.y;
            }

            this.sprite = sprite.getSprites()["enemy" + this.state + this.direction.side];
            if(this.state == "Pushed" && this.frame >= sprite.getSprites()["enemyPushedF"].frameNum) {
                this.frame = 0;
            }
            
            this.updateAnimation();
            this.updateClipRect(preview);
        };
    };

    function Platform(x, y, z, v, visible) {

        this.name = "platform";
        this.role = ENV;

        this.solid = true;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);
        this.v = (typeof v !== 'undefined') ? v : {x: 0, y: 2, z: 0};

        this.vi = {x: this.v.x, y: this.v.y, z: this.v.z};

        this.size = {x: 22, y: 22, z: 8};

        this.visible = (typeof visible === 'boolean') ? visible : true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.width = Math.floor(sprite.getSprites()["Platform"].img.width);
        this.height = sprite.getSprites()["Platform"].img.height;
        this.sprite = sprite.getSprites()["Platform"];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width/2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.moveTo(x, y, z);
            this.v.x = this.vi.x;
            this.v.y = this.vi.y;
            this.v.z = this.vi.z;
            this.visible = (typeof visible === 'boolean') ? visible : true;
        };

        this.update = function() {

            var hitObj = null;
            var hitObjs = [];
            var pt = {name: this.name, x: this.x, y: this.y, z: this.z + this.size.z + 2, size: {x: this.size.x, y: this.size.y, z: 3}};

            hitObj = game.getHitObj(pt);
            if(hitObj != null) {
                vel = { x: hitObj.v.x, y: hitObj.v.y, z: hitObj.v.z };

                hitObj.v.x = this.v.x;
                hitObj.v.y = this.v.y; 
                hitObj.v.z = this.v.z;

                hitObj.updatePosition();

                hitObj.v = vel;
            }

            var preview = this.view;
            var vel = {x: this.v.x, y: this.v.y, z: this.v.z};

            var hit = this.updatePosition();

            if(hit.x != null || hit.y != null || hit.z != null ||
               this.z > stage.Zmax || this.x > stage.Xmax || this.y > stage.Ymax ||
               this.z < 0 || this.x < 0 || this.y < 0) {
                    this.v.x = -vel.x;
                    this.v.y = -vel.y;
                    this.v.z = -vel.z;
            }
            
            this.updateClipRect(preview);
        };
    };

    function Fire(x, y, z) {

        var minRadius = 40;
        var deltaRadius = 10;

        this.name = "fire";
        this.role = ENV;

        this.solid = false;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);
        this.v = {x: 0, y: 0, z: 0};
        this.to = null;

        this.size = {x: 8, y: 8, z: 15};

        this.visible = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);
        this.light = {x: this.x, y: this.y, z: this.z + 2, radius: 40};
        this.nextRadius = minRadius + Math.random()*deltaRadius;
        this.timeToRadius = 2;

        this.width = Math.floor(sprite.getSprites()["fireLit"].img.width / sprite.getSprites()["fireLit"].frameNum);
        this.height = sprite.getSprites()["fireLit"].img.height;
        this.sprite = sprite.getSprites()["fireLit"];
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.moveTo(x, y, z);
        };

        this.update = function() {
            var preview = this.view;

            if(this.to != null) {
                this.moveTo(this.to.x, this.to.y, this.to.z);
                this.to = null;
            }
            else {
                this.updateVelocity();
                this.updatePosition();
            
                this.updateAnimation();
            }
            if(this.timeToRadius == 0) {
                this.light.radius = this.nextRadius;
                this.nextRadius = minRadius + Math.random()*deltaRadius;
                this.timeToRadius = 5;
            } else {
                this.timeToRadius--;
                this.light.radius += Math.floor(Math.abs(this.nextRadius - this.light.radius)/5);
            }
            this.updateClipRect(preview);
        };
        
        this.updateVelocity = function () {
            this.v.x = this.v.x < 0 ? Math.min(this.v.x + 0.1, 0) : Math.max(this.v.x - 0.1, 0);
            this.v.y = this.v.y < 0 ? Math.min(this.v.y + 0.1, 0) : Math.max(this.v.y - 0.1, 0);
        };

        this.updateAnimation = function() {
            var animSpedd = 0.2;

            this.animFrame += animSpedd;
            this.frame = Math.floor(this.animFrame) % this.sprite.frameNum;       
        };
    };
    
    function Spine(x, y, z) {
        
        var letal = {x: x, y: y, z: z + 11,
                        size: {x: 22, y: 22, z: 12}};

        this.name = "Spine";
        this.role = ENV;

        this.x = x;
        this.y = y;
        this.z = z;
        this.size = {x: 22, y: 22, z: 22};
        this.solid = true;
        this.visible = true;

        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);
        this.width = Math.floor(sprite.getSprites()["Spine"].img.width / sprite.getSprites()["Spine"].frameNum);
        this.height = sprite.getSprites()["Spine"].img.height;
        this.sprite = sprite.getSprites()["Spine"];

        this.update = function() {
            if(game.getPlayer().inside(letal)) {
                game.getPlayer().kill();
            }
        };
    };

    function Gate(x, y, z, stageTo, xTo, yTo, zTo) {

        this.name = "gate";
        this.role = GATE;
        
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = {x: 22 * 3, y: 22 * 3, z: 22 * 3};

        this.sprite = sprite.getSprites()["Gate"];
        this.width = Math.floor(sprite.getSprites()["Gate"].img.width);
        this.height = sprite.getSprites()["Gate"].img.height;

        this.view = {};
        this.view.x = stage.w2v(this.x, this.y, this.z).x;
        this.view.y = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z).y - 1;  /*    -1 per alone luminoso non conteggiato nella dim dell'GameObject     */
     
        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };
        
        this.update = function() {
            if(this.inside(game.getPlayer())) {
                if(stageTo == "win") {
                    game.win();
                }
                else {
                    game.getPlayer().moveTo(xTo, yTo, zTo);
                    game.loadStage(stages.getStages()[stageTo]);
                }
            }
        };

        this.makeVisible = function () {
            /*   volutamente lasciato vuoto   */
        }        
    };

    function Player(inputH, x, y, z) {

        this.name = "player";

        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);
        this.solid = true;
        this.size = {x: 30, y: 30, z: 50};
        this.v = {x: 0, y: 0, z: 0};
        this.jumpVel = 6;
        this.alive = true;

        /*  Powerup */
        this.doubleJump = false;
        this.torch = false;
        this.seeHide = false;
        this.thrust = false;

        var time2boring = 230;
        var vmax = 3;
        var vmin = -3;
        var animSpeed = 0;
        var animFrame = 0;
        var state = "Still";
        var jumpNum = 0;
        var targetObject = null;
        var firesNum = 0;
        var fires = [];
        var fireSound = audio.getSounds().fire.audio;
        var spell1Sound = audio.getSounds().spell1.audio;
        var spell2Sound = audio.getSounds().spell2.audio;
        spell2Sound.load();
        spell2Sound.loop = true;


        this.visible = true;
        this.view = stage.w2v(this.x - this.size.x/2, this.y - this.size.y/2, this.z + this.size.z);

        this.width = Math.floor(sprite.getSprites()["mageStillF"].img.width / sprite.getSprites()["mageStillF"].frameNum);
        this.height = sprite.getSprites()["mageStillF"].img.height;
        this.sprite = sprite.getSprites()["mageStillF"];

        this.clipRect = {
            x : this.view.x - Math.ceil(this.width / 2) - 1,
            y : this.view.y - 1,
            width : this.width + 3,
            height : this.height + 2
        };

        this.reset = function() {
            this.alive = true;
            this.v = {x: 0, y: 0, z: 0};
            state = "Still";
            this.frame = 0;
            game.restoreCheckpoint();
            this.semiReset();
        };
        
        this.semiReset = function() {
            firesNum = 0;            
            fires = [];        
        };

        this.kill = function() {
            this.alive = false;
            this.sprite = sprite.getSprites().mageDeath;
            this.frame = 0;
            animFrame = 0;
            animSpeed = 0.1;

            game.pauseMusic();
            var scream = audio.getSounds().playerDie.audio;
            scream.load();
            scream.play();            
        };

        this.update = function() {

            if(inputH.getKeyPress("H") && this.alive) {
                this.kill();
            }
            /*if(inputH.getKeyDown(" ")) {  //    showState solo per il debug
                //this.showState();
                //game.win();
            }*/

            if(this.alive) {
                this.updateVelocity();

                var exX = this.x;
                var exY = this.y;
                var preview = this.view;
                var hit = this.updatePosition();
                this.updateClipRect(preview);

                if( (hit.x != null && hit.x.role == ENEMY) ||
                    (hit.y != null && hit.y.role == ENEMY) ||                
                    (hit.z != null && hit.z.role == ENEMY)) {
                        this.kill();
                }
                else {

                    this.updateState();

                    /*  animationSpeed update  */
                    var vtotO = Math.abs(this.v.x) + Math.abs(this.v.y) + Math.abs(this.v.z);

                    if(vtotO >= 1) {
                        animSpeed = vtotO / (3 * vmax);
                    }
                    else if(state != "Ready") {
                        animSpeed = 0.02;
                    }

                    this.updateEffectFrame();
                                        

                    /*  animation update    */


                    this.updateDirection();

                    if(state == "Bored") {
                        this.sprite = sprite.getSprites()["mage" + state];
                    }
                    else {
                        this.sprite = sprite.getSprites()["mage" + state + this.direction.side];
                    }

                    if(state != "Ready") {
                        animFrame = animFrame + animSpeed;
                        if(state == "Bored") {
                            if(time2boring < 30) {
                                this.frame = 2;
                                if(time2boring == 0) {
                                    time2boring = 230;
                                }
                            }
                            else {
                                this.frame = Math.floor(animFrame) % (this.sprite.frameNum - 1);
                            }
                        }
                        else {
                            this.frame = Math.floor(animFrame) % this.sprite.frameNum;
                        }
                    }
                    else {
                        if(inputH.getKeyDown("M")) {
                            this.frame = 2;
                        }
                        else if(inputH.getKeyDown("W") || inputH.getKeyDown("S")) {
                            this.frame = 1;
                        } 
                        else {            
                            this.frame = 0;
                        }
                    
                    }
                
                    /*  stage update    */

                    if(this.z <= 0 && game.getStage().under) {
                        this.moveTo(exX, exY, stage.Zmax - 7);                        
                        game.loadStage(stages.getStages()[game.getStage().under]);
                        this.updateClipRect(preview);
            			this.v.x = 0;
			            this.v.y = 0;
                        this.setState("Fall");
                    }
                    if(this.z >= stage.Zmax - 5 && game.getStage().over) {
                        this.moveTo(exX, exY, 1);                        
                        game.loadStage(stages.getStages()[game.getStage().over]);
                        this.v.z = this.jumpVel;
			            this.v.x = 0;
			            this.v.y = 0;
                        this.setState("Jump");  /*  it disables flying wizard cheat */
                    }
                
                    this.doAction();
                }
            }
            else {
                /*  the mage is dead    */
                animFrame = animFrame + animSpeed;
                this.frame = Math.floor(animFrame) % this.sprite.frameNum;
                if(animFrame > this.sprite.frameNum) {
                    this.reset();
                }
            }
        };
        
        this.doAction = function () {
            if(state == "Ready") {
                if(this.seeHide && inputH.getKeyPress("M")) {
                    this.effect = "blink";
                    spell1Sound.load();
                    spell1Sound.play(); 

                    var gos = game.getGameObjects();
                    var i = gos.length - 1;
                    for(; i >= 0; i--) {
                        if(gos[i].makeVisible != null) {
                            gos[i].makeVisible();
                           }
                    }
                }
                else if(this.thrust && inputH.getKeyDown("W")) {
                    this.effect = "burn";
                    spell2Sound.play(); 

                    targetObject = null;
                    var gos = game.getGameObjects();
                    var i = gos.length - 1;
                    for(; i >= 0; i--) {
                        if(gos[i].role == ENEMY && 
                            ( 
                                (((this.direction == plusX  && gos[i].x > this.x && 
                                Math.abs(gos[i].y - this.y) <= this.size.y) && Math.abs(gos[i].z - this.z) <= this.size.z/2) && 
                                (targetObject == null || targetObject.x > gos[i].x)) 
                           ||
                                (((this.direction == minusX && gos[i].x < this.x && 
                                Math.abs(gos[i].y - this.y) <= this.size.y) && Math.abs(gos[i].z - this.z) <= this.size.z/2) && 
                                (targetObject == null || targetObject.x < gos[i].x)) 
                           ||
                                (((this.direction == plusY  && gos[i].y > this.y && 
                                Math.abs(gos[i].x - this.x) <= this.size.x) && Math.abs(gos[i].z - this.z) <= this.size.z/2) && 
                                (targetObject == null || targetObject.y > gos[i].y)) 
                           ||
                                (((this.direction == minusY && gos[i].y < this.y && 
                                Math.abs(gos[i].x - this.x) <= this.size.x) && Math.abs(gos[i].z - this.z) <= this.size.z/2) && 
                                (targetObject == null || targetObject.y < gos[i].y)))) {
                                        targetObject = gos[i];
                           }
                    }
                    if(targetObject != null) {
                        if(     this.direction == plusX ) { targetObject.v = {x:  2, y:  0, z: 0}; }
                        else if(this.direction == minusX) { targetObject.v = {x: -2, y:  0, z: 0}; }
                        else if(this.direction == plusY ) { targetObject.v = {x:  0, y:  2, z: 0}; }
                        else if (this.direction == minusY) { targetObject.v = { x: 0, y: -2, z: 0 }; }
                        targetObject.state = "Pushed";
                        targetObject.timeToWalk = 10;
                    }
                }
                else if(this.torch && inputH.getKeyPress("S")) {

                    if(fires[firesNum] != null) {
                        fires[firesNum].to = {x: this.x, y: this.y, z: this.z + this.size.z * 2 / 3};
                    }
                    else {                
                        var fr = new Fire(this.x, this.y, this.z + this.size.z * 2 / 3);
                        fires[firesNum] = fr;
                        game.getGameObjects().push(fr);                
                    }
                    fireSound.load();
                    fireSound.play();     

                    switch(this.direction) {
                        case plusX: 
                            fires[firesNum].v.x = 4;
                            break;
                        case plusY: 
                            fires[firesNum].v.y = 4;
                            break;
                        case minusX: 
                            fires[firesNum].v.x = -4;
                            break;
                        default: 
                            fires[firesNum].v.y = -4;
                    };

                    firesNum = (firesNum + 1) % 3;
                } 
                else if(this.seeHide && inputH.getKeyDown("M")){
                    this.effect = 'blink';  /*  continua a blinkare     */
                }
                else {
                    this.effect = null;
                    spell2Sound.pause();
                }
            } 
            else {
                this.effect = null;
                spell2Sound.pause();                     
            }
        };

        this.updateVelocity = function() {

            if(state != "Ready") {

                if(inputH.getKeyPress("M")) {
                    if((Math.ceil(this.v.z) == 0 && jumpNum == 0) || (this.doubleJump && jumpNum <= 1)) {
                        this.v.z = this.jumpVel;
                        jumpNum++;
                    }
                }
                else {
                    if(this.v.z > 3*vmin) {
                        this.v.z -= this.gravity;
                    }
                }

                if(inputH.getKeyDown("W")) {
                    if(this.v.y != 0) {
                        this.v.x = - Math.abs(this.v.y);
                        this.v.y = 0;
                    }
                    else if(this.v.x > 0) {
                        this.v.x = 0;
                    }
                    else {            
                        this.v.x = vmin;
                    }
                }
                else if(inputH.getKeyDown("S")) {
                    if(this.v.y != 0) {
                        this.v.x = Math.abs(this.v.y);
                        this.v.y = 0;
                    }
                    else if(this.v.x < 0) {
                        this.v.x = 0;
                    }
                    else {            
                        this.v.x = vmax;
                    }
                }
                else if(inputH.getKeyDown("A")) {
                    if(this.v.x != 0) {
                        this.v.y = - Math.abs(this.v.x);
                        this.v.x = 0;
                    }
                    else if(this.v.y > 0) {
                        this.v.y = 0;
                    }
                    else {            
                        this.v.y = vmin;
                    }
                }
                else if(inputH.getKeyDown("D")) {
                    if(this.v.x != 0) {
                        this.v.y = Math.abs(this.v.x);
                        this.v.x = 0;
                    }
                    else if(this.v.y < 0) {
                        this.v.y = 0;
                    }
                    else {            
                        this.v.y = vmax;
                    }
                }
                else {
                    this.v.x = 0;
                    this.v.y = 0;
                }
            }
        };

        this.updateState = function() {
            switch(state) {
                case "Still":
                    if(inputH.getKeyPress("M")) {
                            this.setState("Jump");
                    }
                    else if(Math.ceil(this.v.z) <= -1) {
                            this.setState("Fall");
                    }
                    else if(inputH.getKeyDown("N")) {
                            this.setState("Ready");
                    }
                    else if(inputH.getKeyDown("W") || 
                       inputH.getKeyDown("A") ||
                       inputH.getKeyDown("S") ||
                       inputH.getKeyDown("D")) {
                            this.setState("Walk");
                    }
                    else if(time2boring == 0) {
                            this.setState("Bored");
                    }
                    else {
                            time2boring--;
                    }
                    break;
                case "Bored":
                    if(inputH.getKeyPress("M")) { 
                            this.setState("Jump");
                    }
                    else if(this.v.z <= -1) {
                            this.setState("Fall");
                    }
                    else if(inputH.getKeyDown("N")) {
                            this.setState("Ready");
                    }
                    else if(inputH.getKeyPress("W") || 
                       inputH.getKeyPress("A") ||
                       inputH.getKeyPress("S") ||
                       inputH.getKeyPress("D")) {
                            this.setState("Walk");
                    }
                    else {
                            time2boring--;
                    }
                    break;
                case "Ready":
                    if(!inputH.getKeyDown("N")) {
                        this.setState("Still");
                    }
                    break;
                case "Jump":
                    if(Math.ceil(this.v.z) <= -1) {
                            this.setState("Fall");
                    }
                    break;
                case "Fall":
                    if(this.v.z == 0) {
                        if(this.v.x == 0 && this.v.y == 0) {
                            this.setState("Still");
                        }
                        else {
                            this.setState("Walk");
                        }
                    }
                    break;
                case "Walk":
                    if(inputH.getKeyPress("M")) { 
                            this.setState("Jump");
                    }
                    else if(this.v.x == 0 && this.v.y == 0) {
                            this.setState("Still");
                    }
                    else if(Math.ceil(this.v.z) <= -1) {
                            this.setState("Fall");
                    }
                    break;
                default:
                    alert(state + " : is not a correct state");
            }
        };

        this.setState = function(newState) {
            state = newState;
            this.frame = 0;
            time2boring = 230;
            if(newState == "Ready") {   /*  it disables magic glide cheat   */
                this.v.x = 0;
                this.v.y = 0;
            }            
            if(newState == "Bored") {
                time2boring = 430;
                direction = plusX;
            }
            if(newState != "Jump") {
                if(newState != "Fall") {
                    jumpNum = 0;
                }
                else {
                    jumpNum = Math.max(1, jumpNum);
                }
            }
        };
    };

    /*  Implementation  */

    /*  Direction Values    */
    var plusX = {side: "F", scaling: 1};
    var minusX = {side: "B", scaling: 1};
    var plusY = {side: "F", scaling: -1};
    var minusY = {side: "B", scaling: -1};
    
    var ENEMY = 0;
    var GATE = 1;
    var POWERUP = 2;
    var ENV = 3;

    function GameObject() {

        var vmax = 4;

        this.name = "unnamed";

        this.solid = false;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.light = null;

        this.size = {x: 0, y: 0, z: 0};
        this.v = {x: 0, y: 0, z: 0};
        this.gravity = 0.4;

        this.visible = false;
        this.view = {x: 0, y: 0};
        this.clipRect = null;

        this.effect = null;        
        this.effectFrame = 0;
        
        this.width = 0;
        this.height = 0;
        this.frame = 0;
        this.direction = plusX;
        this.animFrame = 0;

        this.reset = function() {};
        this.update = function() {};

        this.draw = function(ctx) {
            if(this.visible) {
                this.show(ctx);
            }
        };

        this.show = function(ctx) {
            ctx.save();

            ctx.scale(this.direction.scaling, 1);
            var ox = Math.floor(this.frame) * this.width;
            
            ctx.drawImage(  this.sprite.img, ox, 0,
                            Math.ceil(this.width), Math.ceil(this.height),
                            this.direction.scaling * Math.floor(this.view.x - ((this.direction.scaling - 1)*this.width + this.width)/2), 
                            Math.floor(this.view.y),
                            Math.ceil(this.width), Math.ceil(this.height));

            if(this.effect) {
                
                var effectWidth = Math.floor(sprite.getSprites()[this.effect].img.width / sprite.getSprites()[this.effect].frameNum);
                var effectHeight = sprite.getSprites()[this.effect].img.height;

                var bx = Math.floor(this.effectFrame) * effectWidth;
                if(this.effect == "burn") {
                    var dx = (this.direction.side == "F") ? -7 : 32;
                    var dy = (this.direction.side == "F") ?  6 : 8 ;
                }
                else {
                    var dx = (this.direction.side == "F") ? -4 : 32;
                    var dy = (this.direction.side == "F") ? -9 : 2 ;
                }

                ctx.drawImage(  sprite.getSprites()[this.effect].img, bx, 0,
                            effectWidth, effectHeight,
                            this.direction.scaling * Math.floor(this.view.x - ((this.direction.scaling - 1)*this.width + this.width)/2) + dx, 
                            Math.floor(this.view.y) + dy,
                            Math.ceil(effectWidth), effectHeight);
            }

            ctx.restore();
        };

        this.updateClipRect = function(preview) {
            if(this.visible) {
                var dx = (this.effect != null) ? Math.floor(sprite.getSprites()[this.effect].img.width / sprite.getSprites()[this.effect].frameNum) : 0;
                var dy = (this.effect != null) ? sprite.getSprites()[this.effect].img.height : 0;

                this.view = stage.w2v(Math.floor(this.x - this.size.x/2), Math.floor(this.y - this.size.y/2), this.z + this.size.z);
                this.clipRect.x = Math.min(this.view.x, preview.x) - Math.ceil(this.width/2) - 2 - dx;
                this.clipRect.y = Math.min(this.view.y, preview.y) - 2 - dy;
                this.clipRect.width = Math.abs(this.view.x - preview.x) + this.width + 6 + 2*dx;
                this.clipRect.height = Math.abs(this.view.y - preview.y) + this.height + 6 + 2*dy;
            };
        };

        this.updateDirection = function() {
            if(this.v.x != 0) {
                if(this.v.x > 0) {
                    this.direction = plusX;
                }
                else {
                    this.direction = minusX;
                }
            }
            else if(this.v.y != 0) {
                if(this.v.y > 0) {
                    this.direction = plusY;
                }
                else {
                    this.direction = minusY;
                }
            }
        };

        this.inside = function(obj) {

            return ((Math.between(obj.x  - Math.floor(obj.size.x/2) , this.x - Math.floor(this.size.x/2), this.x + Math.floor(this.size.x/2))   ||
                     Math.between(obj.x  + Math.floor(obj.size.x/2) , this.x - Math.floor(this.size.x/2), this.x + Math.floor(this.size.x/2))   ||
                     Math.between(this.x - Math.floor(this.size.x/2), obj.x  - Math.floor(obj.size.x/2) , obj.x  + Math.floor(obj.size.x/2))    ||
                     Math.between(this.x + Math.floor(this.size.x/2), obj.x  - Math.floor(obj.size.x/2) , obj.x  + Math.floor(obj.size.x/2))    )
                   &&
                    (Math.between(obj.y  - Math.floor(obj.size.y/2) , this.y - Math.floor(this.size.y/2), this.y + Math.floor(this.size.y/2))   ||
                     Math.between(obj.y  + Math.floor(obj.size.y/2) , this.y - Math.floor(this.size.y/2), this.y + Math.floor(this.size.y/2))   ||
                     Math.between(this.y - Math.floor(this.size.y/2), obj.y  - Math.floor(obj.size.y/2) , obj.y  + Math.floor(obj.size.y/2))    ||
                     Math.between(this.y + Math.floor(this.size.y/2), obj.y  - Math.floor(obj.size.y/2) , obj.y  + Math.floor(obj.size.y/2))    )
                   &&
                    (Math.between(obj.z                             , this.z                            , this.z + this.size.z)                 ||
                     Math.between(obj.z + obj.size.z                , this.z                            , this.z + this.size.z)                 ||
                     Math.between(this.z                            , obj.z                             , obj.z  + obj.size.z)                  ||
                     Math.between(this.z + this.size.z              , obj.z                             , obj.z  + obj.size.z)                  )
                   );
        }

        this.move = function(x, y, z) {
            var ix = x > 0 ? Math.floor(x) : Math.ceil(x);
            var iy = y > 0 ? Math.floor(y) : Math.ceil(y);
            var iz = z > 0 ? Math.floor(z) : Math.ceil(z);


            this.x += ix;
            this.y += iy;
            this.z += iz;

            if(this.light != null) {
                this.light.x += ix;
                this.light.y += iy;
                this.light.z += iz;
            }
        };

        this.moveTo = function(x, y, z) {
            var preview = this.view;

            this.move(x - this.x, y - this.y, z - this.z);
            this.updateClipRect(preview);
        };

        this.updatePosition = function() {
            var actualStage = game.getStage();

            var i;
            var pt;
            var hitCell;
            var hitObj;
            var hit = {x: null, y: null, z: null};
            var stage = game.getStage();

            if(Math.floor(Math.abs(this.v.z)) != 0) {

                this.move(0, 0, this.v.z);

                hitCell = stage.getHitCell(this);
                if(hitCell != null) {
                    if(this.v.z > 0) {
                        this.move(0, 0, Math.max(- this.v.z, hitCell.z - this.z - this.size.z - 1));
                    }
                    else {
                        this.move(0, 0, Math.min(- this.v.z, hitCell.z + hitCell.size - this.z + 1));
                    }
                    this.v.z = 0;
                    hit.z = hitCell;
                }

                if(this.solid) {
                    hitObj = game.getHitObj(this);
                    if(hitObj != null) {
                        if(this.v.z > 0) {
                            this.move(0, 0, Math.max(- this.v.z, hitObj.z - this.z - this.size.z - 1));
                        }
                        else {
                            this.move(0, 0, Math.min(- this.v.z, hitObj.z + hitObj.size.z - this.z + 1));
                        }
                        this.v.z = 0;
                        hit.z = hitObj;
                    }
                }
            }

            if(Math.floor(Math.abs(this.v.y)) != 0) {
                this.move(0, this.v.y, 0);

                hitCell = stage.getHitCell(this);
                if(hitCell != null) {
                    if(this.v.y > 0) {
                        this.move(0, Math.max(- this.v.y, hitCell.y - this.y - this.size.y/2 - 1), 0);
                    }
                    else {
                        this.move(0, Math.min(- this.v.y, hitCell.y + hitCell.size - this.y + this.size.y/2 + 1), 0);
                    }
                    this.v.y = 0;
                    hit.y = hitCell;
                }
                
                if(this.solid) {                
                    hitObj = game.getHitObj(this);
                    if(hitObj != null) {
                        if(this.v.y > 0) {
                            this.move(0, Math.max(- this.v.y, hitObj.y - hitObj.size.y/2 - this.y - this.size.y/2 - 1), 0);
                        }
                        else {
                            this.move(0, Math.min(- this.v.y, hitObj.y + hitObj.size.y/2 - this.y + this.size.y/2 + 1), 0);
                        }
                        this.v.y = 0;
                        hit.y = hitObj;
                    }
                }
            }

            if(Math.floor(Math.abs(this.v.x)) != 0) {
                this.move(this.v.x, 0, 0);

                hitCell = stage.getHitCell(this);
                if(hitCell != null) {
                    if(this.v.x > 0) {
                        this.move(Math.max(- this.v.x, hitCell.x - this.x - this.size.x/2 - 1), 0, 0);
                    }
                    else {
                        this.move(Math.min(- this.v.x, hitCell.x + hitCell.size - this.x + this.size.x/2 + 1), 0, 0);
                    }
                    this.v.x = 0;
                    hit.x = hitCell;
                }
                
                if(this.solid) {
                    hitObj = game.getHitObj(this);
                    if(hitObj != null) {
                        if(this.v.x > 0) {
                            this.move(Math.max(- this.v.x, hitObj.x - hitObj.size.x/2 - this.x - this.size.x/2 - 1), 0, 0);
                        }
                        else {
                            this.move(Math.min(- this.v.x, hitObj.x + hitObj.size.x/2 - this.x + this.size.x/2 + 1), 0, 0);
                        }
                        this.v.x = 0;
                        hit.x = hitObj;
                    }
                }
            }

            return hit;
        };

        this.updateAnimation = function() {
            var animSpedd;
            var vtotO = Math.abs(this.v.x) + Math.abs(this.v.y) + Math.abs(this.v.z);

            if(vtotO > 0) {
                animSpedd = vtotO / (3 * vmax);
            }
            else {
                animSpedd = 0.02;
            }

            this.animFrame += animSpedd;
            this.frame = Math.floor(this.animFrame) % this.sprite.frameNum;       
        };

        this.updateEffectFrame = function() {
            if(this.effect != null) {
                this.effectFrame = (this.effectFrame + 0.5) % sprite.getSprites()[this.effect].frameNum;
            }
        }

        this.makeVisible = function () {
            this.visible = true;            
        }

        this.showState = function() {
            var s = "";
            s = s + "clippingRect: " + this.clipRect.x + ", " + this.clipRect.y  + ", " + this.clipRect.width + ", " + this.clipRect.height + "\n";
            s = s + "position : " + this.x + ", " + this.y + ", " + this.z + "\n";
            s = s + "cell : " + Math.floor(this.x / 22) + ", " + Math.floor(this.y / 22) + ", " + Math.floor(this.z / 22) + "\n";

            alert(s);
        
            if(game.getStage().getCell(22, 27, 0)) {
                alert("si");
            }

        };
    };

    Ghost.prototype = new GameObject();
    Zombie.prototype = new GameObject();
    Goblin.prototype = new GameObject();
    Enemy.prototype = new GameObject();
    Gate.prototype = new GameObject();
    Player.prototype = new GameObject();
    Platform.prototype = new GameObject();
    Spine.prototype = new GameObject();
    Fire.prototype = new GameObject();
    Key.prototype = new GameObject();

    return {
        Player : Player,
        Enemy : Enemy,
        Goblin : Goblin,
        Ghost : Ghost,
        Zombie : Zombie,
        Gate : Gate,
        Platform : Platform,
        Spine : Spine,
        Key : Key,
        Fire : Fire
    };
})();


