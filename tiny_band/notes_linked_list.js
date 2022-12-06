const wait = (ms) =>{
    if(!ms) return
    return new Promise(resolve => setTimeout(resolve, ms || 100))
}

class AudioNode {
    constructor(audioElement , timeToNext,name, vibrate, clickFX){
        this.name = name
        this.value = audioElement
        this.timeToNext = timeToNext || null
        this.next = null
        this.prev = null
        this.vibrate = vibrate()
        this.clickFX = clickFX()
    }

    async play(){
        //console.log('playing', this.name)
        this.value.volume = 1
        // //console.log('clickFx',this.clickFX )
        this.clickFX()
        this.vibrate()
        return await this.value.play()
    }
}

class SaveRec {
    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.elements = []
    }


    addToHead(val , ttn) {

        let newNode = new AudioNode(val, ttn)

        if (this.length > 0) {
            this.head.prev = newNode;
            newNode.next = this.head;
            this.head = newNode;
        }
        else {
            this.head = newNode;
            this.tail = newNode;
        }

        this.length++;
    }

    addToTail(val, ttn, name, vibrate, clickFX) {
        // Add node of val to tail of linked list
        // val.volume = 1
        // //console.log('ll vol', val.volume, name)
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

    async play(){
        if(this.length === 0) return

        let currentNote = this.head
        //console.log('starting playback', this.elements)
        while(currentNote){
            // //console.log(currentNote.name, typeof currentNote.next.name)

            currentNote.play()
            let interval = setInterval(()=>{
                if(currentNote){
                 currentNote.volume /= 1.1
                    // //console.log(currentNote.volume)
                    if(currentNote.volume <= .001){
                        // //console.log('cleaning up')
                    clearInterval(vibeInterval)
                    clearInterval(interval)
                    currentNote.pause()
                    return
                }}
            },200)

            //console.log('wating', currentNote.timeToNext)
            await wait(currentNote.timeToNext)
            //console.log('getting next')
            currentNote = currentNote.next
        }
        //console.log('playback finished')
    }
}
