

const generateAsk = () => {
    let qp = ''

    const ask = document.createElement('div');
    ask.id = 'ask';
    ask.style.border = `5px solid ${appList[0].color}`

    const askHeader = document.createElement('h2');
    askHeader.innerText = 'The oracle can tell you about any one thing'

    const answerContainer = document.createElement('div');
    answerContainer.id = 'answerContainer'


    let answerHeader = document.createElement('h3')
    answerHeader.classList.add('answerHeader')
    answerHeader.innerText = 'Ask the Oracle'




    ask.appendChild(askHeader)
    ask.appendChild(answerHeader)
    ask.appendChild(answerContainer)

    const getWiki = async (query) =>{
        query = query.trim().toLowerCase()
        let res = await fetch(`https://murmuring-river-69949.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&generator=search&prop=extracts&exintro&explaintext&exlimit=max&format=json&gsrsearch=${query}`,{
            // mode: 'no-cors',
            headers: {
                'Accept': 'application/json'
            },
        })

        console.log(res,' res')
        let goodResults  = []
        let data
        let finalResults = []
        try{
            console.log('try parse')
            console.log(res)
            data = await res.json()
            console.log('data', data)
            console.log(res.url)
            let pages = data.query.pages
            for(let key in pages){
                console.log(pages, key)
                let page = pages[key]
                console.log(page , 'page')
                if(page.title.toLowerCase().includes(query)){
                goodResults.push(page.extract.split('\n'))
                }
            }
        }catch(e){
         console.log('woops')
        }

        for(let result of goodResults){
            for(let text of result){
                if(text.toLowerCase().includes(query) && !text.toLowerCase().includes('refer to:')){
                    finalResults.push(text)
                }
            }
        }

        return finalResults
    }

    const askOracle = async (query) => {
        qp = query
        let possibleanswers = await getWiki(query)
        console.log('possible answers' , possibleanswers)

        let answer = possibleanswers[(Math.floor(Math.random() * possibleanswers.length))]
        console.log('this is what i chose' , answer)
        return answer

    }
    const renderAnswer = (answer) => {
        // let answerHeader = document.
        answerHeader.innerText = `The oracle says this about ${qp}:`

        let answerText = document.createElement('p')

        answerText.innerText = answer

        answerContainer.innerHTML = answer
    }
    const genInput = () => {
        const inputForm = document.createElement('form')
        const inputField = document.createElement('input')
        const submitButton = document.createElement('button')

        submitButton.type = 'sumbit'
        submitButton.innerText = 'Ask'
        inputForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            let answer = await askOracle(inputField.value.trim())
            console.log('answer', answer)
            renderAnswer(answer)
        })

        inputForm.appendChild(inputField)
        inputForm.appendChild(submitButton)

        options.append(inputForm)
    }

    genInput()
    display.append(ask)
}
