let vehicles = [];
let numVehiclesSlider, speedSlider, textInput, behaviorButton, startButton;
let targetWord = '';
let targetPositions = [];
let fontSize = 100;
let font;
let randomBehavior = false;
let formingWord = false; // Indique si les véhicules forment un mot
let textAlpha = 255;
let textAlphaDirection = -5;
let gameStarted = false;
let pacman;
let gameTimer = 10; // 10 seconds timer
let gameInterval;
let endMessage = '';
let endMessageAlpha = 0;

function preload() {
  font = loadFont("assets/RubikWetPaint-Regular.ttf");
}

function setup() {
  createCanvas(1300, 720);

  // Positionner les éléments au centre en bas
  let centerX = width / 2 - 75;

  numVehiclesSlider = createSlider(1, 500, 20, 1);
  numVehiclesSlider.position(centerX, height - 170);
  numVehiclesSlider.style('width', '150px');
  numVehiclesSlider.style('background-color', '#ff6600');
  numVehiclesSlider.style('color', '#ffffff');
  numVehiclesSlider.style('border', 'none');
  numVehiclesSlider.style('border-radius', '5px');
  numVehiclesSlider.style('padding', '10px 20px');
  numVehiclesSlider.style('font-size', '16px');

  speedSlider = createSlider(1, 20, 5, 1);
  speedSlider.position(centerX, height - 150);
  speedSlider.style('width', '150px');
  speedSlider.style('background-color', '#ff6600');
  speedSlider.style('color', '#ffffff');
  speedSlider.style('border', 'none');
  speedSlider.style('border-radius', '5px');
  speedSlider.style('padding', '10px 20px');
  speedSlider.style('font-size', '16px');

  textInput = createInput('');
  textInput.position(centerX, height - 110);
  textInput.size(150);
  textInput.style('background-color', '#ff6600');
  textInput.style('color', '#ffffff');
  textInput.style('border', 'none');
  textInput.style('border-radius', '5px');
  textInput.style('padding', '10px 20px');
  textInput.style('font-size', '16px');
  textInput.input(updateTargetWord);
  textInput.elt.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      toggleFormWord(); // Appeler la fonction pour former ou revenir
    }
  });

  behaviorButton = createButton('Changer Comportement');
  behaviorButton.position(centerX, height - 60);
  behaviorButton.style('background-color', '#ff6600');
  behaviorButton.style('color', '#ffffff');
  behaviorButton.style('border', 'none');
  behaviorButton.style('border-radius', '15px');
  behaviorButton.style('padding', '10px 20px');
  behaviorButton.style('font-size', '16px');
  behaviorButton.style('margin-left', '-10px'); // Déplacer le bouton vers la gauche
  behaviorButton.mousePressed(toggleBehavior);

  startButton = createButton('Commencer la Partie');
  startButton.position(centerX, height - 210);
  startButton.style('background-color', '#ff6600');
  startButton.style('color', '#ffffff');
  startButton.style('border', 'none');
  startButton.style('border-radius', '15px');
  startButton.style('padding', '10px 20px');
  startButton.style('font-size', '16px');
  startButton.style('margin-left', '0px'); // Déplacer le bouton vers la gauche
  startButton.mousePressed(startGame);

  for (let i = 0; i < 500; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  pacman = new Pacman();
}

function draw() {
  // Dégradé bleu et orange
  setGradient(0, 0, width, height, color(0, 102, 204), color(255, 153, 51));

  if (gameStarted) {
    vehicles.forEach(vehicle => {
      vehicle.wander(); // Switch to random behavior
      vehicle.update();
      vehicle.edges();
      vehicle.show();
    });

    pacman.update();
    pacman.show();
    checkCollisions();

    displayTimer();

    if (vehicles.length === 0) {
      endGame('Victoire');
    }
  } else {
    let desiredNumVehicles = numVehiclesSlider.value();
    adjustVehicleCount(desiredNumVehicles);

    let maxSpeed = speedSlider.value();
    vehicles.forEach(vehicle => {
      vehicle.maxSpeed = maxSpeed;
    });

    vehicles.forEach((vehicle, index) => {
      if (formingWord && targetPositions.length > 0) {
        let target = targetPositions[index % targetPositions.length];
        let force = vehicle.arrive(target);
        vehicle.applyForce(force);
      } else if (randomBehavior) {
        vehicle.wander(); // Utiliser le comportement de wander
      } else {
        let target = createVector(mouseX, mouseY);
        let force = vehicle.arrive(target);
        vehicle.applyForce(force);
      }

      vehicle.update();
      vehicle.edges();
      vehicle.show();
    });

    drawAnimatedText();
    drawAnimatedText1();
  }

  if (endMessage) {
    displayEndMessage();
  }
}

