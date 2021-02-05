export default function starSky() {
    // var canvas;
    // var context;
    // var canvaH;
    // var canvaW;
    // var stars = [];
    // var fps = 60;
    // var numStars = 700;


    // document.addEventListener("DOMContentLoaded", function () {
    //     const parent = document.querySelector('.welcome')
    //     // Calculate the screen size
    //     canvaH = parent.offsetHeight;
    //     canvaW = parent.offsetWidth;

    //     // Get the canvas
    //     canvas = document.querySelector('#stars');

    //     // Fill out the canvas
    //     canvas.setAttribute('height', canvaH);
    //     canvas.setAttribute('width', canvaW);
    //     context = canvas.getContext('2d');

    //     // Create all the stars
    //     for (var i = 0; i < numStars; i++) {
    //         var x = Math.round(Math.random() * canvaW);
    //         var y = Math.round(Math.random() * canvaH);
    //         var length = 1 + Math.random() * 2.5;
    //         var opacity = Math.random();

    //         // Create a new star and draw
    //         var star = new Star(x, y, length, opacity);

    //         // Add the the stars array
    //         stars.push(star);
    //     }

    //     let animateInterval = setInterval(animate, 1000 / fps);
    // });

    // /**
    //  * Animate the canvas
    //  */
    // function animate() {
    //     context.clearRect(0, 0, canvaW, canvaH);
    //     stars.forEach((el) => {
    //         el.draw(context);
    //     })
    // }

    // /* stop Animation */
    // function stopAnimation() {
    //     clearInterval(animateInterval);
    // }

    // //stopAnimation();

    // function Star(x, y, length, opacity) {
    //     this.x = parseInt(x);
    //     this.y = parseInt(y);
    //     this.length = parseInt(length);
    //     this.opacity = opacity;
    //     this.factor = 1;
    //     this.increment = Math.random() * .03;
    // }

    // Star.prototype.draw = function () {
    //     context.rotate((Math.PI * 1 / 10));

    //     // Save the context
    //     context.save();

    //     // move into the middle of the canvas, just to make room
    //     context.translate(this.x, this.y);

    //     // Change the opacity
    //     if (this.opacity > 1) {
    //         this.factor = -1;
    //     }
    //     else if (this.opacity <= 0) {
    //         this.factor = 1;

    //         this.x = Math.round(Math.random() * canvaW);
    //         this.y = Math.round(Math.random() * canvaH);
    //     }

    //     this.opacity += this.increment * this.factor;

    //     context.beginPath()
    //     for (var i = 5; i--;) {
    //         context.lineTo(0, this.length);
    //         context.translate(0, this.length);
    //         context.rotate((Math.PI * 2 / 10));
    //         context.lineTo(0, - this.length);
    //         context.translate(0, - this.length);
    //         context.rotate(-(Math.PI * 6 / 10));
    //     }
    //     context.lineTo(0, this.length);
    //     context.closePath();
    //     context.fillStyle = "rgba(255, 255, 255, " + this.opacity + ")";
    //     context.shadowBlur = 5;
    //     context.shadowColor = '#fff';
    //     context.fill();

    //     context.restore();
    // }
    (() => {
        const canvas = document.querySelector('#stars');
        const context = canvas.getContext('2d');
        const parent = document.querySelector('.welcome')
        // Calculate the screen size
        canvas.width = parent.offsetHeight;
        canvas.height = parent.offsetWidth;

        const maxDepth = 40;
        const particleAmount = 700;
        const speed = 0.05;
        let maxDistributionX;
        let maxDistributionY;

        const particles = new Array(particleAmount);

        const setWindowRelatedProperties = () => {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            maxDistributionX = parent.offsetWidth / 8;
            maxDistributionY = parent.offsetHeight / 4;
        };

        setWindowRelatedProperties();

        window.addEventListener('resize', setWindowRelatedProperties);

        context.fillStyle = 'rgba(27,20,54)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

        const placeParticles = () => {
            for (let i = 0; i < particles.length; i += 1) {
                particles[i] = {
                    x: random(-maxDistributionX, maxDistributionX),
                    y: random(-maxDistributionY, maxDistributionY),
                    z: random(1, maxDepth),
                };
            }
        };

        const moveParticles = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // .3 or .5 looks good, 1 for no shade
            context.fillStyle = 'rgba(27,20,54, .5)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i += 1) {
                particles[i].z -= speed;

                if (particles[i].z <= 0) {
                    particles[i].x = random(-maxDistributionX, maxDistributionX);
                    particles[i].y = random(-maxDistributionY, maxDistributionY);
                    particles[i].z = maxDepth;
                }

                const k = 100 / particles[i].z;
                const newX = particles[i].x * k + centerX;
                const newY = particles[i].y * k + centerY;

                if (newX >= 0 && newX <= window.innerWidth && newY >= 0 && newY <= window.innerHeight) {
                    const size = (1 - particles[i].z / maxDepth) * 5;
                    context.beginPath();
                    context.fillStyle = '#ddd';
                    context.arc(newX, newY, size / 2, 0, Math.PI * 2, false);
                    context.closePath();
                    context.fill();
                }
            }

            window.requestAnimationFrame(moveParticles);
        };

        placeParticles();
        window.requestAnimationFrame(moveParticles);
    })();

}