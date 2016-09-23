var mainState = {
    preload: function() {
        game.load.image('ninja', 'assets/ninja.png');
        game.load.image('coin', "assets/coin.png");
        game.load.image('syuriken', "assets/syuriken.png");
        game.load.image('shootTrail', "assets/ShootTrail.png");
    },
    
    create: function() {
        this.shot = null;
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.ninja = game.add.sprite(100, 245, 'ninja');
        this.ninja.width = 50;
        this.ninja.height = 70;
        game.physics.arcade.enable(this.ninja);
        
        this.pipes = game.add.group();
        this.coins = game.add.group();

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.shoot, this);
        
        this.timer = game.time.events.loop(300, this.addCoin, this); 
    },
    
    update: function() {
        if (this.ninja.y < 0 || this.ninja.y > 490) {
            this.restartGame();
        }
        if(this.shot != null) {
            game.physics.arcade.overlap(this.shot, this.coins, this.hitCoin, null, this);
        }
    },
    
    addCoin: function() {
        var x = Math.floor(Math.random() * 150) + 200;
        var coin = game.add.sprite(x, -50, "coin");
        coin.width = 50;
        coin.height = 50;
        this.coins.add(coin);
        game.physics.arcade.enable(coin);
        coin.body.gravity.y = Math.floor(Math.random() * 400) + 100;
        coin.checkWorldBounds = true;
        coin.outOfBoundsKill = true;
    },
        
    shoot: function() {
        this.shot = game.add.sprite(150, this.ninja.y + (Math.floor(Math.random() * 20) - 10), 'shootTrail');
        game.physics.arcade.enable(this.shot);
        this.shotDestroyTimer = game.time.events.loop(100, this.destroyShot, this); 
    },
    
    hitCoin: function(shot, coin) {
        coin.body.gravity.y = 0;
        coin.body.velocity.y = 0;
        coin.x = 375;
        game.time.events.add(Phaser.Timer.SECOND * 1, function(){coin.kill();}, this);
        this.score += 1;
        this.labelScore.text = this.score;
    },
    
    destroyShot: function() {
        var stoppedShot = game.add.sprite(360, this.shot.y, 'syuriken');
        stoppedShot.width = 50;
        stoppedShot.height = 50;
        this.shot.kill();
        this.shot = null;
        game.time.events.remove(this.shotDestroyTimer);
        game.time.events.add(Phaser.Timer.SECOND * 1, function(){stoppedShot.kill();}, this);
    },
    
    restartGame: function() {
        game.state.start('main');
    },
};

var game = new Phaser.Game(400, 490);
game.state.add('main', mainState);
game.state.start('main');