// Fonction pour dessiner le texte animé
function drawAnimatedText() {
  textAlign(CENTER, CENTER);
  textSize(60);
  textFont(font); // Set the font here
  fill(255, 255, 255, textAlpha);
  noStroke();
  text('MIAGE IA', width / 2, height / 6);

  // Animation de la transparence
  textAlpha += textAlphaDirection;
  if (textAlpha < 0 || textAlpha > 255) {
    textAlphaDirection *= -1;
  }
}
// Fonction pour dessiner le texte animé
function drawAnimatedText1() {
  textAlign(CENTER, CENTER);
  textSize(20);
  textFont(font); // Set the font here
  fill(255, 255, 255, textAlpha);
 
  text('Ecrit un mot magique et taper "ENTRER"', width / 2, height / 4);


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

// Met à jour le mot cible à partir du champ de texte
function updateTargetWord() {
  targetWord = textInput.value().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Basculer entre former le mot et revenir au comportement précédent
function toggleFormWord() {
  if (formingWord) {
    formingWord = false;
    targetPositions = [];
  } else {
    formWord();
  }
}

// Forme les véhicules pour écrire le texte avec animation
function formWord() {
  formingWord = true;
  targetPositions = [];

  textSize(fontSize);
  textFont(font);
  let points = [];
  for (let i = 0; i < targetWord.length; i++) {
    let letterPoints = font.textToPoints(targetWord[i], 200 + i * (fontSize + 20), height / 2, fontSize, {
      sampleFactor: 0.08,
      simplifyThreshold: 0
    });
    points = points.concat(letterPoints);
  }

  adjustVehicleCount(points.length);

  points.forEach((pt, index) => {
    if (index < vehicles.length) {
      vehicles[index].target = createVector(pt.x, pt.y);
    }
  });

  targetPositions = points.map(pt => createVector(pt.x, pt.y));
}

// Basculer entre comportement normal et aléatoire
function toggleBehavior() {
  randomBehavior = !randomBehavior;
}

// Ajuste le nombre de véhicules
function adjustVehicleCount(count) {
  while (vehicles.length < count) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
  while (vehicles.length > count) {
    vehicles.pop();
  }
}

function startGame() {
  gameStarted = true;
  gameTimer = 10;
  adjustVehicleCount(10); // Set the number of vehicles to 25
  gameInterval = setInterval(() => {
    gameTimer--;
    if (gameTimer <= 0) {
      endGame('Game Over');
    }
  }, 1000);

  // Hide sliders, input, and start button
  numVehiclesSlider.hide();
  speedSlider.hide();
  textInput.hide();
  behaviorButton.hide();
  startButton.hide();
}

function endGame(message) {
  clearInterval(gameInterval);
  gameStarted = false;
  endMessage = message;
  endMessageAlpha = 255;

  // Show sliders, input, and start button
  numVehiclesSlider.show();
  speedSlider.show();
  textInput.show();
  behaviorButton.show();
  startButton.show();
}

function checkCollisions() {
  for (let i = vehicles.length - 1; i >= 0; i--) {
    let vehicle = vehicles[i];
    let d = dist(pacman.pos.x, pacman.pos.y, vehicle.pos.x, vehicle.pos.y);
    if (d < pacman.r + vehicle.r) {
      vehicles.splice(i, 1);
    }
  }
}

function displayTimer() {
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text(`Time: ${gameTimer}`, width / 2, 50);
}

function displayEndMessage() {
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255, 0, 0, endMessageAlpha);
  text(endMessage, width / 2, height / 2);

  // Fade out animation
  endMessageAlpha -= 5;
  if (endMessageAlpha < 0) {
    endMessageAlpha = 0;
    endMessage = '';
  }
}

class Pacman {
  constructor() {
    this.pos = createVector(mouseX, mouseY);
    this.r = 20;
  }

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
  }

  show() {
    fill(255, 255, 0);
    noStroke();
    arc(this.pos.x, this.pos.y, this.r * 2, this.r * 2, QUARTER_PI, TWO_PI - QUARTER_PI);
  }
}