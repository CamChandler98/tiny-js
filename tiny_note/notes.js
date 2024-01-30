let notes = JSON.parse(localStorage.getItem('notes')) || [];
// console.log('notes',notes)
let errorObj = {
    username: [],
    email: [],
    displayName: [],
    password: [],
    confirmPassword: []
}
let loginErrorObj = {
    credential: [],
    password: []
}
let activeElement

let currentUser

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/


let localEmials = localStorage.getItem('emails')
let localUserNames = localStorage.getItem('usernames')

let emails = localEmials ? JSON.parse(localEmials) : {}
let usernames = localUserNames ? JSON.parse(localUserNames): {}

let localUsers = localStorage.getItem('users')
let users = localUsers ? JSON.parse(localUsers):[]

let defaultSignupState = {
    username: '',
    email: '',
    displayName:'',
    password:'',
    confirmPassword: ''
}

let defaultLoginState = {
    credential: '',
    validation: '',
}

let signUpState = {...defaultSignupState}
let loginState = {...defaultLoginState}

const generateNotes = () => {

    const localStorage = window.localStorage;

    const notebook = document.createElement('div');
    notebook.id = 'notebook';
    notebook.style.border = `4px solid ${appList[0].color}`

    const options = document.getElementById('options')


    const formatNote = note => {

        let formattedNote = document.createElement('div');
        formattedNote.id = note.id;
        formattedNote.className = 'note';

        let noteText = document.createElement('div')
        noteText.innerHTML = note.text;

        let removeNoteBtn = document.createElement('div')
        removeNoteBtn.innerText = 'X'
        removeNoteBtn.class = 'removeNoteBtn'
        removeNoteBtn.style.color = `${appList[0].color}`
        removeNoteBtn.style.marginLeft = 'auto'

        removeNoteBtn.addEventListener('click',() =>{
            removeNote(formattedNote)
        })

        formattedNote.append(noteText)
       if(note.user === currentUser.username) formattedNote.append(removeNoteBtn)

       return formattedNote;
    }


    const addNote = text => {
        let noteContainer = document.querySelector('.noteContainer')
        const note = {
            text: text,
            id: Date.now(),
            user: currentUser.username
        };

        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        let formattedNote = formatNote(note);
        noteContainer.append(formattedNote);
    }

    const removeNote = note => {

        note.remove()
        notes = notes.filter(el => el.id !== +note.id)
        localStorage.setItem('notes', JSON.stringify(notes));

    }



    const validateEmail = (email)  => {
        let errors = []

        if(emails[email]){
            errors.push('Email already in use')
        }
        if(!email.match(emailRegex)){
            errors.push('Please enter a valid email')
        }
        return errors

    }

    const validateUsername = (username, ) => {
        let errors = []
        if(username.length < 4 ){
            errors.push('username must be at least 4 characters')
        }
        if(username.length > 30 ){
            errors.push('username must be at less than 30 characters')
        }
        if(usernames[username] ) {
            errors.push('Username already in use')
        }

        console.log('error',errors)

        return errors
    }

    const validateDisplayName = (displayName) =>{
        let errors = []

        if(displayName.length > 50){
            errors.push('dispaly name must be at less than 50 characters')
        }

        return errors
    }

    const validateConfirmPassword = (confirmPassword) => {
        let errors = []
        if(signUpState.password !== confirmPassword){
            errors.push('Please ensure passwords match')
        }
        return errors
    }

    const validatePassword = (password) => {
        let errors = []
        if(!password.match(passwordRegex)){
            errors.push('Password must be at least 5 characters and include at least 1 uppercase letter, 1 lowercase letter and 1 number ')
        }
        return errors
    }

    const validateCredential = () => {

        let credential = loginState.credential
        let errors = []
        let user = users.find(user => {
            return user.username === credential || user.email === credential
        })


        if(!user){

            loginErrorObj.credential = 'No such username or email'
            errors.push('No such username or email')
        }else{
            loginErrorObj.credential = null
        }

        return errors.length > 0 ? false : user
    }


    const genUser = (email, username, password) => {
        let hashedPassword = CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64)

        let user = {
            email,
            username,
            hashedPassword
        }

        return user
    }

    const genError = (text) => {
        let error = document.createElement('span')
        error.classList.add('errorText')
        error.innerText = text

        return error
    }
    const genAuthOptions = () => {
        options.innerHTML = ''

        let signUpBtn = document.createElement('button')
        signUpBtn.innerText = 'Sign Up'
        signUpBtn.addEventListener('click', renderSignup)

        let loginBtn = document.createElement('button')
        loginBtn.innerText = 'Login'
        loginBtn.addEventListener('click', renderLogin)

        options.appendChild(signUpBtn)
        options.appendChild(loginBtn)
    }

    const genInput = (type, id, name, validator) => {
        let inputContainer = document.createElement('div')
        inputContainer.classList.add('form-group')

        let errorContainer = document.createElement('div')
        errorContainer.classList.add('error-contaier')


        let label = document.createElement('label')
        label.htmlFor = id
        label.innerText = name

        let input = document.createElement('input')
        input.type = type
        input.id = id
        input.classList.add('form-control')
        input.placeholder = name

        input.addEventListener('input', (e)=> {
            let errors = []

            let value = e.target.value.trim()

            errors = validator(value)

            signUpState[id] = value

            if(errors.length){
                errorContainer.innerHTML = null
                errorObj[id] = errors
                errors.forEach(err => {
                    let error = genError(err)
                    errorContainer.append(error)
                })
            }else{
                errorObj[id] = null
                errorContainer.innerHTML = null
            }
        })

        inputContainer.appendChild(label)
        inputContainer.appendChild(input)
        inputContainer.appendChild(errorContainer)

        return inputContainer
    }


    const renderSignup = () => {
        if(activeElement) activeElement.remove()
        const signupForm = document.createElement('form')
        signupForm.classList.add('signup-form')

        const signUpHeader = document.createElement('h2')
        signUpHeader.innerText = 'Sign Up'

        signupForm.appendChild(signUpHeader)

        const emailField = genInput('email', 'email', 'Email', validateEmail)

        const usernameField = genInput('text', 'username', 'Username', validateUsername)

        const displayNameField = genInput('text', 'displayName', 'Display Name' , validateDisplayName)

        const passwordField = genInput('password', 'password', 'Password' ,validatePassword)

        const confirmPasswordField = genInput('password', 'confirmPassword' , 'Confirm Password', validateConfirmPassword)


        const submit = document.createElement('button')
        submit.innerText = 'submit'
        submit.classList.add('submit-btn')

        submit.addEventListener('click', signUp)
        signupForm.appendChild(emailField)
        signupForm.appendChild(usernameField)
        signupForm.appendChild(displayNameField)
        signupForm.appendChild(passwordField)
        signupForm.appendChild(confirmPasswordField)
        signupForm.appendChild(submit)
        genAuthOptions()
        notebook.append(signupForm)
        activeElement = signupForm
        // display.append(notebook)
    }

    const renderLogin = () => {
        if(activeElement) activeElement.remove()
        const loginForm = document.createElement('form')
        loginForm.classList.add('signup-form')

        const loginHeader = document.createElement('h2')
        loginHeader.innerText = 'Login'

        loginForm.appendChild(loginHeader)

        let credentialInputContainer = document.createElement('div')
        credentialInputContainer.classList.add('form-group')

        let credentialErrorContainer = document.createElement('div')
        credentialErrorContainer.classList.add('error-contaier')


        let credentialLabel = document.createElement('label')
        credentialLabel.htmlFor =' credentialInput'
        credentialLabel.innerText = 'Username or Email'

        let credentialInput = document.createElement('input')
        credentialInput.type = 'text'
        credentialInput.id = 'credentialInput'
        credentialInput.classList.add('form-control')
        credentialInput.placeholder = 'Enter Username or Email'
        credentialInput.value = loginState.credential

        credentialInput.addEventListener('input', (e)=> {
            let value = e.target.value.trim()

            loginState['credential'] = value
        })

        credentialInputContainer.appendChild(credentialLabel)
        credentialInputContainer.appendChild(credentialInput)
        credentialInputContainer.appendChild(credentialErrorContainer)

        let passwordInputContainer = document.createElement('div')
        passwordInputContainer.classList.add('form-group')

        let passwordErrorContainer = document.createElement('div')
        passwordErrorContainer.classList.add('error-contaier')


        let passwordLabel = document.createElement('label')
        passwordLabel.htmlFor = 'passwordInput'
        passwordLabel.innerText = "Password"

        let passwordInput = document.createElement('input')
        passwordInput.type = 'password'
        passwordInput.id = 'passwordInput'
        passwordInput.classList.add('form-control')
        passwordInput.placeholder = 'Password'


        passwordInput.addEventListener('input', (e) => {
            let value = e.target.value.trim()

            loginState['password'] = value
        })

        passwordInputContainer.appendChild(passwordLabel)
        passwordInputContainer.appendChild(passwordInput)
        passwordInputContainer.appendChild(passwordErrorContainer)

        const submit = document.createElement('button')
        submit.innerText = 'submit'
        submit.classList.add('submit-btn')

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()

            credentialErrorContainer.innerHTML = ''
            passwordErrorContainer.innerHTML = ''

            let user = validateCredential()

            if(!user){
                let error = genError(loginErrorObj.credential)
                credentialErrorContainer.appendChild(error)
                return
            }else{
                credentialErrorContainer.innerHTML = ''
            }

            let success = validateLogin(user, loginState.password)

            if(success){
                passwordErrorContainer.innerHTML = ''
                currentUser = user
                renderNotes()
            }else{
                let error = genError(loginErrorObj.password)
                passwordErrorContainer.appendChild(error)
                return
            }
        })

        loginForm.appendChild(credentialInputContainer)
        loginForm.appendChild(passwordInputContainer)

        loginForm.appendChild(submit)
        genAuthOptions()
        notebook.appendChild(loginForm)
        activeElement = loginForm
    }

    const signUp = (e) => {
        e.preventDefault()
        if(Object.values(errorObj).filter(el => el).length){
            alert('Please ensure all fields are valid')
            return
        }

        emails[signUpState.email] = true
        usernames[signUpState.username] = true

        let newUser = genUser(signUpState.email, signUpState.username, signUpState.password)

        users.push(newUser)
        currentUser = newUser
        activeElement.remove()
        localStorage.setItem('usernames', JSON.stringify(usernames))
        localStorage.setItem('emails', JSON.stringify(emails))
        localStorage.setItem('users', JSON.stringify(users))
        renderNotes()
    }

    const validateLogin = (user, password) => {

        let hash = CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64)
        let check = user['hashedPassword']
        let result = hash === check
        if(!result){
            loginErrorObj.password = 'Error signing in with this combination'
        }else{

            loginErrorObj.password = null
        }

        return result
    }

    const logout = () => {

        activeElement.remove()
        options.innerHTML = ''
        currentUser = null
        renderSignup()
    }

    const renderNotes = () => {
        if(activeElement) activeElement.remove()
        options.innerHTML = ''
        let noteContainer = document.createElement('div')
        noteContainer.classList.add('noteContainer')
        const saved = localStorage.getItem('notes');
        if (saved) {
            let savedNotes = JSON.parse(saved);
            savedNotes.forEach(note => {
                if(note.user === currentUser){

                    let formattedNote = formatNote(note);
                    noteContainer.append(formattedNote);
                }
            })
        }
        const noteForm = document.createElement('form');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Your note here...';
        const submit = document.createElement('button');
        submit.type = 'submit';
        submit.innerHTML = 'Submit';

        const logOutBtn = document.createElement('button');
        logOutBtn.type = 'button'
        logOutBtn.innerHTML = 'Logout';
        logOutBtn.addEventListener('click' , logout)
        noteForm.addEventListener('submit', e => {
            e.preventDefault();

            const text = input.value.trim();

            addNote(text);
            input.value = '';
        });

        noteForm.append(input);
        noteForm.append(submit);
        noteForm.append(logOutBtn)
        notebook.append(noteContainer)
        activeElement = noteContainer
        display.append(notebook);
        options.append(noteForm);
    }
    // const noteForm = document.createElement('form');
    // const input = document.createElement('input');
    // input.type = 'text';
    // input.placeholder = 'Your note here...';
    // const button = document.createElement('button');
    // button.type = 'submit';
    // button.innerHTML = 'Submit';

    // noteForm.addEventListener('submit', e => {
    //     e.preventDefault();

    //     const text = input.value.trim();

    //     addNote(text);
    //     input.value = '';
    // });

    // noteForm.append(input);
    // noteForm.append(button);

    display.append(notebook);
    // options.append(noteForm);


    // renderNotes();
    renderLogin()
    // renderSignup()
}
