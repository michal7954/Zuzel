var game = {
    collection: [],
    add: function (i) {
        this.collection.push(new _Player(i));
    },
    step: 6, //prędkość
    promien: 3, //promień skrętu
    w: 50, // 60 - drift | 30 - środek geometryczny
    h: 23,
    count: 4, //liczba graczy
    laps: 4, //liczba okrążeń
};

function _Player(i) {
    this.number = i;
    this.poz = {}
    this.poz.x = 200;
    this.alfa = 0;
    this.rad = 0
    this.game = true;
    this.push = false;
    this.vect = {};
    this.pixel;
    this.skip = false;
    this.path = [];
    this.lap = 0;

    switch (i) {
        case 0:
            this.control = "KeyA"
            this.poz.y = 320;
            this.img = document.getElementById("i1");
            this.color = "blue";
            this.rgb = "rgba(0,0,255,";
            break;
        case 1:
            this.control = "KeyS"
            this.poz.y = 350;
            this.img = document.getElementById("i2");
            this.color = "yellow";
            this.rgb = "rgba(255,255,0,"
            break;
        case 2:
            this.control = "KeyD"
            this.poz.y = 380;
            this.img = document.getElementById("i3");
            this.color = "red";
            this.rgb = "rgba(255,0,0,";
            break;
        case 3:
            this.control = "KeyF"
            this.poz.y = 410;
            this.img = document.getElementById("i4");
            this.color = "green";
            this.rgb = "rgba(0,255,0,";
            break;
    }

    document.onkeydown = function (e) {
        for (j = 0; j < game.collection.length; j++) {
            player = game.collection[j]
            if (e.code == player.control) {
                player.push = true;
            }
        }
    }
    document.onkeyup = function (e) {
        for (j = 0; j < game.collection.length; j++) {
            player = game.collection[j]
            if (e.code == player.control) {
                player.push = false;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function (e) {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    function ending() {
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }

    function clear() {
        ctx.beginPath();
        ctx.rect(0, 0, 800, 400);
        ctx.fillStyle = "red";
        ctx.fill();
        ending();

        ctx.beginPath();
        ctx.arc(200, 200, 200, 1 / 2 * Math.PI, 3 / 2 * Math.PI);
        ctx.arc(600, 200, 200, 3 / 2 * Math.PI, 1 / 2 * Math.PI);
        ctx.lineTo(200, 400);
        ctx.fillStyle = "rgb(153, 77, 0)";
        ctx.fill();
        ending();

        ctx.beginPath();
        ctx.arc(200, 200, 80, 1 / 2 * Math.PI, 3 / 2 * Math.PI);
        ctx.arc(600, 200, 80, 3 / 2 * Math.PI, 1 / 2 * Math.PI);
        ctx.lineTo(200, 280);
        ctx.fillStyle = "red";
        ctx.fill();
        ending();
    }

    while (!(players == 2 || players == 3 || players == 4)) {
        var players = prompt("Podaj liczbę graczy (2-4)", 4);
    }
    game.count = players;

    var wiersz = "<tr><td class='number'></td><td class='control'></td><td class='color'></td><td class='lap'></td><td class='stan'></td><td class='deklaracja'>NO</td></tr>"
    var znacznik = document.getElementById("table");
    for (i = 0; i < game.count; i++) {
        game.add(i);
        znacznik.innerHTML += wiersz;
    }

    var table = {
        numbers: document.getElementsByClassName("number"),
        controls: document.getElementsByClassName("control"),
        colors: document.getElementsByClassName("color"),
        laps: document.getElementsByClassName("lap"),
        stans: document.getElementsByClassName("stan"),
        deklaracjas: document.getElementsByClassName("deklaracja")
    }

    function data_update(i) {
        table.numbers[i].innerHTML = game.collection[i].number;
        table.controls[i].innerHTML = game.collection[i].control;
        table.colors[i].innerHTML = game.collection[i].color;
        table.laps[i].innerHTML = game.laps - game.collection[i].lap;

        if (game.collection[i].game) {
            table.stans[i].innerHTML = "W trakcie"
        }
        else {
            table.stans[i].innerHTML = "Przegrana"
        }
    }

    for (i = 0; i < game.collection.length; i++) {
        data_update(i);
    }


    function animation() {
        clear();

        for (i = 0; i < game.collection.length; i++) {

            if (!game.collection[i].skip) {

                if (game.collection[i].push) {
                    game.collection[i].alfa = game.collection[i].alfa - game.promien;
                    game.collection[i].rad = game.collection[i].alfa * Math.PI / 180;
                }

                game.collection[i].lap = parseInt(Math.abs((game.collection[i].alfa) / 360) + 0.02)
                if (game.collection[i].lap > game.laps - 1) {
                    window.alert("Wygrał gracz " + i);
                    location.reload();
                }

                game.collection[i].vect.x = Math.cos(game.collection[i].rad) * game.step;
                game.collection[i].vect.y = Math.sin(game.collection[i].rad) * game.step;

                game.collection[i].poz.x = game.collection[i].poz.x + game.collection[i].vect.x;
                game.collection[i].poz.y = game.collection[i].poz.y + game.collection[i].vect.y;

                var obj = { x: game.collection[i].poz.x - game.w, y: game.collection[i].poz.y - game.h }
                game.collection[i].path.push(obj);
                if (game.collection[i].path.length > 100) game.collection[i].path.shift();

                for (j = 0; j < game.collection[i].path.length - 5; j++) {
                    ctx.beginPath();
                    ctx.moveTo(game.collection[i].path[j].x, game.collection[i].path[j].y)
                    ctx.lineTo(game.collection[i].path[j + 1].x, game.collection[i].path[j + 1].y)
                    ctx.strokeStyle = game.collection[i].rgb + j / game.collection[i].path.length + ")";
                    ctx.stroke();
                }

                game.collection[i].pixel = ctx.getImageData(game.collection[i].poz.x - game.w, game.collection[i].poz.y - game.h, 1, 1).data;
                game.collection[i].game = !((game.collection[i].pixel[0] == 255 && game.collection[i].pixel[1] == 0 && game.collection[i].pixel[2] == 0 && game.collection[i].pixel[3] == 255) || (game.collection[i].pixel[0] == 255 && game.collection[i].pixel[1] == 255 && game.collection[i].pixel[2] == 255 && game.collection[i].pixel[3] == 255) || (game.collection[i].pixel[0] == 0 && game.collection[i].pixel[1] == 0 && game.collection[i].pixel[2] == 0 && game.collection[i].pixel[3] == 0));

                if (game.collection[i].game) {
                    ctx.translate(game.collection[i].poz.x - game.w, game.collection[i].poz.y - game.h)
                    ctx.rotate(game.collection[i].rad);

                    ctx.drawImage(game.collection[i].img, 0, 0, 600, 463, -game.w, -game.h, 60, 46);

                    ctx.rotate(-game.collection[i].rad);
                    ctx.translate(-game.collection[i].poz.x + game.w, -game.collection[i].poz.y + game.h)
                }
                else {
                    game.collection[i].skip = true;

                    var loosers = 0;
                    var end = false;
                    var winner;

                    for (j = 0; j < game.collection.length; j++) {
                        if (!game.collection[j].game) loosers++;
                        else winner = game.collection[j];
                    }

                    if (loosers == game.count - 1) end = true;

                    if (end) {
                        window.alert("Game over! Najlepiej pojechał gracz " + winner.number)
                        location.reload()
                    }
                }
            }
            data_update(i);
        }
        requestAnimationFrame(animation);
    }

    function deklaracja(e) {
        var warunek = true;
        for (i = 0; i < game.collection.length; i++) {
            if (e.code == game.collection[i].control) {
                warunek = false;
            }
        }

        if (warunek) {
            game.collection[deklarowanie % game.collection.length].control = e.code;
            data_update(deklarowanie % game.collection.length);
            table.deklaracjas[deklarowanie % game.collection.length].innerHTML = "NO"
            table.deklaracjas[(deklarowanie + 1) % game.collection.length].innerHTML = "YES"
            deklarowanie++;
        }
    }

    clear();
    document.getElementById("start").addEventListener("click", function () {
        document.removeEventListener("keypress", deklaracja)
        table.deklaracjas[deklarowanie % game.collection.length].innerHTML = "NO"
        animation();
    })

    var deklarowanie = 0;
    document.addEventListener("keypress", deklaracja)
});
