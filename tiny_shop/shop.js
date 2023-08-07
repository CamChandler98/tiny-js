
class Cart {
    constructor (items = {}, total = 0.00){
        this.items = items;
        this.total = total
    }

    addItem(item){

        if(!this.items[item.id]){
            this.items[item.id] = {...item, count: 1}
        }else{
            this.items[item.id].count += 1
        }

        this.total += item.price
        this.total = Math.abs(this.total)
        return
    }

    removeItem(item){
        if(this.items[item.id]){
            this.items[item.id].count -= 1
            this.total -= item.price
            this.total = Math.abs(this.total)
            if(this.items[item.id].count <= 0){
                delete this.items[item.id]
            }
        }
    }

}

let seedItems = {
    apple: {
        "id":1,
        "url": 'https://tinyshopawsbucket.s3.amazonaws.com/Tiny_Shop_Images/1.png',
        "name": "apple",
        "price": 3.00
    },
    orange: {
        "id":3,
        "url": 'https://tinyshopawsbucket.s3.amazonaws.com/Tiny_Shop_Images/3.png',
        "name": "orange",
        "price": 1.50
    },
    banana: {
        "id":2,
        "url": 'https://tinyshopawsbucket.s3.amazonaws.com/Tiny_Shop_Images/2.png',
        "name": "banana",
        "price": 10.00
    },
    strawberry: {
        "id":5,
        "url": 'https://tinyshopawsbucket.s3.amazonaws.com/Tiny_Shop_Images/5.png',
        "name": "strawberry",
        "price": 2.30
    },
    pear: {
        "id":4,
        "url": 'https://tinyshopawsbucket.s3.amazonaws.com/Tiny_Shop_Images/4.png',
        "name": "pear",
        "price": 2.10
    }
}


const localStorage = window.localStorage

let localItems = JSON.parse(localStorage.getItem('cart')) || {}

let localTotal = JSON.parse(localStorage.getItem('total')) || 0.00

const generateShop = async () => {

    // const shop = document.createElement('div');
     $('#display').append(jQuery('<div>', {
        id: 'shop',
        css : {
            border: `5px solid ${appList[0].color}`
        }

    }))



    let NewCart = new Cart(localItems, localTotal)

    let items = Object.values(seedItems)

    // let cartButton = document.createElement('button')
    // cartButton.innerText = `Total: $${NewCart.total.toFixed(2)}`

    $('#options').append(
        jQuery(
            '<button></button>',
            {
                id : 'cartButton'
            }
        ).text(`Total: $${NewCart.total.toFixed(2)}`)
    )

    let cartOpen = false

    const updateCart = (total) => {
    //   cartButton.innerText = `Total: $${NewCart.total.toFixed(2)}`

    $('#cartButton').text(`Total: $${NewCart.total.toFixed(2)}`)
    }


    // let shelves = document.createElement('div')
    // shelves.id = 'shelves'
    // let shopTitle = document.createElement('h2')
    // shopTitle.innerText = "Bizarre Bazaar"
    // shelves.append(shopTitle)

    $('#shop').append(jQuery('<div>',{
        id: 'shelves',
    }).append(jQuery(
        '<h2></h2>'
    ).html('Bizarre Bazaar')))


    const stockShelves = () => {
        items.forEach(item => {
            let newItem = document.createElement('div')
            newItem.classList.add('item')
            let name = document.createElement('span')
            name.innerText = item.name

            let price = document.createElement('span')
            price.innerText = '$' + item.price.toFixed(2)

            let pic = document.createElement('img')
            pic.src = item.url
            pic.style.height = '40px'

            let buyButton = document.createElement('button')
            buyButton.innerText = '+'

            buyButton.onclick = () => {
                NewCart.addItem(item)
                console.log(NewCart)
                localStorage.setItem('cart', JSON.stringify(NewCart.items))
                localStorage.setItem('total', NewCart.total)
                updateCart(NewCart.total)
            }
            newItem.append(name)
            newItem.append(pic)
            newItem.append(price)
            newItem.append(buyButton)

            $('#shelves').append(newItem)
        })

    }

    let cart = document.createElement('div')
    cart.id = 'cart'

    let checkoutButton = document.createElement('button')
    checkoutButton.innerText = 'Checkout'

    checkoutButton.onclick = () => {

        NewCart = new Cart()
        updateCart()
        localStorage.setItem('cart', JSON.stringify(NewCart.items))
        localStorage.setItem('total', NewCart.total)
        cart.innerHTML = null
        cart.innerText= 'Thanks for shopping!'
    }


    const showCart = () => {
        cart.innerHTML = null
        let total = document.createElement('h2')
        total.id = 'total'
        total.innerText = `Total: $${NewCart.total.toFixed(2)}`
        cart.append(total)
        for(let key in NewCart.items){
            let item = NewCart.items[key]
            let itemDis = document.createElement('div')
            let pic = document.createElement('img')
            pic.src = item.url

            let itemText = document.createElement('span')
            itemText.innerText = `${item.name}: ${item.count}`

            let removeButton = document.createElement('button')
            removeButton.innerText = '-'

            removeButton.addEventListener('click', () => {
                NewCart.removeItem(item)
                updateCart()

                localStorage.setItem('cart', JSON.stringify(NewCart.items))
                localStorage.setItem('total', NewCart.total)
                if(item.count === 0){
                    itemDis.remove()
                }
                total.innerText = `Total: $${NewCart.total.toFixed(2)}`
                  itemText.innerText = `${item.name}: ${item.count}`

            })
            itemDis.append(pic)
            itemDis.append(itemText)
            itemDis.append(removeButton)
            cart.append(itemDis)
        }

        // shelves.remove()

        $('#shelves').remove()

        cart.append(checkoutButton)
        $('#shop').append(cart)
        cartOpen = true
    }


    const showShelves = () => {
        cart.remove()
        // shop.append(shelves)
        $('#shop').append(jQuery('<div>',{
            id: 'shelves',
        }).append(jQuery(
            '<h2></h2>'
        ).html('Bizarre Bazaar')))
        stockShelves()
        cartOpen = false
    }

    $('#cartButton').click(  () => {
        if(cartOpen){
            showShelves()
            updateCart()
        }else{
            showCart()
            $('#cartButton').text('Back to Shop')
        }
    })

    stockShelves()

}
