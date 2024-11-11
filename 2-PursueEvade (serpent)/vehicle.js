
class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 6; // Diminuer la vitesse maximale
    this.maxForce = 0.5; // Diminuer la force maximale
    this.r = 16;
    this.color = color(random(100, 255), random(100, 255), random(100, 255)); // Couleur aléatoire
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(0); // Couleur du contour (noir)
    strokeWeight(2); // Épaisseur du contour
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();

    if (showCircles) {
      // Dessiner le cercle autour du véhicule
      noFill();
      stroke(255);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      if (showCircles) {
        // 1 - Dessiner le cercle de rayon 100 autour de la cible
        noFill();
        stroke(255, 0, 0); // Couleur rouge
        ellipse(target.x, target.y, 90); // Cercle de rayon 100 autour de la cible
      }

      // 2 - Calculer la distance entre le véhicule et la cible
      let distance = force.mag();

      // 3 - Si la distance est inférieure à 100 pixels, ajuster la vitesse désirée
      if (distance < 500) {
        desiredSpeed = map(distance, 0, 100, 0.5, this.maxSpeed); // Limiter la vitesse minimale à 0.5
      }

      // 4 - Empêcher que le véhicule atteigne exactement la cible en fixant une distance minimale
      if (distance < 10) {
        desiredSpeed = 0; // Arrêter complètement le véhicule si très proche de la cible
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  arrive(target) {
    return this.seek(target, true);
  }
}