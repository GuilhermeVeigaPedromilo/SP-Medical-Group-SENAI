
    window.onload = draw;

    function draw(){
       var canvas = document.getElementById("mycanvas");
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;

       particles.init(canvas);
    }

    var particles = {
        canvasEl:null,
        width:0,
        height:0,
        particles:[],
        maxParticles:150,
        connectionThreshold: 100, // Adjust the threshold for connection
        linkDistance: 50, // Adjust the distance between linked particles

        init:function(canvasEl){
            this.canvasEl = canvasEl;
            this.width = this.canvasEl.width;
            this.height = this.canvasEl.height;
            this.ctx = this.canvasEl.getContext("2d");

            this.mountParticles();
        },
        mountParticles:function(){
            for(var i = 0; i < this.maxParticles; i++){
                var initialX = Math.random()*this.width;
                var initialY = Math.random()*this.height;
                var speedX = Math.random()*2*Math.pow(-1, Math.floor(Math.random()*10));
                var speedY = Math.random()*2*Math.pow(-1, Math.floor(Math.random()*10));
                this.particles[i] = new Particle(this.ctx, initialX, initialY, speedX, speedY);
            }
            this.moveParticles();
        },
        moveParticles:function(){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.connectParticles();
            this.particles.forEach(function(p){
                p.move();
            });
            this.raf = window.requestAnimationFrame(this.moveParticles.bind(this));
        },
        connectParticles:function(){
            for(var i = 0; i < this.particles.length; i++){
                for(var j = i + 1; j < this.particles.length; j++){
                    var distance = Math.sqrt(Math.pow(this.particles[i].x - this.particles[j].x, 2) + Math.pow(this.particles[i].y - this.particles[j].y, 2));
                    if(distance < this.connectionThreshold){
                        this.particles[i].drawLine(this.particles[j]);
                    }
                }
            }
        }
    }

    function Particle(ctx, x, y, vX, vY){
        this.radius = 1;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
        this.draw();
    }

    Particle.prototype = particles;
    Particle.prototype.draw = function(){
        this.ctx.save();
        var radius = this.radius * 3.25; // Increase size by 25%
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.fillStyle = "#3498db"; // Blue color
        this.ctx.fill();
        this.ctx.restore();
    }

    Particle.prototype.drawLine = function(otherParticle){
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(otherParticle.x, otherParticle.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = "rgba(52, 152, 219, 0.4)"; // Blue color with lower opacity
        this.ctx.stroke();
    }

    Particle.prototype.move = function(){
        this.x+=this.vX;
        if(this.x > this.width) {this.x = 0;}
        if(this.x < 0) {this.x = this.width;}

        this.y+=this.vY;
        if(this.y > this.height) {this.y = 0;}
        if(this.y < 0) {this.y = this.height;}

        this.draw();
    }

    window.onload = draw;

    function draw(){
       var canvas = document.getElementById("mycanvas");
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;

       particles.init(canvas);
    }

    var particles = {
        canvasEl:null,
        width:0,
        height:0,
        particles:[],
        maxParticles:150,
        connectionThreshold: 100, // Adjust the threshold for connection
        linkDistance: 50, // Adjust the distance between linked particles

        init:function(canvasEl){
            this.canvasEl = canvasEl;
            this.width = this.canvasEl.width;
            this.height = this.canvasEl.height;
            this.ctx = this.canvasEl.getContext("2d");

            this.mountParticles();
        },
        mountParticles:function(){
            for(var i = 0; i < this.maxParticles; i++){
                var initialX = Math.random()*this.width;
                var initialY = Math.random()*this.height;
                var speedX = Math.random()*2*Math.pow(-1, Math.floor(Math.random()*10));
                var speedY = Math.random()*2*Math.pow(-1, Math.floor(Math.random()*10));
                this.particles[i] = new Particle(this.ctx, initialX, initialY, speedX, speedY);
            }
            this.moveParticles();
        },
        moveParticles:function(){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.connectParticles();
            this.particles.forEach(function(p){
                p.move();
            });
            this.raf = window.requestAnimationFrame(this.moveParticles.bind(this));
        },
        connectParticles:function(){
            for(var i = 0; i < this.particles.length; i++){
                for(var j = i + 1; j < this.particles.length; j++){
                    var distance = Math.sqrt(Math.pow(this.particles[i].x - this.particles[j].x, 2) + Math.pow(this.particles[i].y - this.particles[j].y, 2));
                    if(distance < this.connectionThreshold){
                        this.particles[i].drawLine(this.particles[j]);
                    }
                }
            }
        }
    }

    function Particle(ctx, x, y, vX, vY){
        this.radius = 1;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
        this.draw();
    }

    Particle.prototype = particles;
    Particle.prototype.draw = function(){
        this.ctx.save();
        var radius = this.radius * 2.25; // Increase size by 25%
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.fillStyle = "#3498db"; // Blue color
        this.ctx.fill();
        this.ctx.restore();
    }

    Particle.prototype.drawLine = function(otherParticle){
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(otherParticle.x, otherParticle.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = "rgba(52, 152, 219, 0.4)"; // Blue color with lower opacity
        this.ctx.stroke();
    }

    Particle.prototype.move = function(){
        this.x+=this.vX;
        if(this.x > this.width) {this.x = 0;}
        if(this.x < 0) {this.x = this.width;}

        this.y+=this.vY;
        if(this.y > this.height) {this.y = 0;}
        if(this.y < 0) {this.y = this.height;}

        this.draw();
    }

