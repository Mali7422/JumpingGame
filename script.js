const areaWidth = document.querySelector('#container').offsetWidth; // Oyun alanının genişliği
const areaHeight = document.querySelector('#container').offsetHeight; // Oyun alanının yüksekliği
const gamearea = document.getElementById('container'); // Oyun alanı elementi

const jumpLongHeight = 250; // Uzun zıplama yüksekliği
const jumpShortHeight = 120; // Kısa zıplama yüksekliği
const runSpeed = 5; // Koşu hızı
const jumpSpeed = 5; // Zıplama hızı

let obstacle_height; // Engelin yüksekliği
let obstacle_width = 50; // Engelin genişliği

let keydownTime; // Boşluk tuşuna basılma zamanı

let player = {
    object: document.querySelector('#player'), // Oyuncu DOM elementi
    x: 0, // Oyuncunun x pozisyonu
    y: 0, // Oyuncunun y pozisyonu

    height: 50, // Oyuncunun boyu
    width: 50, // Oyuncunun genişliği

    shortJump: false, // Kısa zıplama durumu
    longJump: false, // Uzun zıplama durumu

    score: 0, // Oyuncunun puanı

    jumpStarted: false, // Zıplama başladı mı?
    jumpReachedTop: false // Zıplama zirveye ulaştı mı?
};

let obstacles = []; // Engellerin listesi

obstacles.push(newObstacle()); // Başlangıçta bir engel oluştur

var game = setInterval(function () {
    play();
}, 20); // Oyun döngüsü, 20ms aralıklarla `play()` fonksiyonunu çağırır

function play() {
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
                obstacles.push(newObstacle()); // Yeni bir engel ekle
                player.y = 0; // Oyuncunun y pozisyonunu sıfırla
                player.jumpStarted = false; // Zıplama durumunu sıfırla
                player.jumpReachedTop = false; // Zıplama zirveye ulaştı durumunu sıfırla
            }
        }
        else {
            player.y += jumpSpeed; // Zıplama devam ediyorsa aşağı doğru zıpla
        }
    }

    display(); // Ekranı güncelle
};

function display() {
    var playerDisplayLocations = convertToDisplayLocations(player);
    player.object.style.top = (playerDisplayLocations.y - player.height) + "px"; // Oyuncunun yüksekliğini ayarla
    player.object.style.left = playerDisplayLocations.x + "px"; // Oyuncunun x pozisyonunu ayarla

    // Engelleri ekrana yerleştir
    for (var i = 0; i < obstacles.length; i++) {
        var oDisplayLocations = convertToDisplayLocations(obstacles[i]);
        obstacles[i].object.style.top = (oDisplayLocations.y - obstacles[i].height) + "px"; // Engelin yüksekliğini ayarla
        obstacles[i].object.style.left = oDisplayLocations.x + "px"; // Engelin x pozisyonunu ayarla
        obstacles[i].object.style.height = obstacles[i].height + "px"; // Engelin yüksekliğini ayarla
        obstacles[i].object.style.width = obstacles[i].width + "px"; // Engelin genişliğini ayarla
    }
}

function convertToDisplayLocations(o) {
    // Nesnenin oyun alanındaki pozisyonunu görüntüleme pozisyonuna dönüştürür
    var cameraResult = adjustCameraView(o);

    var resultX = 50 + cameraResult.x; // X pozisyonu ayarı
    var resultY = areaHeight - 50 - cameraResult.y; // Y pozisyonu ayarı (eksen tersine)

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
}

function newObstacle() {
    // Yeni bir engel oluşturur ve DOM'a ekler
    var o = {
        x: player.x + areaWidth - 100, // Engelin x pozisyonu
        y: 0, // Engelin y pozisyonu
        height: 80, // Engelin yüksekliği
        width: 40, // Engelin genişliği
        object: null,
    };

    let baitObject = document.createElement('div'); // Yeni bir DOM elementi oluştur

    baitObject.style.left = "0px";
    baitObject.style.top = "0px";
    baitObject.style.height = "0px";
    baitObject.style.width = "0px";

    baitObject.className = 'obstacle'; // CSS sınıfı ekle

    o.object = baitObject; // DOM elementini engel nesnesine atar

    gamearea.appendChild(baitObject); // Oyun alanına ekler

    return o;
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(e) {
    if (e.key === ' ') {
        keydownTimeControl(); // Boşluk tuşuna basılma olayını kontrol et
        
    }
};

function keyup(e) {
    if (e.key === ' ') {
        keyupTimeControl(); // Boşluk tuşuna bırakılma olayını kontrol et
    }
};

function keydownTimeControl() {
    console.log("y :" + player.y);
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
            console.log(duration);
            player.shortJump = true; // Kısa zıplama modunu kapat
            player.longJump = false; // Uzun zıplama modunu aç
        }
    }

    keydownTime = null;
};
