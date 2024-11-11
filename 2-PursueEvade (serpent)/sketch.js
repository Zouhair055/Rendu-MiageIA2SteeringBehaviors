let vehicles = [];
let numVehicles = 20;
let textAlpha = 255;
let textAlphaDirection = -5;
let showCircles = true;
let buttonCircles;

function setup() {
  createCanvas(1300, 780);
  
  // Initialiser les véhicules de manière aléatoire
  for (let i = 0; i < numVehicles; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  // Bouton pour afficher/masquer les cercles
  buttonCircles = createButton('Afficher/Masquer Cercles');
  buttonCircles.position(width / 2 - 90, height - 100);
  buttonCircles.style('background-color', '#ff6600');
  buttonCircles.style('color', '#ffffff');
  buttonCircles.style('border', 'none');
  buttonCircles.style('border-radius', '5px');
  buttonCircles.style('padding', '10px 20px');
  buttonCircles.style('font-size', '16px');
  buttonCircles.mousePressed(toggleCircles);
}

function draw() {
  // Changer l'arrière-plan pour un dégradé bleu et orange
  setGradient(0, 0, width, height, color(0, 191, 255), color(255, 165, 0));

  // Cible qui suit la souris
  let target = createVector(mouseX, mouseY);

  // Le premier véhicule suit la souris
  let steering = vehicles[0].arrive(target);
  vehicles[0].applyForce(steering);
  vehicles[0].update();
  vehicles[0].show();

  // Chaque véhicule suivant suit le véhicule précédent avec une petite distance
  for (let i = 1; i < vehicles.length; i++) {
    let leader = vehicles[i - 1];
    let distBetween = p5.Vector.dist(vehicles[i].pos, leader.pos);

    // Ajuster la distance minimale entre les véhicules pour l'effet serpent
    if (distBetween > 80) { // Ajuster la distance pour qu'ils ne se chevauchent pas
      let steering = vehicles[i].arrive(leader.pos);
      vehicles[i].applyForce(steering);
    } else {
      // Si la distance est très faible, ralentir et ne pas ajouter de force pour éviter l'aller-retour
      vehicles[i].vel.mult(0.95);  // Ralentir doucement
    }

    vehicles[i].update();
    vehicles[i].show();
  }

  // Dessiner le texte animé "MIAGE IA"
  drawAnimatedText();
}

// Fonction pour afficher/masquer les cercles
function toggleCircles() {
  showCircles = !showCircles;
}

// Fonction pour dessiner le texte animé
function drawAnimatedText() {
  textAlign(CENTER, CENTER);
  textSize(100);
  fill(255, 255, 255, textAlpha);
  noStroke();
  text('MIAGE IA', width / 2, height / 2);

  // Animation de la transparence
  textAlpha += textAlphaDirection;
  if (textAlpha < 0 || textAlpha > 255) {
    textAlphaDirection *= -1;
  }
}

// Fonction pour définir un dégradé
function setGradient(x, y, w, h, c1, c2) {
  for (let i = 0; i <= h; i++) {
    let inter = map(i, 0, h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, y + i, x + w, y + i);
  }
}
