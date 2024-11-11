let vehicles = [];
let showCircles = true;
let vehicleCountSlider;
let distanceSlider;
let speedSlider;
let textAlpha = 255;
let textAlphaDirection = -5;

function setup() {
  createCanvas(1400, 720);
  
  // Slider pour contrôler le nombre de véhicules
  vehicleCountSlider = createSlider(1, 20, 5); // Min: 1, Max: 20, Valeur par défaut: 5
  vehicleCountSlider.position(width / 2 - 100, height - 80);
  vehicleCountSlider.style('width', '200px');
  
  // Slider pour contrôler la distance du centre du cercle
  distanceSlider = createSlider(50, 300, 150); // Min: 50, Max: 300, Valeur par défaut: 150
  distanceSlider.position(width / 2 - 100, height - 40);
  distanceSlider.style('width', '200px');
  
  // Slider pour contrôler la vitesse des véhicules
  speedSlider = createSlider(1, 10, 5); // Min: 1, Max: 10, Valeur par défaut: 5
  speedSlider.position(width / 2 - 100, height - 120);
  speedSlider.style('width', '200px');
  
  // Création des véhicules initiaux
  addVehicles(vehicleCountSlider.value());
}

function draw() {
  // Changer l'arrière-plan pour un dégradé orange et bleu
  setGradient(0, 0, width, height, color(255, 165, 0), color(0, 191, 255));
  
  // Mettez à jour le nombre de véhicules selon la valeur du slider
  let currentVehicleCount = vehicleCountSlider.value();
  if (vehicles.length !== currentVehicleCount) {
    addVehicles(currentVehicleCount);
  }

  // Mettre à jour les propriétés des véhicules basées sur les sliders
  for (let v of vehicles) {
    v.distanceCercle = distanceSlider.value(); // Mettre à jour la distance du cercle
    v.maxSpeed = speedSlider.value(); // Mettre à jour la vitesse
    v.update();
    v.edges();
    v.wander();
    v.show();
  }

  // Dessiner le texte animé "MIAGE IA"
  drawAnimatedText();

  // Afficher le message d'instructions
  displayInstructions();
}

// Fonction pour afficher le message d'instructions
function displayInstructions() {
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  noStroke();
  text("Appuyez sur 'D' pour afficher/masquer les cercles", width / 2, 30);
}

// Fonction pour ajouter ou enlever des véhicules
function addVehicles(count) {
  vehicles = []; // Réinitialiser le tableau des véhicules
  for (let i = 0; i < count; i++) {
    let v = new Vehicle(random(width), random(height));
    v.distanceCercle = distanceSlider.value(); // Distance du cercle
    v.maxSpeed = speedSlider.value(); // Vitesse du véhicule
    vehicles.push(v);
  }
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

function keyPressed() {
  if (key === 'd' || key === 'D') {
    showCircles = !showCircles; // Bascule l'affichage des cercles
  }
}
