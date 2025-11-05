// Neural Network Animation
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
const sparkCanvas = document.getElementById('sparkCanvas');
const sparkCtx = sparkCanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
sparkCanvas.width = window.innerWidth;
sparkCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sparkCanvas.width = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
});

// Node class for neural network
class Node {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        ctx.fill();
    }
}

// Create nodes
const nodes = [];
for (let i = 0; i < 80; i++) {
    nodes.push(new Node());
}

// Draw connections between nodes
function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - dist / 150)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Animation loop for neural network
function animate() {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
}

animate();

// Spark Animation for Closing Slide
class Spark {
    constructor() {
        this.x = Math.random() * sparkCanvas.width;
        this.y = Math.random() * sparkCanvas.height;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw() {
        sparkCtx.beginPath();
        sparkCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        sparkCtx.fillStyle = `rgba(102, 126, 234, ${this.life})`;
        sparkCtx.fill();
    }
}

let sparks = [];
let sparkAnimationId;

function animateSparks() {
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

    if (Math.random() < 0.3) {
        sparks.push(new Spark());
    }

    sparks = sparks.filter(spark => spark.life > 0);

    sparks.forEach(spark => {
        spark.update();
        spark.draw();
    });

    sparkAnimationId = requestAnimationFrame(animateSparks);
}

// Slide Navigation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    navDots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    navDots[index].classList.add('active');
    currentSlide = index;

    // Activate spark animation on closing slide
    if (index === totalSlides - 1) {
        sparkCanvas.classList.add('active');
        animateSparks();
    } else {
        sparkCanvas.classList.remove('active');
        if (sparkAnimationId) {
            cancelAnimationFrame(sparkAnimationId);
        }
        sparks = [];
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'c') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
    } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});

// Dot navigation
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
});