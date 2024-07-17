const areaWidth = document.querySelector('#container').offsetWidth; // Oyun alanının genişliği
const areaHeight = document.querySelector('#container').offsetHeight; // Oyun alanının yüksekliği
const gamearea = document.getElementById('container'); // Oyun alanı elementi
const number = document.getElementById('number');
const knowledge = document.getElementById('knowledge');

const jumpLongHeight = 150; // Uzun zıplama yüksekliği
const jumpShortHeight = 120; // Kısa zıplama yüksekliği
const jumpSpeed = 4; // Zıplama hızı
const startSpeed = 4;
const images = [
    'Character/character1.png','Character/character2.png','Character/character3.png','Character/character4.png',
    'Character/character5.png','Character/character6.png','Character/character7.png','Character/character8.png'
];

let currentImageIndex = 0;

let gameOver = false;
let runSpeed = startSpeed;
let time = 0;

let speedUpdateImage = 10;
let speedUpdatePeriod = 2000;

let keydownTime; // Boşluk tuşuna basılma zamanı

let player = {
    object: document.querySelector('#character'), // Oyuncu DOM elementi
    x: 0, // Oyuncunun x pozisyonu
    y: 0, // Oyuncunun y pozisyonu

    height: 50, // Oyuncunun boyu
    width: 30, // Oyuncunun genişliği

    shortJump: false, // Kısa zıplama durumu
    longJump: false, // Uzun zıplama durumu

    score: 0, // Oyuncunun puanı

    jumpStarted: false, // Zıplama başladı mı?
    jumpReachedTop: false // Zıplama zirveye ulaştı mı?
};

let obstacles = []; // Engellerin listesi

let gameStarted = false;

var game;
var view;

var tab = document.createElement('div');
gamearea.appendChild(tab);
tab.id = "tab";
tab.textContent = "Start";


function start() {
    if(gameStarted == false) {
        
        setTimeout(function(){tab.remove();}, 40);

        game = setInterval(function () {
            play();
        }, 10); // Oyun döngüsü, 20ms aralıklarla `play()` fonksiyonunu çağırır
    
        view = setInterval(function () {
            display(); // Ekranı güncelle
        }, 10);

        gameStarted = true;
    }
};

function play() {

    time+=1;
    
    player.x += runSpeed; // Oyuncunun x pozisyonunu koşu hızıyla güncelle

    if (player.jumpStarted) {
        // Eğer oyuncu zıplama başladıysa
        if ((player.y >= jumpShortHeight) && player.shortJump) {
            player.jumpReachedTop = true;
        }
        else if ((player.y >= jumpLongHeight) && player.longJump) {
            player.jumpReachedTop = true;
        }

        if (player.jumpReachedTop) {
            // Zıplama zirveye ulaştıysa
            player.y -= jumpSpeed; // Yukarı doğru zıpla
            if (player.y <= 0) {
                player.y = 0; // Oyuncunun y pozisyonunu sıfırla
                player.jumpStarted = false; // Zıplama durumunu sıfırla
                player.jumpReachedTop = false; // Zıplama zirveye ulaştı durumunu sıfırla
            }
        }
        else {
            player.y += jumpSpeed; // Zıplama devam ediyorsa aşağı doğru zıpla
        }
    }

    //ekrandan cikan obstacle lari kaldir gereksiz yere kalmasin
    for (var i = 0; i < obstacles.length; i++) {
        if(obstacles[i].x<player.x-100){
            gamearea.removeChild(obstacles[i].object); //ekrandan kaldir
            obstacles.splice(i,1);
            continue;
        }
    }

        distanceControl();
      
};

function display() {
    var playerDisplayLocations = convertToDisplayLocations(player);
    player.object.style.top = (playerDisplayLocations.y - player.height) + "px"; // Oyuncunun y pozisyonunu ayarla
    player.object.style.left = playerDisplayLocations.x + "px"; // Oyuncunun x pozisyonunu ayarla

    // Engelleri ekrana yerleştir
    for (var i = 0; i < obstacles.length; i++) {
        var oDisplayLocations = convertToDisplayLocations(obstacles[i]);
        obstacles[i].object.style.top = (oDisplayLocations.y - obstacles[i].height) + "px"; // Engelin yüksekliğini ayarla
        obstacles[i].object.style.left = oDisplayLocations.x + "px"; // Engelin x pozisyonunu ayarla
        obstacles[i].object.style.height = obstacles[i].height + "px"; // Engelin yüksekliğini ayarla
        obstacles[i].object.style.width = obstacles[i].width + "px"; // Engelin genişliğini ayarla
    }

    changeImage();

    changeSpeed();
    
    increaseScore();

}

