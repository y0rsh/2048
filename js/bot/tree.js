/**
 * Created by y0rsh on 16.10.14.
 */
var Tree = {
    levels: [],
    level: function (num) {
        if (!this.levels[num]) {
            this.levels[num] = [];
        }
        return this.levels[num];
    },
    last: function () {
        return this.levels.length > 0 ? this.levels[this.levels.length - 1] : null;
    }
};