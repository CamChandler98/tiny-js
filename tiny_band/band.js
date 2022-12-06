

const generateBand = () => {

    ///define variables
    let Rec

    let isRecording = false

    let currentNote = null

    let globalVolume = 1

    let canPlay = false

    let activeInstrument

    let recentNotes = []

    const eStringNotes = ['Db2', 'C2 ', 'B1 ', 'Bb1', 'A1 ', 'Ab1', 'G1 ', 'Gb1', 'F1 ', 'E1 '].reverse()
    const aStringNotes = ['Gb2', 'F2 ', 'E2 ', 'Eb2', 'D2 ', 'Db2', 'C2 ', 'B1 ', 'Bb1', 'A1 '].reverse()

    const dStringNotes = ['B2 ', 'Bb2', 'A2 ', 'Ab2', 'G2 ', 'Gb2', 'F2 ', 'E2 ', 'Eb2', 'D2 '].reverse()
    const gStringNotes = ['E3 ', 'Eb3', 'D3 ', 'Db3', 'C3 ', 'B2 ', 'Bb2', 'A2 ', 'Ab2', 'G2'].reverse()

    const notes = [eStringNotes,aStringNotes,dStringNotes,gStringNotes]

    const kalimbaNotes = ['A6','F6','D6','C6','E6','G6','B6']
    const kalimbaHeights = ['69%','76%','83%','90%','83%','76%','69%']

    const blue = '#458588'
    const red = '#cc241d'
    const yellow = '#d79921'
    const purlpe= '#b16286'

    const darkBlue = '#076678'
    const darkRed = '#9d0006'
    const darkYellow = '#b57614'
    const darkPurple = '#8f3f71'


    const colors = [blue,red,yellow,purlpe]
    const darkColors = [darkBlue,darkRed,darkYellow,darkPurple]

    const kalimbaColors = [blue,purlpe,yellow,red,yellow,purlpe,blue]

    //generate elements
    const recButton = document.createElement('button')
    recButton.innerText = 'record'
    recButton.classList.add('op', 'band')

    const playButton = document.createElement('button')
    playButton.innerText = 'play'
    playButton.classList.add('disabled')

    const clearButton = document.createElement('button')
    clearButton.innerText = 'clear'
    clearButton.classList.add('disabled')

    const switchButton = document.createElement('button')
    switchButton.innerText = 'switch'


    const volumeSlider = document.createElement('input')

    volumeSlider.type = 'range'
    volumeSlider.min = 0
    volumeSlider.max = 1
    volumeSlider.value = 1
    volumeSlider.step = 0.1
    // volumeSlider.style.background = `${appList[0].color}`
    volumeSlider.style.order = 1
    volumeSlider.style.zIndex = 1

    const band = document.createElement('div')
    band.id = 'band'
    band.style = `--color: ${appList[0].color}`
    band.style.border = `5px solid ${appList[0].color}`


    const instrument_name = document.createElement('div')
    instrument_name.innerText = 'Bass Guitar'
    instrument_name.classList.add('instrument-name')
    instrument_name.id = 'electric_bass'

    band.append(instrument_name)


    //define fucntions

    //function to toggle recording
    const toggleRecord = async (e) => {
        let soundPath = `./tiny_band/sounds/stock/beep.wav`
        const audio = new Audio(soundPath)
        audio.volume = .1
        if(!isRecording){
            e.target.classList.add('active')
            audio.play()
            canPlay = false
            playButton.classList.add('disabled')
            clearButton.classList.add('disabled')
            isRecording = true;
            Rec = new SaveRec()
            currentNote = null
        }else {
            audio.play()
            if(currentNote){
                    currentNote.volume = globalVolume
                    //console.log('adding' ,currentNote.dataset.note)
                    Rec.addToTail(currentNote, null, currentNote.dataset.note, currentNote.vibe, currentNote.clickFX)
                    //console.log(Rec.elements)
                    if(currentNote.volume > .2){
                        console.log('waiting')
                        await wait(500)
                    }
                }
                e.target.classList.remove('active')
                isRecording = false
                if(Rec.length){
                playButton.classList.remove('disabled')
                clearButton.classList.remove('disabled')
                }
                canPlay = true

        }
    }

    //fucntion to calculate time elapsed
    const timeElapsed = (start) => {

        let end = new Date().getTime()
        let ttn = end - start

        return ttn
    }


    //function to play note
    const playNote = async (instrument, note, vibeInterval, vibeCallback, clickFX, decayRate) => {

        //define audio src url for audio element
        let soundPath = `./tiny_band/sounds/${instrument}/${note}.mp3`

        const audio = new Audio(soundPath)
        audio.dataset.startTime = new Date().getTime()
        audio.dataset.note = note
        audio.volume = globalVolume


        //check to see if a note has been played and recording has been toggled if so normalize volume and add note to recoded notes
        if(currentNote && isRecording){
            //console.log('takking a look at ', currentNote)
            let ttn = timeElapsed(currentNote.dataset.startTime)
            //console.log(ttn)

                currentNote.volume = globalVolume

                Rec.addToTail(currentNote, ttn, currentNote.dataset.note, currentNote.vibe,currentNote.clickFX )

                //console.log('number of notes added to linked list:', Rec.length)
            }


        //assign current note to newly inputted note and add effect callbacks for use in playback
        currentNote = audio
        currentNote.vibe = vibeCallback
        currentNote.clickFX = clickFX


        audio.play()

        //fade audio over time
        let interval = setInterval(()=>{
            if(audio){
             audio.volume /= decayRate
                // //console.log(audio.volume)
                if(audio.volume <= .1){
                    //console.log('cleaning up')
                clearInterval(vibeInterval)
                clearInterval(interval)
                audio.pause()
                return

            }}
        },300)

        //add current note to list of recently played notes, remove the least recent note if list is above a certain length
        recentNotes.unshift(currentNote)
        if(recentNotes.length >= 10){
            recentNotes.pop()
        }
    }

    //function to vibrate a line made using a canvas and bezier curve
    const vibrateString = (canvas, context, amplitude, decayRate, startCoordinate, end, cp1, cp2, color )=> {
        //console.log('vibrateString', color)

        let absoluteAmplitude = Math.abs(amplitude)

        let vibeInterval = setInterval(()=>{
            let lastDigit = Number(String(absoluteAmplitude).slice(-1))
            let relAmplitude = parseFloat(absoluteAmplitude)

            if(lastDigit%2 === 0){
                relAmplitude*=-1
            }
            //  context.canvas.height = 100;

            canvas.width = canvas.width
            context.moveTo(startCoordinate.x, startCoordinate.y)
        // context.lineWidth = 2

            context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y + relAmplitude, end.x, end.y)
            context.strokeStyle = color
            context.stroke()

            absoluteAmplitude -= decayRate
            absoluteAmplitude = absoluteAmplitude.toFixed(2)

            if(absoluteAmplitude <=0){
                //console.log('clearing vibe')
                clearInterval(vibeInterval)
            }

        },40)
        return vibeInterval
    }


    //funciton to vibrate kalimba key made from div
    const vibrateKey = (key, amplitude, decayRate) => {
        //console.log('starting vibration for', key)
        let absoluteAmplitude = Math.abs(amplitude)
        //console.log('vibrating key')
        let vibeInterval = setInterval(()=>{
            let lastDigit = Number(String(absoluteAmplitude).slice(-1))
            let relAmplitude = parseFloat(absoluteAmplitude)

            if(lastDigit%2 === 0){
                relAmplitude*=-1
            }

            key.style.transform = `translateX(${relAmplitude}px) skew(${relAmplitude *.5}deg)`
            absoluteAmplitude -= decayRate
            absoluteAmplitude = absoluteAmplitude.toFixed(2)

            if(absoluteAmplitude <=0){
                //console.log('clearing vibe')
                clearInterval(vibeInterval)
                // key.style.transform = null
                key.style.filter = null
            }

        },30)
    }

    //function to play recorded notes
    const playRecord = () => {
        if(!isRecording && canPlay && Rec){
            Rec.play()
        }
    }

    const clearRecord = () => {
        if(!isRecording && canPlay && Rec ){
            Rec = null
            playButton.classList.add('disabled')
            clearButton.classList.add('disabled')
        }
    }

    //fucntion to change volume
    const changeVolume = e => {

        globalVolume = e.target.value
        if(currentNote) currentNote.volume = e.target.value

        if(recentNotes.length > 0){

            recentNotes.forEach(el => {
                el.volume = globalVolume
            })

        }
    }

    function handleInputChange(e) {
        let target = e.target

        const min = target.min
        const max = target.max
        const val = target.value
        //console.log('min:',min, 'max:',max, 'val:',val)
        target.style.backgroundSize = (((val - min) * 100) / (max - min) )+ '% 100%'
      }

    recButton.addEventListener('click', toggleRecord)
    playButton.addEventListener('click', playRecord )
    clearButton.addEventListener('click', clearRecord)

    volumeSlider.addEventListener('input', changeVolume)
    volumeSlider.addEventListener('input', handleInputChange)


    //funciton to generate components of a kalimba
    const getKalimba = () => {

        instrument_name.innerText = 'Kalimba'
        const keyBoard = document.createElement('div')
        keyBoard.id = 'keyBoard'

        for(let i = 0; i < kalimbaNotes.length; i++){
            let key = document.createElement('div')
            key.classList.add('key')
            // //console.log(kalimbaNotes[i], kalimbaHeights[i])
            key.dataset.note = kalimbaNotes[i]
            key.style.maxHeight = kalimbaHeights[i]
            // key.style.width = '20px'
            key.style.backgroundColor = kalimbaColors[i]

            let amplitude = 1
            let decayRate = .05;

            key.addEventListener('click', (e) => {

                function vibeCallback(){

                    return function(){
                        vibrateKey(key,amplitude, decayRate)
                        //console.log('vibing')
                    }
                }

                function clickFX(){
                    return function(){
                        //console.log('an effect?')
                    }
                }

                vibrateKey(key, amplitude, decayRate)

                playNote('kalimba', kalimbaNotes[i], null, vibeCallback, clickFX, 1.1)
            })
            keyBoard.append(key)
        }
        activeInstrument = keyBoard
        band.append(keyBoard)
    }

    //funciton to generate components of a bass guitar
    const getBass = () =>{
        instrument_name.innerText = 'Electric Bass'
        const strings = document.createElement('div')
        for(let i = 0; i < 4; i++){

        strings.id = 'strings'

        let string = document.createElement('div')
        string.classList.add('string')

        let canvas = document.createElement('canvas')

        let context = canvas.getContext('2d')
        // context.canvas.height = 100;

        let start = { x: 0,    y: context.canvas.height/2  };
        let cp1 =   { x: 0,   y: context.canvas.height/2   };
        let cp2 =   { x: context.canvas.width/ 2,   y: context.canvas.height/2   };
        let end =   { x: context.canvas.width,   y: context.canvas.height/2  };

        context.moveTo(start.x, start.y)
        context.lineWidth = 2
        context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);

        context.strokeStyle = colors[i]

        context.stroke();


        string.append(canvas)
        strings.append(string)

        for (let j = 0; j < notes[i].length ; j++){

            let animD = 2

            let tab = document.createElement('div')
            let effect = document.createElement('div')

            effect.style = `--color: ${darkColors[i]}; --animD: ${animD}s`
            effect.style.zIndex = 4
            // tab.innerText = notes[i][j].trim()
            tab.dataset.note = notes[i][j]
            tab.style.backgroundColor = colors[i]
            tab.style.color = 'white'
            tab.classList.add('tab')
            tab.append(effect)

            effect.addEventListener('click', (e)=> {
                e.stopPropagation()
                //console.log(`clicking ${notes[i][j]}`)
                e.target.classList.add('effect')

                let eTimeout = setTimeout(()=>{
                    e.target.classList.remove('effect')
                    clearTimeout(eTimeout)
                }, (animD -.1) * 1000 )
            })

            tab.addEventListener('mousedown', (e) => {

                function vibeCallback(){

                    return function(){vibrateString(canvas,context,5,0.07,start,end, cp1,cp2,colors[i])}
                }

                function clickFX(){
                    return function(){
                        // //console.log(`clicking ${notes[i][j]}`)
                        effect.click()
                    }
                }
                let vibeInterval = vibrateString(canvas,context,5,0.07,start,end, cp1,cp2,colors[i])
                effect.click()
                // //console.log('vibe callback in eventListener', vibeCallback)
                // //console.log('vibeCallback return in eventlistener', vibeCallback()())
                // //console.log('click callback in eventListenr' ,clickFX)
                // //console.log('click Callback return in eventlistener', clickFX())

                playNote('electric_bass', notes[i][j].trim(),vibeInterval,vibeCallback,clickFX, 1.1 )
                //console.log('playing????', notes[i][j].trim())

            })

            string.append(tab)
        }
        activeInstrument = strings
        band.append(strings)
    }}


    const instrumentGetters = [getBass, getKalimba]


    const switchInstruments = () =>{
        //console.log('here')
        instrumentGetters.unshift(instrumentGetters.pop())
        activeInstrument.remove()
        instrumentGetters[0]()
    }

    switchButton.addEventListener('click', switchInstruments)
    // getKalimba()
    getBass()
    band.append(volumeSlider)
    display.append(band)
    options.append(recButton)
    options.append(playButton)
    options.append(clearButton)
    options.append(switchButton)
}
