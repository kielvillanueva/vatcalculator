var generator = require('generate-password');
const express = require('express')
const app = express()
var pug = require('pug');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

// npm run devstart

app.get('/', function (req, res) {
    res.render('index', { title: 'Password Generator', low: true, upp: true, num: true});
});

function makePassword(pool, length) {
    var newpass = "";
  
    for (var i = 0; i < length; i++)
      newpass += pool.charAt(Math.floor(Math.random() * pool.length));
  
    return newpass;
}

var replace = {'a':'ant', 'A':'ANT', 'b':'bat', 'B':'BAT', 'c':'cat', 'C':'CAT', 'd':'dog', 'D':'DOG', 'e':'egg', 'E':'EGG', 'f':'fox', 'F':'FOX', 'g':'girl', 'G':'GIRL', 'h':'hat', 'H':'HAT', 'i':'ink', 'I':'INK', 'j':'jump', 'J':'JUMP', 'k':'kite', 'K':'KITE', 'l':'lot', 'L':'LOT', 'm':'mom', 'M':'MOM', 'n':'nice', 'N':'NICE', 'o':'one', 'O':'ONE', 'p':'pet', 'P':'PET', 'q':'quiz', 'Q':'QUIZ', 'r':'red', 'R':'RED', 's':'sun', 'S':'SUN', 't':'time', 'T':'TIME', 'u':'up', 'U':'UP', 'v':'van', 'V':'VAN', 'w':'win', 'W':'WIN', 'x':'xray', 'X':'XRAY', 'y':'yoyo', 'Y':'YOYO', 'z':'zinc', 'Z':'ZINC'}

app.post('/',function(req, res, next){

    // var low = '';
    var remember = '';
    var pool = '';

    if (req.body.lowerCase) {
        pool += 'abcdefghijklmnopqrstuvwxyz';
    } if (req.body.numbers) {
        pool += '0123456789';
    } if (req.body.symbols) {
        pool += '!@#$%^&*()+_-=}{[]|\':;"/?.><,`~';
    } if (req.body.upperCase) {
        pool += 'ABCDEFHIJKLMNOPQRSTUVWXYZ';
    } if (req.body.similar) {
        pool = pool.replace(/[|ilLI`oO0]/g, '');
    } if (req.body.ambiguous) {
        pool = pool.replace(/[{}\[\]\/\\()'"`~,;:.<>]/g, '');
    }

    // ilLI|`oO0
    // var password = generator.generate({
    //     length: req.body.length,
    //     numbers: req.body.numbers,
    //     symbols: req.body.symbols,
    //     uppercase: req.body.upperCase,
    //     excludeSimilarCharacters: req.body.similar,
    //     exclude: amb + low
    // });

    var password = makePassword(pool, req.body.length);

    console.log(password);

    remember = password;

    remember = remember.split('').join(' ');
    remember = remember.replace(/[aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ]/g, m => replace[m]);

    res.render('index', { title: 'Password Generator', pass: password, rem: remember, len: req.body.length, num: req.body.numbers, sym: req.body.symbols, low: req.body.lowerCase, upp: req.body.upperCase, sim: req.body.similar, amb: req.body.ambiguous});
});

app.listen(3000, () => console.log('listening on port 3000'))