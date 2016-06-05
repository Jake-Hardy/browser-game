$('.buttonSubmit').on("click", function() {
    var input = getCommand();
    writeToConsole(input);
});

$('.consoleInput').on("keydown", function(e) {
    if (e.which === 13) {
        resolveTurn();
    }
});

function resolveTurn() {
    if (player['turnsLeftInAction'] === 0) {
        player['currentAction'] = 'none';
    }

    if (player['currentAction'] === 'explore') {
        rollExploreEncounter();
        player['turnsLeftInAction'] -= 1;
    }

    var input = $('#consoleInput').val();
    $('#consoleInput').val('');
    console.log(input);

    if (input === 'ml' && player['x'] !== 0) {
        player['x'] -= 1;
    }
    else if (input === 'mr' && player['x'] !== cols - 1) {
        player['x'] += 1;
    }
    else if (input === 'mu' && player['y'] !== 0) {
        player['y'] -= 1;
    }
    else if (input === 'md' && player['y'] !== rows - 1) {
        player['y'] += 1;
    }
    else if (input === "e") {
        if (!playerBusy() && player['currentLocation'] === 'Wilderness') {
            player['currentAction'] = 'explore';
            player['turnsLeftInAction'] = 1;
        }
        resolveTurn();
    }
    else if (input === '') {
        resolveTurn();
    }
    else {
        writeToConsole('<br />Unrecognized Command');
    }


    generateMap(rows, cols, player, cities);

    var window = document.getElementById('consoleWindow');
    window.scrollTop = window.scrollHeight;
}

function writeToConsole(input) {
    $('.consoleWindow').append(input + "<br />");
    // text.value = '';
}

function generateMap(r, c, p, ct) {
    $('.map').empty();
    rows = r;
    cols = c;
    cities = ct;

    $('.info--hp').text("HP: " + p['hp']);
    $('.info--act').text("Current Action: " + player['currentAction']);

    for  (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            $('.map').append("<span class='tile_" + i + "_" + j + "'>x</span>");
            $('.tile_'+i+'_'+j).css("color", "white");
            if (j === cols - 1) {
                $('.map').append("<br />");
            }

            if (p['y'] === i && p['x'] === j) {
                p['currentLocation'] = 'Wilderness';
                $('.info--loc').text("Current Location: " + p['currentLocation']);

                $('.tile_'+i+'_'+j).text(p['symbol']);
                $('.tile_'+i+'_'+j).css("color", p['color']);
            }

            for (var k = 0; k < cities.length; k++) {
                if (i === cities[k]['y'] && j === cities[k]['x']) {
                    $('.tile_'+i+'_'+j).text(cities[k]['symbol']);
                    if (p['y'] === cities[k]['y'] && p['x'] === cities[k]['x']) {
                        p['currentLocation'] = cities[k]['name'];
                        $('.info--loc').text("Current Location: " + p['currentLocation']);
                        $('.tile_'+i+'_'+j).css("color", p['color']);
                    }
                }
            }
        }
    }

}

function getCommand() {
    $('.consoleInput').on("keydown", function(e) {
        if (e.which === 13) {
            var input = $('#consoleInput').val();
            $('#consoleInput').val('');
            return input;
        }
    });
}

function getxDist(currentCell, point2) {
    if (currentCell['x'] < point2['x']) {
        //currentCell['x'] += 1;
        xDist = point2['x'] - currentCell['x'];
    }
    else if (currentCell['x'] > point2['x']) {
        //currentCell['x'] -= 1;
        xDist = currentCell['x'] - point2['x'];
    }
    else {
        xDist = 0;
    }

    return xDist;
}

function getyDist(currentCell, point2) {
    if (currentCell['y'] < point2['y']) {
        //currentCell['y'] += 1;
        yDist = point2['y'] - currentCell['y'];
    }
    else if (currentCell['y'] > point2['y']) {
        //currentCell['y'] -= 1;
        yDist = currentCell['y'] - point2['y'];
    }
    else {
        yDist = 0;
    }

    return yDist;
}

function playerBusy() {
    return !(player['currentAction'] === 'none');
}

