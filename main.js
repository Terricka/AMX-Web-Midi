var leftDeck = document.getElementById("left-deck");
var leftVol = 0;
var leftCounter = 0;

var rightDeck = document.getElementById("right-deck");
var rightVol = 0;
var rightCounter = 0;

var allAudio = document.getElementsByTagName('audio');
var allVol = 0;
console.log(allAudio);

var fader = 0;
var lastFader = 0;

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}
 
function success (midi) {
    var inputs = midi.inputs.values();
    // inputs is an Iterator
 
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }

    console.log(inputs);
}
 
function failure () {
    console.error('No access to your midi devices.')
}

function onMIDIMessage (message) {
    console.log(message.data);



    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
      return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    // fader control 
    if(message.data[1] === 1){
        fader = message.data[2];

        if(lastFader > fader){
            console.log("left volume up");
            leftDeck.volume = leftVol.map(127, 1, 0, 1.0);
        } else {
            console.log("right volume up");
            rightDeck.volume = rightVol.map(1, 127, 0, 1.0);
        }
        console.log(fader);
        lastFader = fader;
        console.log("last fader: " + lastFader);

    
    }

    // left play/pause control

    if(message.data[0] === 144 && message.data[1] === 10 && message.data[2] === 127){
        leftCounter++;
        if(leftCounter % 2 === 0){
            leftDeck.pause();
        } else {
            leftDeck.play();
        }      
    }

    // left volume control
    if(message.data[1] === 7){
        leftVol = message.data[2];
        leftDeck.volume = leftVol.map(1, 127, 0, 1.0);
    }

    // right play/pause control

    if(message.data[0] === 144 && message.data[1] === 11 && message.data[2] === 127){
        rightCounter++;
        console.log(rightCounter);
        if(rightCounter % 2 === 0){
            rightDeck.pause();
        } else {
            rightDeck.play();
        }      
    }

    // left volume control
    if(message.data[1] === 11){
        console.log(rightDeck);
        rightVol = message.data[2];
        rightDeck.volume = rightVol.map(1, 127, 0, 1.0);
    }

    //master volume
    if(message.data[1] === 50){
        console.log(rightDeck);
        allVol = message.data[2];
        allAudio[0].volume = allVol.map(1, 127, 0, 1.0);
        allAudio[1].volume = allVol.map(1, 127, 0, 1.0);
    }


}