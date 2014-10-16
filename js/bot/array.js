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