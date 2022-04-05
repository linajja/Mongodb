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

const newOrderForm = async () => {
    const root = document.querySelector('#newOrderForm')
    const productsContainer = root.querySelector('.productSelect')

    const products = await transferData(url + '/show-products')

    let html = '<ul>'

    products.forEach(product => {
        let price = `<span class="normalPrice">${product.price}</span>`

        if (product.discount_price)
            price = `<span class="specialPrice">${product.discount_price}</span>
                    <span class="originalPrice">${product.price}</span>`

        html += `<li>
                    <input type="radio" name="product" value="${product._id}">
                    <div class="contents">
                        <div class="name">${product.product_name}</div>
                        <div class="description">${product.description}</div>
                        <div class="price">${price}</div>
                    </div>
                </li>`
    })

    html += '<ul>'

    productsContainer.innerHTML = html
}

window.addEventListener('load', () => {
    newOrderForm()
})