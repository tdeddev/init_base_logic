const BASE_URL = 'http://localhost:4000'

window.onload = async () => {
    await display()
}

const display = async () => {
    let data = await axios.get(`${BASE_URL}/getuser`)
    let htmlDisplay = '<div>'
    const content = document.getElementById('content')
    for(let i = 0; i < data.data.data.length; i++){
        htmlDisplay += `<div>${data.data.data[i].id} ${data.data.data[i].firstname} ${data.data.data[i].lastname}
        <a href='index.html?id=${data.data.data[i].id}'><button>edit</button> </a>
        <button class='delete' data-id='${data.data.data[i].id}'>delete</button>
        </div>`
    }
    
    htmlDisplay += '</div>'
    content.innerHTML = htmlDisplay
    const deleteUser = document.getElementsByClassName('delete');
    const editUser = document.getElementsByClassName('edit')
    for(let i = 0; i < deleteUser.length; i++){
        deleteUser[i].addEventListener('click', async (events) => {
            let id = events.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/delete/${id}`)
                display()
            } catch (error) {
                console.log(error)
            }

        })
    }
}