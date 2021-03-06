var util = require('util')
    , gutil = require('gulp-util');

function debug() {

    return {
        context: function() {
            gutil.log.apply({}, arguments);
        },
        quote: function(msg) {
            return '\'' + msg + '\'';
        },
        green: function () {
            return gutil.colors.green.apply({}, arguments);
        },
        blue: function () {
            return gutil.colors.blue.apply({}, arguments);
        },
        red: function () {
            return gutil.colors.red.apply({}, arguments);
        }
    }

}

module.exports = debug();