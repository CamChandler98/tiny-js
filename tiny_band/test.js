// import SaveRec from "./notes_ll";

let a1 = new Audio('./sounds/electric_bass/A0.mp3')
let a2 = new Audio('./sounds/electric_bass/F1.mp3')
let a3 = new Audio('./sounds/electric_bass/F1.mp3')


let rec = new SaveRec()

rec.addToTail(a1, 100,'1')
rec.addToTail(a2,5000,'2')
rec.addToTail(a3,null,'3')

document.addEventListener('DOMContentLoaded', () => {
    console.log(rec.length)

    let test = document.querySelector('h1')
    test.addEventListener('click', () => {
        rec.play()
    })
    // rec.play()
})
