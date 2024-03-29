let appList = Object.values(apps);

const display = document.getElementById('display');
const appTitle = document.getElementById('app-name');
const options = document.getElementById('options');

const cleanUp = () => {
    document.body.style.backgroundColor = '#FFFFFF';
    document.body.style.color = '#000000';
    display.innerHTML = '';
    options.innerHTML = '';
}

const render = async appName => {
    cleanUp();
    switch(appName) {
        case('math'):
            return generateMath();
        case('band'):
        return generateBand();
        case('note'):
        return generateNotes();
        // case('chat'):
        // return generateChat();
        // case('map'):
        // return generateMap();
        case('art'):
        return generateArt();
        case('ask'):
        return generateAsk();
        // case('feed'):
        // return generateFeed();
        case('shop'):
        return generateShop();
        default:
            return;
    }
}

const setDisplay = () => {
    let selectedApp = appList[0];
    appTitle.innerHTML = selectedApp.name;
    appTitle.style.color = selectedApp.color;
    render(selectedApp.name);
};

const rotateRight = () => {
    appList.push(appList.shift());
    setDisplay();
};

const rotateLeft = () => {
    appList.unshift(appList.pop());
    setDisplay();
};

document.getElementById('button-right').onclick = rotateRight;
document.getElementById('button-left').onclick = rotateLeft;

const keyDown = e => {
    switch(e.keyCode) {
        case(37):
            rotateLeft();
            break;
        case(39):
            rotateRight();
            break;
        default:
            break;
    };
};

document.addEventListener('keydown', keyDown);

document.addEventListener('error' , (e)=> {
    alert('Error', e)
})

document.addEventListener('DOMContentLoaded', () => {

    setDisplay();
    // generateBand()
    // generateNotes()
});