function rollExploreEncounter() {
    var window = document.getElementById("consoleWindow");
    writeToConsole("<br />You explore your surroundings...");
    var dieRoll = Math.floor(Math.random() * 100 + 1);
    if (dieRoll > 30) {
        dieRoll = Math.floor(Math.random() * 30 + 1);
        writeToConsole("<br />You encounter a group of " + dieRoll + " bandits.<br />");
        var enemyHp = dieRoll;
        while (player['hp'] > 0 && enemyHp > 0) {
            dieRoll = Math.floor(Math.random() * 100 + 1);
            if (dieRoll > 20) {
                let damageRoll = Math.floor(Math.random() * 5 + 1) + player['attack'];
                enemyHp -= damageRoll;
                writeToConsole("You deal " + damageRoll + " damage to bandits.");
                $('.info--enemy-hp').text('Enemy HP: ' + enemyHp);
            }
            else {
                writeToConsole("You missed!");
            }

            dieRoll = Math.floor(Math.random() * 100 + 1);
            if (dieRoll > 50) {
                let damageRoll = Math.floor(Math.random() * 5 + 1) + 7;
                player['hp'] -= damageRoll;
                writeToConsole("Bandits deal " + damageRoll + " damage to you.");
                $('.info--hp').text("Current HP: " + player['hp']);
            }
            else {
                writeToConsole("Bandits missed!");
            }
        }
        $('.info--enemy-hp').text('');
    }
}

function drawLine(point1, point2) {
    var x1 = point1['x'];
    var y1 = point1['y'];

    var x2 = point2['x'];
    var y2 = point2['y'];

    var tile1 = ".tile_"+y1+"_"+x1;
    var  tile2 = ".tile_"+y2+"_"+x2;

    $(tile1).css("background-color", "firebrick");
    $(tile2).css("background-color", "firebrick");

    var currentCell = point1;
    var turns = 0;

    while ( (currentCell['x'] !== point2['x']) || (currentCell['y'] !== point2['y']) ) {
        var t = ".tile_"+currentCell['y']+"_"+currentCell['x'];
        $(t).css("background-color", "firebrick");

        var xDist = getxDist(currentCell, point2);
        var yDist = getyDist(currentCell, point2);


        if (xDist > yDist) {
            if (currentCell['x'] > point2['x']) {
                currentCell['x'] -= 1;
            }
            else if (currentCell['x'] < point2['x']) {
                currentCell['x'] += 1;
            }
        }
        else if (yDist > xDist) {
            if (currentCell['y'] > point2['y']) {
                currentCell['y'] -= 1;
            }
            else if (currentCell['y'] < point2['y']) {
                currentCell['y'] += 1;
            }
        }
        else {
            if (currentCell['x'] > point2['x']) {
                currentCell['x'] -= 1;
            }
            else if (currentCell['x'] < point2['x']) {
                currentCell['x'] += 1;
            }

            if (currentCell['y'] > point2['y']) {
                currentCell['y'] -= 1;
            }
            else if (currentCell['y'] < point2['y']) {
                currentCell['y'] += 1;
            }
        }

        turns += 1;
    }
    console.log(turns);
}

$(document).ready(function() {
    player = {
        'y' : 3,
        'x' : 3,
        'symbol' : '@',
        'color' : 'green',
        'currentAction' : 'none',
        'turnsLeftInAction' : 0,
        'currentLocation' : '',
        'hp' : 100,
        'attack' : 10
    };

    cities = [
        {
            'y' : 3,
            'x' : 3,
            'symbol' : '^',
            'name' : 'Rivendale'
        },
        {
            'y' : 8,
            'x' : 15,
            'symbol' : '^',
            'name' : 'Dusken'
        }
    ];

    generateMap(10, 30, player, cities);

    var input = '';
    // while(input !== 'q') {
    //     generateMap(10, 30, player);
    //     $('consoleWindow').append('Quit? (y/n): ');
    //     input = getCommand();
    //     });
    // }

    // var point1 = {
    //     'y' : 9,
    //     'x' : 3
    // };
    //
    // var point2 = {
    //     'y' : 5,
    //     'x' : 26
    // };
    //
    // drawLine(point1, point2);
});
