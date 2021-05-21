let cvs = document.createElement("canvas");
let ctx = cvs.getContext("2d");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
let score = 0;
let keys = [];
let skillsTime = 0;
let skillsTime2 = 0;
let skillsTime3 = 0;
let skillsTime4 = 0;
let letskillsTime4 = 0;
let skillType;
let gamepaused = false;
let seconds = 0;
let frame = 0;
let nickname;
let frameCount = 0;
let playerBullets = [];
let bullet;
let directionEnimies = [];
let directionPlayer = "right";
let results = [];
let tmp = 0;
let res1;
let count;
let timeUpdater = null;
let check = false;
let skills = {};
skills.skill = new Image();
skills.skill.src = './img/arrow2.png';
skills.skill.width = 158.5;
skills.skill.height = 60.5;
skills.skill1 = new Image();
skills.skill1.src = './img/arrow3.png';
skills.skill1.width = 158.5;
skills.skill1.height = 60.5;
skills.skill2 = new Image();
skills.skill2.src = './img/skill1.png';
skills.skill2.width = 50;
skills.skill2.height = 50;
skills.skill3 = new Image();
skills.skill3pic = new Image();
skills.skill3.src = './img/skill2.png';
skills.skill3pic.src = './img/skillpic4.png'
skills.skill3.width = 650;
skills.skill3.height = 770;
skills.skill4 = new Image();
skills.skill4pic = new Image();
skills.skill4.src = './img/skill3.png';
skills.skill4pic.src = './img/skillpic2.png';
skills.skill4.width = 158;
skills.skill4.height = 118;
skills.skill5 = new Image();
skills.skill5pic = new Image();
skills.skill5pic.src = './img/skillpic3.png';
skills.skill5.src = './img/skill4.png';
skills.skill5.width = 172;
skills.skill5.height = 118;

class player {
    constructor(image, hp, mp) {
        this.x = 100;
        this.y = 320;
        this.hp = hp;
        this.hpMax = hp;
        this.image = new Image();
        this.image.src = image;
        this.mp = mp;
        this.mpMax = mp;
        this.width = 402.666667;
        this.height = 402.25;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 6;
        this.moving = false;
    }
}
class Enemies {
    constructor(type, image, x, y, hp) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.hp = hp;
        this.hpMax = hp;
        this.speed = 4;
        this.width = 400.952381;
        this.height = 450.75;
        this.frameX = 0;
        this.framey = 0;
        this.moving = true;
        this.isEnemDead = false;
    }

}
let objects = [
    new Enemies("goblin", "./img/goblin.png", 900, 295, 30),
    new Enemies("ork", "./img/ork.png", 1400, 290, 55),
    new Enemies("troll", "./img/troll.png", 1800, 287, 80)
]
let Player = [
    new player("./img/player1.png", 100, 100)
]
class Results {
    constructor(name, score, time) {
        this.namePlayer = name;
        this.scorePlayer = score;
        this.timePlayer = time;
    }
}
results = [new Results("0", 0, 0)];
let time = {
    min: 0,
    sec: 0
};