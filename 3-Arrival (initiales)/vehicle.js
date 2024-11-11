class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.r = 4; // Taille des véhicules
    this.target = createVector(random(width), random(height));
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.path = []; // Chemin de chaque véhicule
    this.pathLimit = 20; // Longueur max du chemin
    this.edgeCrossed = false; // Suivi de l'état des bordures franchies
    this.wanderTheta = PI / 2; // Angle initial pour le comportement de wander
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(100);
    wanderPoint.add(this.pos);

    let wanderRadius = 50;
    let theta = this.wanderTheta + this.vel.heading();

    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);
    wanderPoint.add(x, y);

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    let displaceRange = 0.3;
    this.wanderTheta += random(-displaceRange, displaceRange);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let distance = desired.mag();
    let speed = this.maxSpeed;

    if (distance < 100) {
      speed = map(distance, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.edgeCrossed) {
      this.path.push(this.pos.copy());
    }

    if (this.path.length > this.pathLimit) {
      this.path.shift();
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.edgeCrossed = false;
  }

  show() {
    noFill();
    stroke(255, 100);
    beginShape();
    for (let i = 0; i < this.path.length; i++) {
      let pos = this.path[i];
      vertex(pos.x, pos.y);
    }
    endShape();

    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
      this.resetPath();
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
      this.resetPath();
    }

    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
      this.resetPath();
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
      this.resetPath();
    }
  }

  resetPath() {
    this.path = [];
    this.edgeCrossed = true;
  }
}