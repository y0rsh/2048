function Bot() {}
Bot.prototype.buildTree = function (cells, depth) {
    cells.branchMove();
    for (var i = 0; i < depth; i++) {
        Tree.last().forEach(function(cell) {
            if(!cell.dead) cell.branchRandomTile(); else delete cell;
        });
        Tree.last().forEach(function(cell) {
            cell.branchMove();
        });
    }
    Tree.last().forEach(function(cell) {
        if(cell.dead) delete cell;
    });

    while (Tree.levels.length > 2) {
        Tree.levels.pop();
        Tree.last().forEach(function (cell) {
            cell.reScore();
        });
    }
};
Bot.prototype.decide = function () {
    var cells = new Cells(this.getGameState());
    var empty = 0;
    cells.data.forEach(function (row) {
        row.forEach(function (tile) {
            if (tile === null) empty++;
        });
    });
    var depth = 1;
    if (empty <= 6) {
        depth = 2;
    }
    if (empty <= 4) {
        depth = 3;
    }
    this.buildTree(cells, depth);

    var move = cells.children.sort(function (a, b) {
        return (a.score >= b.score || b.dead) ? 1 : -1;

    }).pop().log.shift();
    var moves = {up : 0, right : 1, down : 2,  left: 3};
    //console.log(moves[move]);
    Game.inputManager.emit('move', moves[move]);

    Tree.levels = [];
    //console.log(Tree.levels);
    setTimeout(function(){bot.decide()}, 100);
};
Bot.prototype.getGameState = function () {
    var gameState = JSON.parse(localStorage.gameState);
    return  gameState.grid.cells.map(function (row) {
        return row.map(function (tile) {
            return tile !== null ? {value: tile.value} : null;
        })
    });
};
var bot = new Bot();
setTimeout(function(){bot.decide();}, 100);