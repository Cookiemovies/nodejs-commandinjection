// user readline to get user input

var readline = require('readline');

process.stdin.resume();

// read from stdin, write to stdout
var r = readline.createInterface(process.stdin, process.stdout);

// NEVER call this function it is DANGEROUS
// TODO: remove this dangerous function
function secret() {
    console.log('How\'d you get in this function?');
}

var colorHexes = {
    red: '#FF0000',
    yellow: '#FFFF00',
    blue: '#0000FF',
    black: '#000000',
    white: '#FFFFFF',
    green: '#008000',
    purple: '#800080',
    orange: '#FFA500',
    no: '#0'
};

r.question('Enter a color in lowercase to get its hex value (e.x. blue): ', function (statement) {
    if (statement == '') {
        statement = 'no';
      }
    console.log(eval('colorHexes.' + statement));
    process.stdin.pause();
});
