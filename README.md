
# Welcome To Tiny Apps!

Tiny Apps(JS) is an app to explore what JavaScript can do right out of the box! Since this app is 'tiny', bloat from external libraries will be avoided as much as possible. There will be a variety of applications to explore, so please take a look around and let me show you the power of JavaScript!

Live: [Tiny Apps](https://camchandler98.github.io/tiny-js/)

# Development



* Setup:
    1. Clone the [repository](https://github.com/CamChandler98/tiny-js)

Thats it! Since simplicity is one of the goals of this project it's easy to jump in and get to work! If you create any tiny apps of your own please share them!

# Apps

  Tiny Apps is always expanding so please check back for new apps to enjoy!

## **Tiny Band**
***Become a One Man Band with Tiny Band!***
<p align = "center">
<img alt="Tiny Band" src="https://github.com/CamChandler98/tiny-assets/blob/main/TinyBandClip.mov.gif" width="400" height="400">
</p>

This app simulates instruments using ````HTML Audio```` elements to produce sound and ````HTML Canvas```` elements to provide the user interface.

### Play a variety of instruments with just a click!

* Click the elements under the instrument name to play notes!
* Click the "Record" button to record your playing! You can even switch instruments while recording!
* Click the record button again to stop recording and then click the "Play" button to playback your recording.
* Make room for a new Jam Session by clicking the "Clear Button"!

## **Tiny Math**
***Make a calculated move with Tiny Math!***
<p align = "center">
<img alt="Tiny Band" src="https://github.com/CamChandler98/tiny-assets/blob/main/TinyMathClip.mov.gif" width="400" height="400">
</p>

This app is a calculator inspired by the ti30x

### Do math just like when you were a kid!

* Click the number keys to enter a number
* Click an operation button to ready an operation
* Enter another number
* Click enter and marvel!

## **Tiny Note**
***Your interest is noted in TinyNote!***
<p align = "center">
<img alt="Tiny Band" src="https://github.com/CamChandler98/tiny-assets/blob/main/TinyBandClip.mov.gif" width="400" height="400">
</p>

This app uses local storage to practice CRUD operations and data validations!

###!

* Sign up using the signup button, make sure you read any validation errors!
* Login after signing up!
* Leave helpful notes!
***

# Code Highlights
A selection of code snippets that really show what JS can do!

##  Tiny Band

### Vibrate a String

This function uses HTML Canvas elements to simulate a vibrating string.


<details open>

<summary>
    Expand to see code
</summary>

````javascript
// Function to create a vibrating effect on a string-like object drawn on a canvas
const vibrateString = (canvas, context, amplitude, decayRate, startCoordinate, end, cp1, cp2, color ) => {
    // Calculate the absolute value of amplitude to ensure it's positive
    let absoluteAmplitude = Math.abs(amplitude);

    // Set an interval to create the vibrating effect
    let vibeInterval = setInterval(() => {
        // Extract the last digit of the amplitude for vibration direction calculation
        let lastDigit = Number(String(absoluteAmplitude).slice(-1));
        // Parse the absolute amplitude to a float for precise calculations
        let relAmplitude = parseFloat(absoluteAmplitude);

        // Reverse the amplitude direction on every even last digit
        if (lastDigit % 2 === 0) {
            relAmplitude *= -1;
        }

        // Clear the canvas to redraw the string
        canvas.width = canvas.width; 
        // Move the drawing cursor to the start coordinate
        context.moveTo(startCoordinate.x, startCoordinate.y);

        // Draw a bezier curve representing the string with the vibrating effect
        context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y + relAmplitude, end.x, end.y);
        // Set the color of the string
        context.strokeStyle = color;
        // Execute the stroke command to render the string
        context.stroke();

        // Reduce the amplitude over time by the decay rate
        absoluteAmplitude -= decayRate;
        // Fix the amplitude to two decimal places for consistent visual effect
        absoluteAmplitude = absoluteAmplitude.toFixed(2);

        // Stop the interval and thus the vibration when the amplitude is depleted
        if (absoluteAmplitude <= 0) {
            clearInterval(vibeInterval);
        }

    }, 40); // Execute the interval every 40 milliseconds

    // Return the interval ID for potential external control
    return vibeInterval;
}
````
</details>


#### Key Points:

* Strings are rendered using ````HTML Canvas```` elements.
* The amplitude of the wave is defined using the parameter ````amplitude````.
* The wave oscillates through phases using the ````relAmplitude```` variable to determine wheter the phase should be a trough or a peak at any given time.
* The amplitude is applied to the string using a besieer curve.

### Record and Play Notes

Finally a reason to put all of the DSA grinding to use! This functionality uses a class for audio data as nodes and a class for recording as a ````linked list````!

<details open>

<summary>
    Expand to see code
</summary>

````javascript
class AudioNode {
    // Constructor initializes an AudioNode with several properties
    constructor(audioElement, timeToNext, name, vibrate, clickFX) {
        this.name = name; // Name of the audio node
        this.value = audioElement; // The actual audio element
        this.timeToNext = timeToNext || null; // Time until next audio node plays
        this.next = null; // Reference to the next node
        this.prev = null; // Reference to the previous node
        this.vibrate = vibrate(); // Function to handle vibration effect
        this.clickFX = clickFX(); // Function to handle click effect
    }

    // Asynchronous function to play the audio node
    async play() {
        this.value.volume = 1; // Set volume to maximum
        this.clickFX(); // Execute click effect
        let vibeInterval = this.vibrate(); // Execute vibration effect
        return await this.value.play(); // Play the audio and wait for it to finish
    }
}


````

````javascript
   class SaveRec {
    // Constructor initializes an empty linked list
    constructor() {
        this.head = null; // Start of the list
        this.tail = null; // End of the list
        this.length = 0; // Number of nodes in the list
        this.elements = []; // Array to store nodes
    }

    // Method to add a new node at the head of the linked list
    addToHead(val, ttn) {
        let newNode = new AudioNode(val, ttn); // Create a new audio node

        if (this.length > 0) {
            this.head.prev = newNode; // Link new node with the current head
            newNode.next = this.head; // Set new node's next to current head
            this.head = newNode; // Update head to the new node
        } else {
            this.head = newNode; // For an empty list, new node is both head and tail
            this.tail = newNode;
        }
        this.length++; // Increment the length of the list
    }

    // Method to add a new node at the tail of the linked list
    addToTail(val, ttn, name, vibrate, clickFX) {
        val.volume = 1; // Set the volume of the audio element
        
        let newNode = new AudioNode(val, ttn, name, vibrate, clickFX); // Create a new audio node

        if (this.length === 0) {
            this.head = newNode; // For an empty list, new node is both head and tail
            this.tail = newNode;
        } else {
            let oldTail = this.tail; // Store the current tail
            oldTail.next = newNode; // Link current tail to new node
            newNode.prev = oldTail; // Set new node's previous to current tail
            this.tail = newNode; // Update tail to the new node
        }
        this.elements.push(newNode); // Add new node to the elements array
        this.length++; // Increment the length of the list
    }

    // Asynchronous method to play all nodes in the linked list in sequence
    async play() {
        if (this.length === 0) return; // Do nothing if the list is empty

        let currentNote = this.head; // Start from the head of the list

        while (currentNote) {
            currentNote.value.volume = 1; // Set volume of current node
            currentNote.play(); // Play the current node
            await wait(currentNote.timeToNext); // Wait for the specified time before playing next node
            if (!currentNote.next) {
                currentNote.value.volume = 1; // Set volume of last node
            }
            currentNote = currentNote.next; // Move to the next node
        }

        await wait(3000); // Wait for 3 seconds after playing all nodes
        return true; // Indicate completion
    }
}
````
</details>


<u> Key Points: </u>

* Notes are added to the tail of the linked list when recording is toggled
* To play a recording the linked list class ````SaveRec```` is traversed and the ````play```` method of each note is called.

