// Canvas Setup
const canvas = document.getElementById('pond-canvas');
const ctx = canvas.getContext('2d');

// Fit canvas to window sizes
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Fish simulation class
class Fish {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    
    // Size, speed, and heading directions
    this.size = 16 + Math.random() * 22; // 16px to 38px
    this.speed = 0.4 + Math.random() * 0.8; // Slow natural drifting speed
    this.angle = Math.random() * Math.PI * 2;
    this.wanderTheta = this.angle;
    
    // Tail wiggle factor
    this.wiggleFactor = Math.random() * 100;
    this.wiggleSpeed = 0.12 + (this.speed * 0.08);
  }

  update() {
    // Wander direction fluctuation
    this.wanderTheta += (Math.random() - 0.5) * 0.25;
    
    // Smooth angle interpolation (lerping angles)
    let angleDiff = this.wanderTheta - this.angle;
    angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff)); // Normalize to -PI to PI
    this.angle += angleDiff * 0.08;
    
    // Step forward
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    // Steer away from window edges
    const margin = 60;
    if (this.x < margin) this.wanderTheta = 0;
    else if (this.x > canvas.width - margin) this.wanderTheta = Math.PI;
    
    if (this.y < margin) this.wanderTheta = Math.PI / 2;
    else if (this.y > canvas.height - margin) this.wanderTheta = -Math.PI / 2;
    
    // Increment tail swing wiggler
    this.wiggleFactor += this.wiggleSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Subtle charcoal/grey body fill (fits dark theme, zero blue)
    ctx.fillStyle = 'rgba(235, 235, 235, 0.16)';
    ctx.strokeStyle = 'rgba(245, 245, 245, 0.08)';
    ctx.lineWidth = 1;
    
    // Draw fish body outline
    ctx.beginPath();
    ctx.moveTo(this.size / 2, 0); // Nose
    ctx.quadraticCurveTo(0, -this.size / 5, -this.size / 2, 0); // Top curve
    ctx.quadraticCurveTo(0, this.size / 5, this.size / 2, 0); // Bottom curve
    ctx.fill();
    ctx.stroke();
    
    // Draw wiggling tail fin
    const wiggleOffset = Math.sin(this.wiggleFactor) * (this.size / 6);
    
    ctx.beginPath();
    ctx.moveTo(-this.size / 2, 0);
    ctx.lineTo(-this.size / 2 - this.size / 3, -this.size / 4 + wiggleOffset);
    ctx.lineTo(-this.size / 2 - this.size / 4, wiggleOffset);
    ctx.lineTo(-this.size / 2 - this.size / 3, this.size / 4 + wiggleOffset);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }
}

// Spawn pool
const fishArray = [];
const fishCount = 18;
for (let i = 0; i < fishCount; i++) {
  fishArray.push(new Fish());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < fishArray.length; i++) {
    fishArray[i].update();
    fishArray[i].draw();
  }
  
  requestAnimationFrame(animate);
}
animate();
