const areaWidth = document.querySelector('#container').offsetWidth;
const areaHeight = document.querySelector('#container').offsetHeight;
const gamearea = document.getElementById('container');

const jumpLongHeight = 120;
const jumpShortHeight = 70;
const runSpeed = 5;
const jumpSpeed = 5;

let obstacle_height;
let obstacle_width = 50;

let keydownTime;

let player = {
    object: document.querySelector('#player'),

    x: 0,
    y: 0,

    height: 50,
    width: 50,

    shortJump: false,
    longJump: false,

    score: 0,

    jumpStarted: false,
    jumpReachedTop: false
};

let obstacles = [];

obstacles.push(newObstacle());

var game = setInterval(function () {
    play();
}, 20);

function play() {
    player.x += runSpeed;

    if (player.jumpStarted) {
        if (player.y >= jumpShortHeight && player.shortJump) {
            player.jumpReachedTop = true;
            player.y -= jumpSpeed;
        }
        else if (player.y >= jumpLongHeight && player.longJump) {
            player.jumpReachedTop = true;
            player.y -= jumpSpeed;
        }
        else if (player.jumpReachedTop) {

            player.y -= jumpSpeed;
            if (player.y <= 0) {
                obstacles.push(newObstacle());
                player.y = 0;
                player.jumpStarted = false;
                player.jumpReachedTop = false;
            }
        }
        else {
            player.y += jumpSpeed;
        }
    }

    display();
};


function display() {
    var playerDisplayLocations = convertToDisplayLocations(player);
    player.object.style.top = (playerDisplayLocations.y - player.height) + "px";
    player.object.style.left = playerDisplayLocations.x + "px";

    //obsticle larida goruntule
    for (var i = 0; i < obstacles.length; i++) {
        var oDisplayLocations = convertToDisplayLocations(obstacles[i]);
        obstacles[i].object.style.top = (oDisplayLocations.y - obstacles[i].height) + "px";
        obstacles[i].object.style.left = oDisplayLocations.x + "px";
        obstacles[i].object.style.height = obstacles[i].height + "px";
        obstacles[i].object.style.width = obstacles[i].width + "px";
    }
}

function convertToDisplayLocations(o) {
    //sifira sifir noktasinin karsiligi
    // 50px, areaheight - 50px
    var cameraResult = adjustCameraView(o);

    var resultX = 50 + cameraResult.x;
    var resultY = areaHeight - 50 - cameraResult.y; //cikartiyoruz cunku normal eksende tam ters sekilde
    var result = {
        x: resultX,
        y: resultY
    };



    return result;
}

function adjustCameraView(o) {
    // kamera sonra oyuncunun x pozisyonunda sabit kalacak oda yukaridaki noktalar
    var result = {
        x: o.x - player.x,
        y: o.y
    };
    return result;
}



function newObstacle() {
    var o = {
        x: player.x + areaWidth - 100,
        y: 0,
        height: 80,
        width: 40,
        object: null,
    };
    let baitObject = document.createElement('div');
    baitObject.style.left = "0px";
    baitObject.style.top = "0px";
    baitObject.style.height = "0px";
    baitObject.style.width = "0px";

    baitObject.className = 'obstacle';

    o.object = baitObject; //olusan DOM elementini referans olarak bait nesnesininde icine at sonradan erimde kullanilabilsin

    gamearea.appendChild(baitObject);

    return o;
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(e) {
    if (e.key === ' ') {
        keydownTimeControl();
    }
};

function keyup(e) {
    if (e.key === ' ') {
        keyupTimeControl();
    }
};

function keydownTimeControl() {
    player.jumpStarted = true;
    player.shortJump = true;
    if (!keydownTime) {
        keydownTime = new Date().getTime();
    }
};

function keyupTimeControl() {
    if (keydownTime) {
        const keyupTime = new Date().getTime();
        const duration = keyupTime - keydownTime;

        if (duration >= 400) {
            player.shortJump = false;
            player.longJump = true;
        }
    }
};
