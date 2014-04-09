function Bot() {
    console.log(this.getGameState());
    return this;
}
Bot.prototype.evaluateVariants = function () {
    var cells = this.cells.concat(),
        variants = [];
    this.moveLeft();
    variants.push({score: this.evaluateVariants().score, direction: 3});
    this.cells = cells.concat();
    this.moveRight();
    variants.push({score: this.evaluateVariants().score, direction: 1});
    this.cells = cells.concat();
    this.moveUp();
    variants.push({score: this.evaluateVariants().score, direction: 0});
    this.cells = cells.concat();
    this.moveDown();
    variants.push({score: this.evaluateVariants().score, direction: 2});
    this.cells = cells.concat();
    variants.sort(function(a, b){
        if(a.score > b.score) return 1;
        if(a.score < b.score) return -1;
        if(a.score == b.score) return Math.round(Math.random())
    });
    return variants.pop();
};
Bot.prototype.decide = function () {
    var cells = new Cells(this.getGameState());
    cells.branchMove();

    Tree.level(1).forEach(function(cell) {
        if(!cell.dead) cell.branchRandomTile(); else delete cell;
    });
    Tree.level(2).forEach(function(cell) {
        cell.branchMove();
    });
//    Tree.level(3).forEach(function(cell) {
//        if(!cell.dead) cell.branchRandomTile(); else delete cell;
//    });
//    Tree.level(4).forEach(function(cell) {
//        cell.branchMove();
//    });
    Tree.level(3).forEach(function(cell) {
        if(cell.dead) delete cell;
    });
//    Tree.level(3).forEach(function(cell) {
//        cell.reScore();
//    });
    Tree.level(2).forEach(function(cell) {
        cell.reScore();
    });
    Tree.level(1).forEach(function(cell) {
        cell.reScore();
    });
    var move = cells.children.sort(function (a, b) {
        return (a.score >= b.score || b.dead) ? 1 : -1;

    }).pop().log.shift();
    var moves = {up : 0, right : 1, down : 2,  left: 3};
    console.log(moves[move]);
    Game.inputManager.emit('move', moves[move]);

    Tree.levels = [];
    console.log(Tree.levels);
    setTimeout(function(){bot.decide()}, 100)

//    var variants = [];
//    this.getGameState();
//    if (this.moveLeft()) {
//        variants.push({score: this.evaluate(), direction: 3});
//    } else {
//        variants.push({score: 0, direction: 3});
//    }
//
//    this.getGameState();
//    if (this.moveRight()) {
//        variants.push({score: this.evaluate(), direction: 1});
//    } else {
//        variants.push({score: 0, direction: 1});
//    }
//    this.getGameState();
//    if (this.moveUp()) {
//        variants.push({score: this.evaluate(), direction: 0});
//    } else {
//        variants.push({score: 0, direction: 0});
//    }
//
//    this.getGameState();
//    if (this.moveDown()) {
//        variants.push({score: this.evaluate(), direction: 2});
//    } else {
//        variants.push({score: 0, direction: 2});
//    }
//
//    variants.sort(function(a, b){
//        if(a.score > b.score) return 1;
//        if(a.score < b.score) return -1;
//        if(a.score == b.score) return Math.round(Math.random())
//    });
//    Game.inputManager.emit('move', variants.pop().direction)
}
Bot.prototype.getGameState = function () {
    var gameState = JSON.parse(localStorage.gameState);
    this.cells = gameState.grid.cells.map(function (row) {
        return row.map(function (tile) {
            return tile !== null ? {value: tile.value} : null;
        })
    })
    return this.cells;
};
Bot.prototype.evaluate = function () {
    return this.cells.reduce(function (score, row) {
        row.filter(function (item) {
            return item !== null;
        }).map(function (item) {
                score += item.value * item.value;
            });
        return score;
    }, 0)
};
Bot.prototype.moveUp = function () {
    var newCells = [];
    this.getGameState();
    this.cells.forEach(function (row) {
        var arr = row.filter(function (item) {
            return item !== null;
        });

        newCells.push(arr.reduce(function (res, item) {
            if (res.length == 0) {
                res.push(item);
            } else {
                if (res[res.length - 1].value !== item.value) {
                    res.push(item);
                } else {
                    res[res.length - 1].value *= 2;
                }
            }
            return res;
        }, []));
    });
    this.cells = newCells;
};
Bot.prototype.moveUp = function () {
    var newCells = [];
    var move = false;
    this.cells.forEach(function (row) {
        var arr = row.filter(function (item) {
            return item !== null;
        });

        newCells.push(arr.reduce(function (res, item) {
            if (res.length == 0) {
                res.push(item);
            } else {
                if (res[res.length - 1].value !== item.value) {
                    res.push(item);
                } else {
                    res[res.length - 1].value *= 2;
                    move = true;
                }
            }
            return res;
        }, []).padRight(4, null));
    });
    this.cells = newCells;
    return move;
};
Bot.prototype.moveDown = function () {
    var newCells = [];
    this.cells.forEach(function (row) {
        var arr = row.filter(function (item) {
            return item !== null;
        });

        newCells.push(arr.reduce(function (res, item) {
            if (res.length == 0) {
                res.push(item);
            } else {
                if (res[res.length - 1].value !== item.value) {
                    res.push(item);
                } else {
                    res[res.length - 1].value *= 2;
                }
            }
            return res;
        }, []).padLeft(4, null));
    });
    this.cells = newCells;
};
Bot.prototype.moveLeft = function() {
    this.cells.transponate();
    this.moveUp();
    this.cells.transponate();
};
Bot.prototype.moveRight = function() {
    this.cells.transponate();
    this.moveDown();
    this.cells.transponate();
};
Array.prototype.padRight = function (size, val) {
    if (this.length < size) {
        while (this.length < size) {
            this.push(val);
        }
    }
    return this;
};
Array.prototype.padLeft = function (size, val) {
    if (this.length < size) {
        while (this.length < size) {
            this.unshift(val);
        }
    }
    return this;
};
Array.prototype.transponate = function() {
    for (var length = this.length, x = 0; x < length; x++)
        for (var y = x + 1; y < length; y++) {
            var e = this[x][y];
            this[x][y] = this[y][x];
            this[y][x] = e
        }
    return this
};

var bot = new Bot();
setTimeout(function(){bot.decide();}, 100);