class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(3, 6); // Valeur par défaut pour maxSpeed
    this.maxForce = 0.2;
    this.r = random(10, 30);

    this.distanceCercle = 150; // Valeur par défaut pour distanceCercle
    this.wanderRadius = random(40, 80);
    this.noiseOffset = random(1000); // Décalage aléatoire pour le Perlin Noise

    this.path = [];
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  wander() {
    // Point de direction basé sur le vecteur de vitesse
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(this.distanceCercle);
    wanderPoint.add(this.pos);

    if (showCircles) {
      // Cercle rouge autour du point de direction
      fill(255, 0, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 8);

      // Cercle blanc autour du point
      noFill();
      stroke(255);
      circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);
    }

    // Angle avec le Perlin Noise
    let angle = noise(this.noiseOffset) * TWO_PI * 2;
    this.noiseOffset += 0.01;
    let x = this.wanderRadius * cos(angle);
    let y = this.wanderRadius * sin(angle);
    wanderPoint.add(x, y);

    if (showCircles) {
      // Cercle vert pour le point déplacé
      fill(0, 255, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 16);

      // Ligne blanche pour indiquer la direction
      stroke(255);
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
    }

    // Force de déplacement
    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.path.push(this.pos.copy());

    if (this.path.length > 50) {
      this.path.splice(0, 1);
    }
  }

  show() {
    // Dessin du chemin
    for (let i = 0; i < this.path.length; i++) {
      let p = this.path[i];
      stroke(255, 100);
      noFill();
      circle(p.x, p.y, 2);
    }

    // Dessin du véhicule
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
