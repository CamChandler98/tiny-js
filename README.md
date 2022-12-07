
# Welcome To Tiny Apps!

Tiny Apps(JS) is an app to explore what JavaScript can do right out of the box! Since this app is 'tiny', bloat from external libraries will be avoided as much as possible. There will be a variety of applications to explore, so please take a look around and let me show you the power of JavaScript!

***

### Development



* Setup:
    1. Clone the [repository](https://github.com/CamChandler98/tiny-js)

Thats it! Since simplicity is one of the goals of this project it's easy to jump in and get to work! If you create any tiny apps of your own please share them!
***
### Apps

Tiny Apps is always expanding so please check back for new apps to enjoy!

### Tiny Band
Become a One Man Band with Tiny Band! 

This app simulates instruments using ````HTML Audio```` elements to produce sound and ````HTML Canvas```` elements to provide the user interface.

SC HERE!!!!!!!!!!!

### Play a variety of instruments with just a click!

* Click the elements under the instrument name to play notes!
* Click the "Recrod" button to record your playing! You can even switch instruments while recording!
* Click the record button again to stop recording and then click the "Play" button to playback your recording.
* Make room for a new Jam Session by clicking the "Clear Button"!

***

## Code Highlights
A selection of code snippets that really show what JS can do!

### Tiny Band

#### Vibrate a String

This function uses HTML Canvas elements to simulate a vibrating string.

<details>
<summary>Click to see <code>vibrateString</code> function </summary>

````javascript
const vibrateString = (canvas, context, amplitude, decayRate, startCoordinate, end, cp1, cp2, color )=> {
    let absoluteAmplitude = Math.abs(amplitude)

    let vibeInterval = setInterval(()=>{
        let lastDigit = Number(String(absoluteAmplitude).slice(-1))
        let relAmplitude = parseFloat(absoluteAmplitude)

        if(lastDigit%2 === 0){
            relAmplitude*=-1
        }

        canvas.width = canvas.width
        context.moveTo(startCoordinate.x, startCoordinate.y)

        context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y + relAmplitude, end.x, end.y)
        context.strokeStyle = color
        context.stroke()

        absoluteAmplitude -= decayRate
        absoluteAmplitude = absoluteAmplitude.toFixed(2)

        if(absoluteAmplitude <=0){
            clearInterval(vibeInterval)
        }

    },40)
    return vibeInterval
}
````

</details>


Key Points:

* Strings are rendered using ````HTML Canvas```` elements.
* The amplitude of the wave is defined using the parameter ````amplitude````.
* The wave oscillates through phases using the ````relAmplitude```` variable to determine wheter the phase should be a trough or a peak at any given time.
* The amplitude is applied to the string using a besieer curve.

### Record and Play Notes

Finally a reason to put all of the DSA grinding to use! This functionality uses a class for audio data as nodes and a class for recording as a ````linked list````!

<details>
<summary>Click to see <code>play</code> method</summary>

````javascript
    async play(){
        if(this.length === 0) return

        let currentNote = this.head

        while(currentNote){

            currentNote.play()

            await wait(currentNote.timeToNext)

            currentNote = currentNote.next
        }

    }
````
</details>

<details>
<summary>Click to see <code>record</code> method </summary>

````javascript
    recordNote(val, ttn, name, vibrate, clickFX) {

        let newNode = new AudioNode(val,ttn, name, vibrate, clickFX)

        if (this.length === 0){
            this.head = newNode;
            this.tail = newNode;
            this.length++
            return
        }

        let oldTail = this.tail;
        oldTail.next = newNode;
        newNode.prev = oldTail;

        this.tail = newNode;
        this.elements.push(name)
        this.length++
    }

````
</details>
&nbsp

<u> Key Points: </u>

* Notes are added to the tail of the linked list when recording
* To play a recording the linked list class ````SaveRec```` is traversed and the ````play```` method of each note is called.
