class CueBall {
  // Define the class constructor
  constructor(x, y, r, move) {
    // Define the initial position as a vector
    this.initialPosition = createVector(x, y);
    
    // Make a copy of the initial position so that its value doesn't change
    this.position = this.initialPosition.copy();
    
    // Define the velocity
    this.velocity = createVector(0, 0);
    
    // Define the radius
    this.r = r;
  }
  
  // Display the cueball
  display() {
    // Make its colour white
    fill(255, 255, 255);
    
    // Draw the circle
    circle(this.position.x, this.position.y, this.r * 2);
  }
  
  // Know if the ball is touched
  touched() {
    let dx = this.position.x - mouseX;
    let dy = this.position.y - mouseY;
    let distance = sqrt(dx * dx + dy * dy);
    let minDistance = this.r * 2;
    
    // If the distance falls within the range of the mouse, the ball has been touched
    if (distance < minDistance) {
      return true;
    }
    else {
      return false;
    }
  }
  
  // Know if the ball has moved from its initial position
  moved() {
    // Compare the initial position with the current position
    if ((this.initialPosition.x !== this.position.x) || (this.initialPosition.y !== this.position.y)) {
      return true;
    }
    else {
      return false;
    }
  }
  
  // Know if the ball has gone out of bounds
  outOfBounds() {
    if (((this.position.x - this.r) < 0) ||
        ((this.position.x + this.r) > 280) ||
        ((this.position.y + this.r) > 480) ||
        ((this.position.y - this.r) < 0)) {
        return true;
      }
    else {
      return false;
    }
  }
  
  // Move the ball back to its initial position
  resetPosition() {
    this.position.x = this.initialPosition.x;
    this.position.y = this.initialPosition.y;
  }
}

class Ball {
  // Define the class constructor
  constructor(x, y, r) {
    // Define the position as a vector
    this.position = createVector(x, y);
    
    // Define the velocity as a vector
    this.velocity = createVector(0, 0);
    
    // Define the radius as a vector
    this.r = r;
  }

  // Display the ball
  display() {
    fill(255, 255, 255);
    circle(this.position.x, this.position.y, this.r * 2);
  }
  
  // Update the position of the ball
  update() {
    this.position.add(this.velocity);
  }
  
  // Detect if the ball is out of the platform
  outOfPlatform() {
    // Find the distance from the center of the circle to the center of the ball
    let dx = this.position.x - 140;
    let dy = this.position.y - 120;
    let distance = sqrt(dx * dx + dy * dy);
    
    // Compute the maximum distance
    let maxDistance = 80 + this.r;
    
    // If the distance is greater than the maximum
    if (distance > maxDistance) {
      return true;
    }
    else {
      return false;
    }
  }
}

// Variable for the cueball
var cueball;

// Array for the balls
var balls;

// Count the number of times the cueball is released
count = 0;

// Variable to determine if a ball should be released
releaseBall = false;

// Damper for the velocity
var damper = 0.99;

// Minimum seperation distance for ball collision
minSeparation = 0.00001;

function setup() {
  // Define the canvas
  createCanvas(280, 480);
  
  // Define the cueball
  cueball = new CueBall(140, 360, 10);
  
  // Define the balls array to be an empty array
  balls = [];
  
  // Add the balls to the balls array
  balls.push(new Ball(140, 60, 7.5));
  balls.push(new Ball(180, 75, 7.5));
  balls.push(new Ball(200, 120, 7.5));
  balls.push(new Ball(180, 160, 7.5));
  balls.push(new Ball(140, 180, 7.5));
  balls.push(new Ball(95, 160, 7.5));
  balls.push(new Ball(80, 120, 7.5));
  balls.push(new Ball(95, 75, 7.5));
  balls.push(new Ball(150, 90, 7.5));
  balls.push(new Ball(170, 120, 7.5));
  balls.push(new Ball(150, 150, 7.5));
  balls.push(new Ball(115, 140, 7.5));
  balls.push(new Ball(115, 100, 7.5));
  balls.push(new Ball(140, 120, 7.5));
  
  // Align text to the center
  textAlign(CENTER, CENTER);
}

