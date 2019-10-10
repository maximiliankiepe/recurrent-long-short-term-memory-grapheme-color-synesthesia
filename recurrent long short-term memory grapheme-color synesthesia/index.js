// node.js requirements with express and socket.io
var express = require("express")
var bodyParser = require("body-parser")
const brain = require('brain.js/dist/brain-browser.js');

var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// THE THREE TRAININGMODELS //

// normal
// const net = new brain.NeuralNetwork();

// fastest and kind of reliable, like long short-term memory (LSTM) with forget gate
// const net = new brain.recurrent.GRUTimeStep();

// best
const net = new brain.recurrent.LSTMTimeStep();

const trainingData = [
  {input: { num: 0, number: 0 }, output: { r: 250/255, g: 250/255, b: 250/255  }},
  {input: { num: 0, number: 1 }, output: { r: 255/255, g: 255/255, b: 178/255 }},
  {input: { num: 0, number: 2 }, output: { r: 0/255, g: 174/255, b: 255/255  }},
  {input: { num: 0, number: 3 }, output: { r: 255/255, g: 57/255, b: 0/255  }},
  {input: { num: 0, number: 4 }, output: { r: 0/255, g: 173/255, b: 0/255  }},
  {input: { num: 0, number: 5 }, output: { r: 180/255, g: 180/255, b: 180/255  }},
  {input: { num: 0, number: 6 }, output: { r: 0/255, g: 72/255, b: 255/255  }},
  {input: { num: 0, number: 7 }, output: { r: 0/255, g: 230/255, b: 0/255  }},
  {input: { num: 0, number: 8 }, output: { r: 0/255, g: 0/255, b: 180/255  }},
  {input: { num: 0, number: 9 }, output: { r: 0/255, g: 0/255, b: 93/255  }},
];

// node.js communicate with index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

net.train(trainingData, {
  log: true,
});

console.log('DONE');

// send data to index.html
io.sockets.on('connection', function (socket) {
    for (i = 0; i <= 9; i=i+1) {
      for (a = 0; a <= 9; a=a+1) {
        var output = net.run({ num: i , number: a });
        var temp = output;
        socket.emit('message', temp);
        console.log(i+','+a);
      }
    }
});

// set up the server
var server = http.listen(3000, () => {
    console.log("Well done, now I am listening on ", server.address().port)
})
