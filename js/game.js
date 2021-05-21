if (localStorage.getItem("results") == null) {
    localStorage.setItem("results", JSON.stringify([]));
}
if (JSON.parse(localStorage.getItem("results")).length >= 2) {
    results = JSON.parse(localStorage.getItem("results"));
}
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

window.addEventListener("keydown", function (e) { KeyDown(e); });
window.addEventListener("keyup", function (e) {
    delete keys[e.keyCode];
    Player[0].moving = false;
});

/* keybord */

function KeyDown(e) {
    switch (e.keyCode) {
        case 37: // Left
            check = false;
            if (Player[0].x > 100) {
                directionPlayer = "left";
                Player[0].x -= Player[0].speed;
                Player[0].moving = true;
                Player[0].frameY = 1;
            }
            break;

        case 39: // Right 
            check = false;
            if (Player[0].x <= cvs.width - Player[0].width) {
                directionPlayer = "right"
                Player[0].x += Player[0].speed;
                Player[0].moving = true;
                Player[0].frameY = 0;
            } else {
                gamepaused = true;
                gameOver();
            }
            break;
        case 32: // Fire (space)
            check = false;
            skillType = "skill";
            Player[0].moving = true;
            if (directionPlayer == "right") Player[0].frameY = 2;
            else Player[0].frameY = 3;
            if (directionPlayer == "right") firePlayerBulletsRight(skillType);
            else firePlayerBulletsLeft(skillType);
            break;
        case 27: // Esc (pause game)
            gamepaused = !gamepaused;
            break;
        case 49: // 1 (plus 50 hp)
            check = false;
            if (Player[0].hp < 100) {
                if (Player[0].mp >= 50 && Math.floor(((Date.now() - skillsTime) / 1000)) >= 8) {
                    skillsTime = Date.now();
                    Player[0].mp -= 50;
                    if (Player[0].hp >= 50) Player[0].hp = 100;
                    else Player[0].hp += 50;
                }
            }
            break;
        case 50: // 2 
            check = false;
            if (Player[0].mp > 15 && Math.floor(((Date.now() - skillsTime2) / 1000)) >= 4) {
                skillType = "skill4";
                Player[0].moving = true;
                Player[0].frameY = 2;
                skillsTime2 = Date.now();
                Player[0].mp -= 15;
                if (directionPlayer == "right") firePlayerBulletsRight(skillType);
                else firePlayerBulletsLeft(skillType);
            }
            break;
        case 51: // 3
            check = false;
            if (Player[0].mp > 35 && Math.floor(((Date.now() - skillsTime3) / 1000)) >= 6) {
                skillsTime3 = Date.now();
                Player[0].mp -= 35;
                skillType = "skill5";
                Player[0].moving = true;
                Player[0].frameY = 2;
                if (directionPlayer == "right") firePlayerBulletsRight(skillType);
                else firePlayerBulletsLeft(skillType);
            }
            break;
        case 52: // 4 
            if (Player[0].mp > 20 && Math.floor(((Date.now() - skillsTime4) / 1000)) >= 6) {
                skillsTime4 = Date.now();
                Player[0].mp -= 20;
                check = true;
                Player[0].frameY = 4;
            }
            break;
    }
}

/* animate player and enemies */

