let capture;
let poseNet;
let poses = [];
let userResult;

function setup() {
  let canvas = createCanvas(420, 320);
  canvas.parent("doppelgangerCanvas");

  capture = createCapture(VIDEO);
  capture.size(420, 320);
  capture.hide();

  userResult = localStorage.getItem("digitalResult") || "healthy";

  poseNet = ml5.poseNet(capture, () => {
    console.log("PoseNet loaded");
  });

  poseNet.on("pose", function (results) {
    poses = results;
  });
}

function draw() {
  image(capture, 0, 0, width, height);

  if (userResult === "healthy") {
    drawHealthyEffect();
  }

  if (userResult === "balanced") {
    drawBalancedEffect();
  }

  if (userResult === "high") {
    drawHighDependencyEffect();
  }
}

function drawHealthyEffect() {
  noFill();
  stroke(0, 255, 100);
  strokeWeight(3);
  rect(10, 10, width - 20, height - 20);

  fill(0, 255, 100);
  noStroke();
  textSize(14);
  text("HEALTHY ONLINE PRESENCE", 20, 40);
}

function drawBalancedEffect() {
  filter(POSTERIZE, 5);

  let scanY = frameCount % height;

  stroke(255, 165, 0);
  strokeWeight(3);
  line(0, scanY, width, scanY);

  fill(255, 165, 0);
  noStroke();
  textSize(14);
  text("BALANCED DIGITAL ACTIVITY", 20, 30);

  if (poses.length > 0) {
    let pose = poses[0].pose;

    drawOrangeEye(pose.leftEye.x, pose.leftEye.y);
    drawOrangeEye(pose.rightEye.x, pose.rightEye.y);
  }
}

function drawHighDependencyEffect() {
  filter(POSTERIZE, 4);
  filter(GRAY);

  for (let i = 0; i < 8; i++) {
    let y = random(height);
    let h = random(5, 18);
    let xOffset = random(-20, 20);

    copy(0, y, width, h, xOffset, y, width, h);
  }

  fill(255, 0, 0);
  noStroke();
  textSize(14);
  text("HIGH DIGITAL DEPENDENCY DETECTED", 20, 30);
  text("WARNING: OVEREXPOSURE RISK", 20, 50);

  if (poses.length > 0) {
    let pose = poses[0].pose;

    drawRedEye(pose.leftEye.x, pose.leftEye.y);
    drawRedEye(pose.rightEye.x, pose.rightEye.y);
    drawFaceScanner(pose.nose.x, pose.nose.y);
  }
}

function drawOrangeEye(x, y) {
  noStroke();

  fill(255, 165, 0, 90);
  ellipse(x, y, 35, 35);

  fill(255, 165, 0);
  ellipse(x, y, 12, 12);
}

function drawRedEye(x, y) {
  noStroke();

  fill(255, 0, 0, 80);
  ellipse(x, y, 50, 50);

  fill(255, 0, 0, 160);
  ellipse(x, y, 30, 30);

  fill(255, 0, 0);
  ellipse(x, y, 12, 12);
}

function drawFaceScanner(x, y) {
  noFill();

  stroke(255, 0, 0);
  strokeWeight(2);
  ellipse(x, y, 170, 220);

  stroke(255, 0, 0, 120);

  for (let i = -80; i < 80; i += 20) {
    line(x - 75, y + i, x + 75, y + i);
  }
}
