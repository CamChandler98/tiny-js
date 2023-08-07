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
        let vibeInterval = this.vibrate()
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
        val.volume = 1
        // //console.log('ll vol', val.volume, name)
        let newNode = new AudioNode(val,ttn, name, vibrate, clickFX)

        if (this.length === 0){
            this.head = newNode;
            this.tail = newNode;
            this.elements.push(newNode)
            this.length++
            return
        }
        let oldTail = this.tail;
        oldTail.next = newNode;
        newNode.prev = oldTail;
        this.tail = newNode;
        this.elements.push(newNode)
        this.length++
    }

    async play(){
        if(this.length === 0) return

        let currentNote = this.head
        currentNote.value.volume = 1
        console.log('starting playback', this.elements.map(el => el.value.volume))
        let last
        while(currentNote){
            // //console.log(currentNote.name, typeof currentNote.next.name)
            currentNote.value.volume = 1
            currentNote.play()
            //console.log('wating', currentNote.timeToNext)
            await wait(currentNote.timeToNext)
            //console.log('getting next')
            currentNote.value.volume = 1
            if(!currentNote.next){
                currentNote.volume = 1
            }
            currentNote = currentNote.next
        }

        await wait(3000)
        return true
    }
}