function handlePlayerFrame() {
    if (Player[0].frameX < 8 && Player[0].moving) Player[0].frameX++;
    else Player[0].frameX = 0;
}
function enemiesMove() {
    for (let i = 0; i < objects.length; i++) {
        if (Player[0].x <= objects[i].x) {
            directionEnimies[i] = "left";
            objects[i].x -= objects[i].speed;
            objects[i].framey = 0;
        } else if (Player[0].x >= objects[i].x) {
            directionEnimies[i] = "right";
            objects[i].x += objects[i].speed;
            objects[i].framey = 2;
        }
    }
}
function handleEnimiesFrame() {
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].type == "goblin") {
            if (objects[i].frameX < 20 && objects[i].moving) objects[i].frameX++;
            else objects[i].frameX = 0;
        } else if (objects[i].type == "ork") {
            if (objects[i].frameX < 13 && objects[i].moving) objects[i].frameX++;
            else objects[i].frameX = 0;
        } else if (objects[i].type == "troll") {
            if (objects[i].frameX < 6 && objects[i].moving) objects[i].frameX++;
            else objects[i].frameX = 0;
        }

    }
}
function addEnimies() {
    for (let i = 0; i < objects.length; i++) {
        drawSprite(objects[i].image, objects[i].width * objects[i].frameX, objects[i].height * objects[i].framey, objects[i].width, objects[i].height, objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        ctx.save();
        ctx.fillStyle = 'red';
        let width = 100 * objects[i].hp / objects[i].hpMax;
        if (width < 0)
            width = 0;
        ctx.fillRect(objects[i].x + objects[i].width / 2.5, objects[i].y + 60, width, 10);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(objects[i].x + objects[i].width / 2.5, objects[i].y + 60, 100, 10);

        ctx.restore();
    }
}
function randomlyGenerateEnemy() {
    let x = Player[0].x + Player[0].width + Math.random() * cvs.width;
    let y = 290 + Math.random() * 10;
    let hp = [30, 55, 80];
    let name = ["goblin", "ork", "troll"];
    let typeEnemies = Math.floor(Math.random() * 2);
    let enemies = ["./img/goblin.png", "./img/ork.png", "./img/troll.png"];
    objects[objects.length] = new Enemies(name[typeEnemies], enemies[typeEnemies], x, y, hp[typeEnemies]);
};
function attackMob(enem, i) {
    if (directionEnimies[i] == "left") enem.framey = 1;
    else enem.framey = 3;
    objects[i].moving = true;
    if (enem.type == "goblin") {
        if (enem.frameX < 20) {
            enem.frameX++;
            if (enem.frameX == 20) {
                Player[0].hp -= 3;
                if (Player[0].hp <= 0) {
                    gamepaused = true;
                    gameOver();
                }
            }
        }
        else enem.frameX = 0;
    } else
        if (enem.type == "ork") {
            if (enem.frameX < 13) {
                enem.frameX++;
                if (enem.frameX == 13) {
                    Player[0].hp -= 8;
                    if (Player[0].hp <= 0) {
                        gamepaused = true;
                        gameOver();
                    }
                }
            }
            else enem.frameX = 0;
        }
        else if (enem.type == "troll") {
            if (enem.frameX < 6) {
                enem.frameX++;
                if (enem.frameX == 6) {
                    Player[0].hp -= 11;
                    if (Player[0].hp <= 0) {
                        gamepaused = true;
                        gameOver();
                    }
                }
            }
            else enem.frameX = 0;
        }
}

/* animate bullets */

function updatePlayerBullets() {
    for (i in playerBullets) {
        bullet = playerBullets[i];
        if (directionPlayer == "right") {
            bullet.x += 80;
        }
        if (directionPlayer == "left") {
            playerBullets.splice(i, 1);
            bullet.x -= 80;
        }
        if (bullet.x > cvs.width || bullet.x < 0) playerBullets.splice(i, 1);
    }
} 
function firePlayerBulletsRight(type) {
    switch (type) {
        case "skill":
            if (Player[0].frameX >= 8) {
                playerBullets.push({
                    x: Player[0].x + 300,
                    y: Player[0].y + 187,
                });
            }
            break;
        case "skill4":
            playerBullets.push({
                x: Player[0].x + 300,
                y: Player[0].y + 157,
            });
            break;
        case "skill5":
            playerBullets.push({
                x: Player[0].x + 300,
                y: Player[0].y + 157,
            });
            break;
    }
}
function firePlayerBulletsLeft(type) {
    switch (type) {
        case "skill":
            if (Player[0].frameX >= 8) {
                playerBullets.push({
                    x: Player[0].x - 300,
                    y: Player[0].y + 187,
                });
            }
            break;
        case "skill4":
            playerBullets.push({
                x: Player[0].x - 300,
                y: Player[0].y + 157,
            });
            break;
        case "skill5":
            playerBullets.push({
                x: Player[0].x - 300,
                y: Player[0].y + 157,
            });
            break;
    }
}
function drawPlayerBullets() {
    for (i in playerBullets) {
        bullet = playerBullets[i];
        switch (skillType) {
            case "skill":
                if (directionPlayer == "left") {
                    drawSprite(skills.skill1, 0, 0, 158.5, 60.5, bullet.x, bullet.y, skills.skill1.width, skills.skill1.height);
                } else drawSprite(skills.skill, 0, 0, 158.5, 60.5, bullet.x, bullet.y, skills.skill.width, skills.skill.height);
                break;
            case "skill4":
                drawSprite(skills.skill4, 0, 0, 158, 150, bullet.x, bullet.y, skills.skill4.width, skills.skill4.height);
                break;
            case "skill5":
                drawSprite(skills.skill5, 0, 0, 158, 150, bullet.x, bullet.y, skills.skill5.width, skills.skill5.height);
                break;
        }
    }
}
function getHealth() {
    let healthTime = Date.now();
    Player[0].hp += 0.1;
    if (Player[0].hp > 100) {
        Player[0].hp = 100;
    }
    Player[0].mp += 0.3;
    if (Player[0].mp > 100) {
        Player[0].mp = 100
    }
}

/* Collisions */

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
}
function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1], pos[0] + size[0], pos[1] + size[1], pos2[0], pos2[1], pos2[0] + size2[0], pos2[1] + size2[1]);
}
function checkCollisions() {
    for (let i = 0; i < objects.length; i++) {
        let pos = [];
        pos[0] = objects[i].x;
        pos[1] = objects[i].y;
        let size = [];
        size[0] = objects[i].width;
        size[1] = objects[i].height;

        for (let j = 0; j < playerBullets.length; j++) {
            let pos2 = [];
            pos2[0] = playerBullets[j].x;
            pos2[1] = playerBullets[j].y
            let size2 = [];
            size2[0] = playerBullets[j].width;
            size2[1] = playerBullets[j].height;

            if (boxCollides(pos, size, pos2, size2)) {
                switch (skillType) {
                    case "skill":
                        first_skill(i, j);
                        break;
                    case "skill4":
                        fourth_skill(i, j);
                        break;
                    case "skill5":
                        fifth_skill(i, j);
                        break;
                }
            }
        }
        let pos3 = [];
        pos3[0] = Player[0].x;
        pos3[1] = Player[0].y;
        let size3 = [];
        size3[0] = Player[0].width - 150;
        size3[1] = Player[0].height;
        if (boxCollides(pos, size, pos3, size3)) {
            objects[i].speed = 0;
            objects[i].moving = false;
            if (check == false) attackMob(objects[i], i);
        } else if (!(boxCollides(pos, size, pos3, size3))) {
            objects[i].speed = 5;
            objects[i].moving = true;
        }
    }
}

