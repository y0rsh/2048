/**
 * Created with JetBrains PhpStorm.
 * User: y0rsh
 * Date: 07.04.14
 * Time: 1:43
 * To change this template use File | Settings | File Templates.
 */
var Tree = {
    levels: [],
    level: function (num) {
        if (!this.levels[num]) {
            this.levels[num] = [];
        }
        return this.levels[num];
    }
};
function Cells(cells, options) {
    options = options || {};
    this.dead = false;
    this.data = cells;
    this.branchType = null;
    this.lastMove = false;
    this.score = 0;
    this.level = options.level || 0;
    Tree.level(this.level).push(this);
    this.parent = options.parent || null;
    this.children = [];
    this.log = options.log || [];

    this.evaluate();
}
Cells.prototype.newChild = function () {
    var newLevel = this.level + 1,
        child = new Cells(this.cloneData(), {
        parent: this,
        level: newLevel,
        log: this.log.concat()
    });
    this.children.push(child);

    return child;
};
Cells.prototype.addTile = function (x, y, val) {
    this.data[x][y] = val;
    this.log.push('tile[' + x +'][' + y + ']');
}
Cells.prototype.cloneData = function() {
    return this.data.map(function(row){
        return row.map(function(tile) {
            return tile === null ? null : {value: tile.value};
        })
    })
};
Cells.prototype.reScore = function() {
    if (this.branchType === 'move') {
        this.score = this.children.map(function (child) {
            return !child.dead ? child.score : 0;
        }).sort().pop();
    } else if (this.branchType === 'random') {
        var length = this.children.length;
        this.score = this.children.reduce(function(sum, child){
            return sum + child.score/length;
        } ,0);
    }
};
Cells.prototype.branchMove = function() {
    this.branchType = 'move';


    this.newChild().up();
    this.newChild().down();
    this.newChild().left();
    this.newChild().right();
};
Cells.prototype.branchRandomTile = function () {
    var _this = this;
    this.branchType = 'random';
    this.data.map(function(row, x) {
        row.map(function(tile, y) {
            if (tile === null) {
                _this.newChild().addTile(x, y, {value: 2});
            }
        });
    })
};
Cells.prototype.evaluate = function () {
    this.score = this.data.reduce(function (score, row) {
        row
            .filter(function (item) {
                return item !== null;
            })
            .map(function (item) {
                score += item.value * item.value;
            });
        return score;
    }, 0);
};
Cells.prototype.up = function () {
    var newCells = [];
    var move = false;
    this.data.forEach(function (row) {
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
    this.data = newCells;
    this.lastMove = move;
    this.evaluate();
    this.log.push('up');
    if (this.parent !== null && JSON.stringify(this.data) === JSON.stringify(this.parent.data)) {
        this.dead = true;
    }
    return move;
};
Cells.prototype.down = function () {
    var newCells = [];
    var move = false;
    this.data.forEach(function (row) {
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
        }, []).padLeft(4, null));
    });

    this.data = newCells;
    this.lastMove = move;
    this.evaluate();
    this.log.push('down');
    console.log(JSON.stringify(this.data) === JSON.stringify(this.parent.data));
    if (this.parent !== null && JSON.stringify(this.data) === JSON.stringify(this.parent.data)) {
        this.dead = true;
    }
    return move;
};
Cells.prototype.left = function() {
    this.data.transponate();
    this.up();
    this.data.transponate();
    this.log.pop();
    this.log.push('left');
    if (this.parent !== null && JSON.stringify(this.data) === JSON.stringify(this.parent.data)) {
        this.dead = true;
    }

};
Cells.prototype.right = function() {
    this.data.transponate();
    this.down();
    this.data.transponate();
    this.log.pop();
    this.log.push('right');
    if (this.parent !== null && JSON.stringify(this.data) === JSON.stringify(this.parent.data)) {
        this.dead = true;
    }

};
Cells.prototype.transponate = function () {
    for (var length = this.data.length, x = 0; x < length; x++)
        for (var y = x + 1; y < length; y++) {
            var e = this.data[x][y];
            this.data[x][y] = this.data[y][x];
            this.data[y][x] = e
        }
    return this
};