const url = 'http://localhost:5001'
const mainInput = document.querySelector('#new-todo')
const addButton = document.querySelector('#add-new-todo')
const messageDiv = document.querySelector('.messages')

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

const getData = () => {

    transferData(url + '/show-data')
        .then(resp => {
            let html = '<ul>'

            resp.forEach(value => {


                html += `<li data-id="${value._id}">
                            <span class="content">${value.content}</span>
                            <span class="data">${value.data}</span>
                            <a class="btn btn-danger delete">Delete</a>
                             <a class="btn btn-primary float-end edit">Edit</a>
                        </li>`
            })

            html += '</ul>'

            document.querySelector('#content').innerHTML = html

            document.querySelectorAll('.delete').forEach(element => {
                let id = element.parentElement.getAttribute('data-id')

                element.addEventListener('click', () => {

                    transferData(url + '/delete-data/' + id, 'DELETE')
                        .then(resp => {
                            getData()
                        })

                })
            })
            document.querySelectorAll('.edit').forEach(element => {

                let id = element.parentElement.getAttribute('data-id')
                let content = element.parentElement.querySelector('.content').textContent

                element.addEventListener('click', () => {

                    mainInput.value = content;
                    mainInput.classList.add('edit-mode')
                    mainInput.setAttribute('data-mode', 'edit')
                    addButton.textContent = addButton.getAttribute('data-edit-label')
                    addButton.setAttribute('data-id', id)
                })

            })

            document.getElementById('add-new-todo').forEach(element => {

                let id = element.parentElement.getAttribute('data-id')

                element.addEventListener('click', () => {

                    transferData(url + '/edit-data/' + id, 'PUT')
                        .then(resp => {
                            getData()
                        })

                })
            })
        })
}

window.addEventListener('load', () => {
    getData()
})