function convertToDisplayLocations(o) {
    // Nesnenin oyun alanındaki pozisyonunu görüntüleme pozisyonuna dönüştürür
    var cameraResult = adjustCameraView(o);

    var resultX = 50 + cameraResult.x; // X pozisyonu ayarı
    var resultY = areaHeight - 70 - cameraResult.y; // Y pozisyonu ayarı (eksen tersine)

    var result = {
        x: resultX,
        y: resultY
    };

    return result;
}

function adjustCameraView(o) {
    // Kamera ayarı, oyuncunun x pozisyonuna göre sabit kalır, y pozisyonu ayarları
    var result = {
        x: o.x - player.x,
        y: o.y
    };
    return result;
};

setTimeout(obstacle, getRandomInterval(500,3000));

function newObstacle() {
    // Yeni bir engel oluşturur ve DOM'a ekler
    var o = {
        x: player.x + areaWidth - 60, // Engelin x pozisyonu
        y: 0, // Engelin y pozisyonu
        height: Math.ceil((Math.random()*2))*20+20, // Engelin yüksekliği
        width: 40, // Engelin genişliği
        object: null,
    };

    o.object = document.createElement('div'); // Yeni bir DOM elementi oluştur
    
    o.object.style.left = "0px";
    o.object.style.top = "0px";
    o.object.style.height = "0px";
    o.object.style.width = "0px";
    // Ne için olduğunu sor!!!

    o.object.className = 'obstacle';

    gamearea.appendChild(o.object); // Oyun alanına ekler
    o.object.className = 'obstacle';

    setTimeout(obstacle, getRandomInterval(1000,3000));

    return o;
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
gamearea.addEventListener('mousedown', keydown);
gamearea.addEventListener('mouseup', keyup);
gamearea.addEventListener('touchstart', keydown);
gamearea.addEventListener('touchend', keyup);

function keydown(e) {
    if (e.key === ' '||e.button === 0||e.type === 'touchstart') {
        keydownTimeControl(); // Boşluk tuşuna basılma olayını kontrol et
        start();

        if(gameOver) {
            restart();
            gameOver = false;
        }
    }
};

function keyup(e) {
    if (e.key === ' '||e.button === 0||e.type === 'touchend') {
        keyupTimeControl(); // Boşluk tuşuna bırakılma olayını kontrol et
    }
};

function keydownTimeControl() {
    if(!keydownTime) {
        keydownTime = new Date().getTime(); // Boşluk tuşuna basılma zamanını al
    }
    player.shortJump = false; // Kısa zıplama modunu kapat
    player.longJump = true; // Uzun zıplama modunu aç
    player.jumpStarted = true;
};

function keyupTimeControl() {

    if (keydownTime) {
        const keyupTime = new Date().getTime();
        const duration = keyupTime - keydownTime; // Tuş basılı kalma süresini hesapla

        if (duration <= 300) {
            player.shortJump = true; // Kısa zıplama modunu kapat
            player.longJump = false; // Uzun zıplama modunu aç
        }
    }

    keydownTime = null;
};

function getRandomInterval(min,max) {
    return Math.random()*(max-min)+min;
};



function obstacle() {
    obstacles.push(newObstacle());
};

function distanceControl() {
    if(obstacles.length>=1) {
        let player_right = player.x + player.width;
        let player_left = player.x;
        let obstacle_right = obstacles[0].x + obstacles[0].width;
        let obstacle_left = obstacles[0].x;
        let obstacle_height = obstacles[0].height - 10;
        
        if((player_right>=obstacle_left)&&(player_left<=obstacle_right)&&(player.y>=0)&&(player.y<=obstacle_height)) {
            clearInterval(game);
            clearInterval(view);

            tab = document.createElement('div');
            gamearea.appendChild(tab);
            tab.id = "tab";
            tab.textContent = "Game Over";

            gameOver = true;

        }
    }
};

function changeSpeed() {

    runSpeed = startSpeed+time*(0.001);

};

function changeImage() {

    if(time%speedUpdatePeriod==0) {
        if(speedUpdateImage>2) {
            speedUpdateImage -= 1;
        }
    }

    console.log(speedUpdateImage);

    if(time%speedUpdateImage==0) {
        currentImageIndex = (currentImageIndex + 1)%images.length;
        player.object.src = images[currentImageIndex];
    }

};

function increaseScore() {

    player.score = Math.floor(player.x/100);

    number.innerText = " " +  player.score;

};

function restart() {
    location.reload();
};
