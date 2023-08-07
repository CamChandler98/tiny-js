// numbers, operations, defaultState
const nums = [1,2,3,4,5,6,7,8,9,'.',0, 'c', 'ENTER'];
const ops = ['add', 'sub', 'mult', 'div'];

const defaultState = {
    currentInput: '',
    total: 0,
    currentOp: null,
}

const generateMath = () => {
    // declare state
    let state = {...defaultState};

    // draw calculator
    const math = document.createElement('div');
    math.id = 'math';
    math.style.border = `5px solid ${appList[0].color}`

    // draw "lcd" display
    const lcd = document.createElement('span');
    lcd.id = 'lcd';
    lcd.innerHTML = state.total;

    math.append(lcd);

    // draw keypad display
    const numbers = document.createElement('div');
    numbers.id = 'numbers';

    // handle number inputs
    const handleNumInput = numInput => {
        if (numInput === '.' && state.currentInput.includes('.')) return;


        if (numInput === 'c') {
            state = {...defaultState, currentOp: null};
            console.log(state)
           return lcd.innerHTML = 0;
        }

        if(numInput === 'ENTER') {
            calculate()
            return
        }

        state.currentInput += numInput;
        console.log(state);
        lcd.innerHTML = state.currentInput;
    };

    // handle calculations
    const calculate = () => {
        let currentValue = parseFloat(state.currentInput);
        
        switch(state.currentOp) {
            case('add'):
                state.total += currentValue || 0;
                break;
            case('sub'):
                state.total -= currentValue || 0;
                break;
            case('mult'):
                if(currentValue === 0){
                    state.total *= currentValue
                }else{
                    state.total *= currentValue || 1;
                }
                break;
            case('div'):
            if(currentValue === 0){
                state.total *= currentValue
            }else{
                state.total *= currentValue || 1;
            }
                break;
        }

        state.currentInput = '';
        if(state.total.toString().length >= 15){
            lcd.style.overflowX = 'scroll'
        }else{
            lcd.style.overflowX = 'hidden'
        }
        lcd.innerHTML = state.total.toString().includes('.') ? state.total.toFixed(3) : state.total
    }

    // handle operation input
    const handeOpInput = opInput => {
        if (state.currentOp) {
            calculate()
            state.currentOp = opInput;
        } else {
            state.total = parseFloat(state.currentInput) || 0;
            state.currentInput = '';
            state.currentOp = opInput;
        }
        console.log(state)
    }

    const setActive = (e) => {
        let ops = document.querySelectorAll('.op')

        ops.forEach(op => op.classList.remove('active'))

        e.target.classList.add('active')
    }

    // draw numbers buttons
    nums.forEach(num => {
        let button = document.createElement('button');
        button.innerHTML = num;
        if (num === 'c') button.style.color = appList[0].color;
        button.onclick = () => handleNumInput(num);
        numbers.append(button);
    })

    // draw ops button
    ops.forEach(op => {
        let button = document.createElement('button');
        button.classList.add('op')
        button.innerHTML = op;
        button.onclick = (e) => {
            handeOpInput(op)
            setActive(e)
        };
        options.append(button);
    })

    math.append(numbers);

    display.append(math);


}
