window.addEventListener('load', () => {
    // GET CANVAS FROM HTML
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    //FOLLOWING OBJECT ORIENDTED PPROGRAMMING
    //CLASS PLAYER
    class Player {
        // AT THE TIME OF CREATION OF OBJECT OF PLAYER CLASS IT WILL EXECUTE FIRST
        constructor(game) {
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save()
            context.globalAlpha = 0.5;
            context.fill()
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }
        update() {
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            const distance = Math.hypot(this.dy, this.dx);
            if (distance > this.speedModifier) {
                this.speedX = this.dx / distance || 0;
                this.speedY = this.dy / distance || 0;
            }
            else {
                this.speedX = 0;
                this.speedY = 0;
            }

            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;

            this.game.obstacles.forEach(obstacle => {
                let [collision ,distance,sumOfRadii,dx,dy ] = this.game.checkCollision(this,obstacle)
                if(collision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = obstacle.collisionX+(sumOfRadii +1) * unit_x;
                    this.collisionY = obstacle.collisionY+(sumOfRadii +1) * unit_y;
                }
            })
        }
    }

    // CLASS OBSTACLE

    class Obstacle {
        constructor(game) {
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 0;
            this.image = document.getElementById('obstacles');
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth-50;
            this.height = this.spriteHeight-50;
            this.spriteX=this.collisionX - this.width * 0.5;
            this.spriteY=this.collisionY - this.height * 0.5 -70;
            this.frameX= Math.floor(Math.random()*4);
        }
        draw(context) {
            context.drawImage(this.image,this.frameX * this.spriteWidth,0* this.spriteHeight,this.spriteWidth, this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height)
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save()
            context.globalAlpha = 0.5;
            context.fill()
            context.restore();
            context.stroke();
        }
    }







    //CLASS GAME
    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargin = 260;
            //INITIALIZE THE PLAYER CLASS OBJECT 
            this.player = new Player(this);
            this.numberOfObstacles =5;
            this.obstacles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }
            window.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;


            })

            window.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;


            })

            window.addEventListener('mousemove', (e) => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            })
        }
        render(context) {
            this.player.draw(context);
            this.player.update();
            this.obstacles.forEach(obstacle => obstacle.draw(context)
            )
        }
        checkCollision(a,b){
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy,dx);
            const sumOfRadii = a.collisionRadius +b.collisionRadius;
            return [(distance < sumOfRadii),distance,sumOfRadii,dx,dy];
        }
        init(){
           let attempts =0;
           while (this.obstacles.length < this.numberOfObstacles && attempts <500){
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.Y - obstacle.collisionY;
                    const distance = Math.hypot(dy,dx);
                    const distanceBuffer =100;
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius +distanceBuffer;
                    if(distance < sumOfRadii) {
                        overlap=true;
                    }
                })
                const margin = testObstacle.collisionRadius *2;
                if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY >this.topMargin + margin && testObstacle.collisionY < this.height - margin){
                    this.obstacles.push(testObstacle)
                }
                attempts++;
           }
        }

    }

    const game = new Game(canvas);
    game.init();
    console.log(game);
    

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.render(ctx);
        requestAnimationFrame(animate)
    }
    animate()

})