function draw() {
  // Define the colour of the background
  background(0, 16, 34);
  
  // Always slow the ball down to simulate resistance 
  cueball.velocity.mult(damper);
  
  // Move the cueball
  cueball.position.add(cueball.velocity);
  
  // Remove the stroke around the balls
  noStroke();
  
  // Display the platform for the balls
  fill(100, 100, 100);
  circle(140, 120, 160);
  
  // Display the cueball
  cueball.display();
  
  // Loop through the balls array
  balls.forEach(ball => {
    // Display the ball    
    ball.display();
    
    // Update its velocity
    ball.update();
    
    // Check for collision with the cueball
    ballCollision(ball, cueball);
    
    // Loop through the balls array again
    balls.forEach(ballPlay => {
      // Ensure that a ball is not colliding with itself
      if (ball !== ballPlay) {
        // Check for collision with other balls
        ballCollision(ball, ballPlay);
      }
    });
    
    // Check if the ball is outside the platform
    if (ball.outOfPlatform()) {
      // Delete any ball outside the platform from the balls array
      let index = balls.indexOf(ball);
      balls.splice(index, 1);
    }
  });
  
  // Display text on the canvas
  text("Asteroids: " + balls.length, 40, 25);
  text("Clicks: " + count, 40, 40);
  
  // Show a line of power from the ball to the position of the mouse
  if (mouseIsPressed) {
    stroke(255,0,0);
    line(cueball.position.x,cueball.position.y, mouseX, mouseY);
    noStroke();
    
    // If the cueball is touched, set the release ball variable to true
    if (cueball.touched()) {
      releaseBall = true;
    }
  }
  
  // If the cueball is out of bounds or moved, set the release ball variable to false
  if (cueball.outOfBounds() || cueball.moved()) {
    releaseBall = false;
  }
  
  // If the magnitude of the velocity of the ball is less than 0.01, set the value of the release ball variable to true and return the ball to its original position
  if (cueball.velocity.mag() < 0.01) {
    releaseBall = true;
    cueball.resetPosition();
  }
  
  // End the game when the number of balls in the balls array is zero
  if (balls.length == 0) {
    // Write the game over text
    text("Game Over!", 140, 200);
    
    // Make the ball immovable
    releaseBall = false;
  }
}

function mouseReleased() {
  if (releaseBall) {
    // When the mouse is released we give the ball a big push
    var direction = createVector(mouseX, mouseY);  

    // By subtracting the pos from mouse coordinates, we end up with a vector between the two points
    direction.sub(cueball.position);

    // We shorten the magnitude to reduce the power of the push
    direction.mult(-0.15);

    // Now we have our new velocity
    cueball.velocity.set(direction);
    
    // Increase the count each time the ball is released
    count = count + 1;
  }  
}

function ballCollision(ball1, ball2) {
  // Create a vector relative that points from the ball2 to the ball1
  let relative = p5.Vector.sub(ball1.position, ball2.position);
  
  // Calculate the distance between the ball1 and ball2, minus their radii
  let dist = relative.mag() - (ball1.r + ball2.r);
  
  // Check if the distance between the two balls is less than zero, which means they are colliding
  if (dist < 0) {
    // Move the balls apart by half of the overlap distance, which should separate them enough to prevent further collisions
    let movement = relative.copy().setMag(abs(dist/2));
    ball1.position.sub(movement);
    ball2.position.add(movement);

    // Add minimum separation distanceThe separation variable represents the minimum distance you want to maintain between the two balls after the collision
    let separation = ball1.r + ball2.r + minSeparation;
    
    // Calculate a normalized version of relative, which points in the direction from ball2 to ball1
    let thisToOtherNormal = relative.copy().normalize();
    
    // Calculate the approach speed of the two balls, which is the speed at which they are moving towards each other just before the collision
    let approachSpeed = ball1.velocity.dot(thisToOtherNormal) + -ball2.velocity.dot(thisToOtherNormal);
    
    // The approachVector represents the amount by which the velocities of the two balls should change as a result of the collision
    let approachVector = thisToOtherNormal.copy().setMag(approachSpeed);
    ball1.velocity.sub(approachVector);
    ball2.velocity.add(approachVector);

    // Ensure that the two balls are separated by at least minSeparation distance, even after the collision has occurred
    let overlap = separation - relative.mag();
    if (overlap > 0) {
      let adjust = relative.copy().normalize().mult(overlap);
      ball1.position.add(adjust);
      ball2.position.sub(adjust);
    }
  }
}
