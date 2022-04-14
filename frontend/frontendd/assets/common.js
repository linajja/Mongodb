const url = 'http://localhost:5001'

const transferData = async (url, method = 'GET', data = {}) => {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (method != 'GET')
        options.body = JSON.stringify(data)

    const resp = await fetch(url, options)

    return resp.json()
}

const validator = (fields) => {
    let valid = true
    let entries = Object.entries(fields)

    if (!fields.product) {
        valid = false
    }

    entries.forEach(value => {
        if (value[1] == '') {
            valid = false
            let messages = document.querySelector('.messages')
            messages.innerHTML = "Neužpildyti duomenys"
            messages.classList.add('show-alert')
        }
    })

    return valid
}

const orderList = async () => {
    const orderContainer = document.querySelector('.orderList')

    const orderInfo = await transferData(url + '/orders/order-info')

    let html = '<ul>'

    orderInfo.forEach(info => {

        html += `<li>
                    <label>
                        <div> 
                            <button type="button" class="btn btn-danger delete-button">Trinti</button>
                            <div class="client">Pirkėjas: ${info.first_name} ${info.last_name}</div>
                            <div class="address">Pristatymo adresas: ${info.address}, ${info.city}, ${info.post_code}</div>
                            <div class="contacts">Kontaktai: ${info.email}, ${info.phone}</div>
                            <div class="shipping_method">Siuntimo būdas:  ${info.shipping_method}</div>
                            <div class="payment_method">Apmokėjimo būdas: ${info.payment_method}</div>
                            <div class="id" id="id" data-id="${info._id}">Prekės ID: ${info._id}</div>
                            <div class="product">Prekė: ${info.product}</div>
                            <div class="product">Suma: ${info.total}</div>
                        </div>
                    </label>
                </li>`
    })

    html += '<ul>'

    orderContainer.innerHTML = "Užsakymų informacija" + html

}

const deleteOrder = async () => {


    document.querySelectorAll('.delete-button').forEach(element => {

        let id = element.getAttribute('data-id')

        element.addEventListener('click', () => {

            transferData(url + '/orders/delete-order/' + id, 'DELETE')
                .then(resp => {
                    orderList()

                })

        })
    })
}



const newOrderForm = async () => {
    const root = document.querySelector('#newOrderForm')
    const productsContainer = root.querySelector('.productSelect')

    const products = await transferData(url + '/products/show-products')

    let html = '<ul>'

    products.forEach(product => {
        let price = `<span class="normalPrice">${product.price}</span>`
        let dataPrice = product.discount_price ? product.discount_price : product.price

        if (product.discount_price)
            price = `<span class="specialPrice">${product.discount_price}</span>
                    <span class="originalPrice">${product.price}</span>`

        html += `<li>
                    <label>
                        <input type="radio" data-price="${dataPrice}" name="product" value="${product._id}">
                        <div class="contents">
                            <div class="name">${product.product_name}</div>
                            <div class="description">${product.description}</div>
                            <div class="price">${price}</div>
                        </div>
                    </label>
                </li>`
    })

    html += '<ul>'

    productsContainer.innerHTML = html

    root.querySelector('button.checkout-button').addEventListener('click', () => {
        const form = root.querySelector('form')
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData)


        if (validator(formJson)) {
            transferData(url + '/orders/save-order', 'POST', formJson)
                .then(resp => {
                    orderList()
                    let messages = document.querySelector('.messages')
                    const messageDiv = document.querySelector('.messages')
                    messageDiv.classList.remove('show-alert')
                    messages.innerHTML = resp.message
                    messages.classList.add('show')

                })
        }
    })

    root.querySelectorAll('input[name="product"]').forEach(product => {

        product.addEventListener('click', () => {
            let price = product.getAttribute('data-price')
            let changePrice = parseFloat(price)
            let shipMethod = document.getElementById('shiping')
            let transportPrice = changePrice + 3.63
            if (shipMethod.value === "delivery") {
                document.querySelector('input[name="total"]').value = transportPrice.toFixed(2)
                root.querySelector('.totals').textContent = "Mokėti: " + (transportPrice).toFixed(2) + " EUR"
            } if (shipMethod.value === "pickup") {
                document.querySelector('input[name="total"]').value = changePrice.toFixed(2)
                root.querySelector('.totals').textContent = "Mokėti: " + changePrice.toFixed(2) + " EUR"
            }
            if (
                root.querySelector('#shiping').addEventListener('change', () => {

                    if (shipMethod.value === "delivery") {
                        document.querySelector('input[name="total"]').value = transportPrice.toFixed(2)
                        root.querySelector('.totals').textContent = "Mokėti: " + (transportPrice).toFixed(2) + " EUR"
                    } if (shipMethod.value === "pickup") {
                        document.querySelector('input[name="total"]').value = changePrice.toFixed(2)
                        root.querySelector('.totals').textContent = "Mokėti: " + changePrice.toFixed(2) + " EUR"
                    }
                })
            )
                return

        })
    })

}



document.querySelector('.add-new-order').addEventListener('click', (event) => {
    const element = event.target
    const activeLabel = element.getAttribute('data-active-label')
    const hiddenLabel = element.getAttribute('data-hiden-label')

    const root = document.querySelector('#newOrderForm')

    element.textContent = root.classList.contains('show') ? hiddenLabel : activeLabel

    root.classList.toggle('show')

    newOrderForm()
})