/*  Skills   */

function first_skill(i, j) {
    if (objects[i].type == "goblin") {
        objects[i].hp -= 15;
        playerBullets.splice(j, 1);
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    } else if (objects[i].type == "ork") {
        objects[i].hp -= 15;
        playerBullets.splice(j, 1);
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    } else if (objects[i].type == "troll") {
        objects[i].hp -= 15;
        playerBullets.splice(j, 1);
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    }
}
function fourth_skill(i) {
    if (objects[i].type == "goblin") {
        objects[i].hp -= 30;
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    } else if (objects[i].type == "ork") {
        objects[i].hp -= 30;
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    } else if (objects[i].type == "troll") {
        objects[i].hp -= 30;
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    }
}
function fifth_skill(i) {
    if (objects[i].type == "goblin") {
        objects[i].hp -= 60;
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    } else if (objects[i].type == "ork") {
        objects[i].hp -= 60;
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    } else if (objects[i].type == "troll") {
        objects[i].hp -= 60;
        if (objects[i].hp <= 0) {
            objects.splice(i, 1);
            directionEnimies.splice(i, 1);
            i--;
            score++;
        }
    }
}

/* for start game */

function gameOver() {
    document.getElementById('game-over-overlay').style.display = 'flex';
    document.getElementById('res').style.display = 'flex';
    if (tmp == 0) {
        if (results.length == 10) {
            results[9] = new Results(nickname, score, `${time.min}:${time.sec}`);
        } else results[results.length] = new Results(nickname, score, `${time.min}:${time.sec}`);
        tmp++;
    }
    sortRes(results);
    localStorage.setItem("results", JSON.stringify(results));
    res1 = document.getElementsByClassName('1');
    count = 0;
    for (let i = 0; i < results.length; i++) {
        res1[count++].innerHTML = results[i].namePlayer;
        res1[count++].innerHTML = results[i].scorePlayer;
        res1[count++].innerHTML = results[i].timePlayer;
    }
    document.getElementById('play-again').addEventListener('click', function () {
        document.getElementById('game-over-overlay').style.display = 'none';
        document.getElementById('res').style.display = 'none';
        clearInterval(timer);
        clearInterval(timeUpdater);
        startGame();
    });
}
function sortRes(arr) {
    arr.sort((a, b) => a.scorePlayer < b.scorePlayer ? 1 : -1);
}
function timers() {
    frame++;
    if (frame == 30) {
        frame = 0;
    }
    if (time.min < 10) {
        ctx.fillText(time.sec < 10 ? `0${time.min}:0${time.sec}` : `0${time.min}:${time.sec}`, cvs.width - 100, 30);
    } else ctx.fillText(time.sec < 10 ? `${time.min}:0${time.sec}` : `${time.min}:${time.sec}`, cvs.width - 100, 30);
}
function Start() {
    timer = setInterval(update, 60);
    timeUpdater = setInterval(increaseTime, 1000);
}
function increaseTime() {
    if (gamepaused) return;
    if (time.sec == 60) {
        time.min++;
        time.sec = 0;
    }
    time.sec++;
}
function startScreenGame() {
    let container = document.querySelector(".panel");
    container.style.display = "flex";
    let button = document.getElementById("sub");
    let check = document.getElementById("nickname");
    button.addEventListener("click", (e) => {
        e.preventDefault();
        if (check.checkValidity()) {
            nickname = check.value;
            container.style.display = "none";
            document.body.appendChild(cvs);
            Start();
        }
    });
}
function startGame() {
    Player[0].hp = 100;
    Player[0].x = 100;
    Player[0].mp = 100;
    time.min = 0;
    time.sec = 0;
    score = 0;
    objects = [];
    gamepaused = false;
    Start();
}
function update() {
    if (gamepaused) {
        if (Player[0].hp > 0 && Player[0].x < cvs.width - Player[0].width) ctx.fillText('Пауза, нажмите ESC для возвращения в игру!', cvs.width / 2 - cvs.width / 4, cvs.height / 2 - cvs.height / 10);
        return;
    }
    frameCount++;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawMap();
    drawPlayer();
    ctx.font = '35px sefir';
    ctx.fillStyle = "white";
    ctx.fillText('Игрок: ' + nickname, 10, 40);
    ctx.fillText('HP ' + Math.floor(Player[0].hp), cvs.width / 2 - 125, 40);
    ctx.fillText('MP ' + Math.floor(Player[0].mp), cvs.width / 2 - 125, 85);
    ctx.fillText('Баллы: ' + score, 10, 90);
    handlePlayerFrame();
    addEnimies();
    if (frameCount % 100 === 0)      //every 4 sec
        randomlyGenerateEnemy();
    drawPlayerBullets();
    updatePlayerBullets();
    enemiesMove();
    handleEnimiesFrame();
    checkCollisions();
    timers();
    getHealth();
    tmp = 0;
}
function drawMap() {
    let bg = new Image();
    bg.src = "./img/bg-game.png";
    bg.width = 9558;
    bg.height = 1080;
    let x = cvs.width / 2 - Player[0].x - Player[0].width - Player[0].width / 2 - 64;
    ctx.drawImage(bg, -x, 0, bg.width, 1080, 0, 0, bg.width, cvs.height);
    ctx.drawImage(skills.skill2, cvs.width / 2 - 150, cvs.height - 55, 60, 50);
    ctx.drawImage(skills.skill4pic, cvs.width / 2 - 80, cvs.height - 55, 60, 50);
    ctx.drawImage(skills.skill5pic, cvs.width / 2 - 10, cvs.height - 55, 60, 50);
    ctx.drawImage(skills.skill3pic, cvs.width / 2 + 60, cvs.height - 55, 60, 50);
}
function drawPlayer() {
    drawSprite(Player[0].image, Player[0].width * Player[0].frameX, Player[0].height * Player[0].frameY, Player[0].width, Player[0].height, Player[0].x, Player[0].y, Player[0].width, Player[0].height);
    ctx.save();
    ctx.fillStyle = 'red';
    let width = 250 * Player[0].hp / Player[0].hpMax, width2 = 250 * Player[0].mp / Player[0].mpMax;
    if (width < 0)
        width = 0;
    ctx.fillRect(cvs.width / 2 - 125, 10, width, 35);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(cvs.width / 2 - 125, 10, 250, 35);

    if (width2 < 0) width2 = 0;
    ctx.fillStyle = 'blue';
    ctx.fillRect(cvs.width / 2 - 125, 55, width2, 35);
    ctx.strokeRect(cvs.width / 2 - 125, 55, 250, 35);
    ctx.restore();
}
startScreenGame();
