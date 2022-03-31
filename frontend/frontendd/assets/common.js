const url = 'http://localhost:5001'

const getData = () => {

    transferData(url + '/show-data')
        .then(resp => {
            let html = '<ul>'

            resp.data.forEach(value => {
                html += `<li data-id="${value._id}">
                            <a class="btn btn-danger delete-data">Delete</a>
                        </li>`
            })

            html += '</ul>'

            document.querySelector('#todos').innerHTML = html


            document.querySelectorAll('.delete-data').forEach(element => {
                let id = element.parentElement.getAttribute('data-id')

                element.addEventListener('click', () => {

                    transferData(url + '/delete-data/' + id, 'DELETE')
                        .then(resp => resp.json())
                        .then(resp => {
                            getData()

                        })
                })
            })
        })
}

getData()






