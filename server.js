var express = require('express')
  , logger = require('morgan')
  , app = express()
  , gpio = require('onoff').Gpio


var PUMPS = null; //Declare pump variable, don't initialize becuase that starts the pumps


app.use(logger('dev')) //Better logger
app.use(express.static(__dirname + '/static')) //Static web page directory

app.get('/', function (req, res) { //Redirects to home page
    res.redirect('index.html')
})

app.post('/relay', function(req, res) { //Handles post requests: Connects client side button presses to the node.js realm
    color = req.query.color; //The color is sent as a url parameter
    if(PUMPS[color].readSync() == 0){ //If the pin is off
    PUMPS[color].writeSync(1) //Turn the pin on
    } else {
    PUMPS[color].writeSync(0); //Turn the pin off
    }
    res.send('Done') //NOTE: Pin state and pump state are inversely related
})

app.listen(3000, function () { //Starts the webserver
  console.log("Listening on http://localhost:3000")
  PUMPS = { "orange": new gpio("4", 'out'), "brown": new gpio("17", 'out'), "yellow": new gpio("27", 'out') } //Initialize the pump vars
  PUMPS["orange"].writeSync(1);
  PUMPS["brown"].writeSync(1); //TURN ALL OF THE PUMPS OFF
  PUMPS["yellow"].writeSync(1);
})
