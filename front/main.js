const BASE_URL = 'http://localhost:4000'

let mode = 'create'
let selectedId = ''

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if(id){
        mode = 'edit',
        selectedId = id
    }
    let obj = await axios.get(`${BASE_URL}/getuser/${selectedId}`)
    let response = obj.data.data[0]

    let fn = document.querySelector('input[name=firstname]')
    let ln = document.querySelector('input[name=lastname]')
    
    if(!!response){
        fn.value = response.firstname
        ln.value = response.lastname
    }
    let gender = document.querySelectorAll('input[name=gender]')
    let interest = document.querySelectorAll('input[name=interest]')

    for(let i = 0; i < gender.length; i++){
        if(gender[i].value == response.gender){
            gender[i].checked = true
        }
    }

    for(let i = 0; i < interest.length; i++){
        if(response.interest.includes(interest[i].value)){
            interest[i].checked = true
        }
    }

}

const validate = (userData) => {
    let errors = []
    if(!userData.firstname){
        errors.push('กรุณาใส่ชื่อ')
    }
    if(!userData.lastname){
        errors.push('กรุณาใส่นามสกุล')
    }
    if(!userData.gender){
        errors.push('กรุณาเลือกเพศ')
    }
    if(!userData.interest){
        errors.push('กรุณาเลือกความสนใจ อย่างน้อย 1 อย่าง')
    }

    return errors
}
const sumbit = async (event) => {
    let fn = document.querySelector('input[name=firstname]')
    let ln = document.querySelector('input[name=lastname]')
    let gender = document.querySelector('input[name=gender]:checked') || {}
    let interest = document.querySelectorAll('input[name=interest]:checked') || {}
    let message = document.getElementById('message')
    let interest_check = ''
    for(let i = 0; i < interest.length; i++){
        interest_check += interest[i].value
        if(i != interest.length - 1){
            interest_check += ','
        }
    }
    try {
        let userObject = {
            firstname : fn.value,
            lastname : ln.value,
            gender : gender.value,
            interest : interest_check
        }
    
        let errors = validate(userObject)
    
        if(errors.length > 0){
            throw {
                message : 'กรอกข้อมูลไม่ครบ',
                errors : errors
            }
        }
        if(mode == 'edit'){
            let updateUser = await axios.put(`${BASE_URL}/updateuser/${selectedId}`, userObject)
            message.innerHTML = 'แก้ไขข้อมูลสำเร็จ';
            message.className = 'message success'
        }else{
            let insertUser = await axios.post(`${BASE_URL}/insert`, userObject)
            message.innerHTML = 'บันทึกข้อมูลสำเร็จ';
            message.className = 'message success'
        }
    } catch (error) {
        let htmlError = '<div>'

        htmlError += `<div>${error.message}</div>`
        htmlError += '<ul>'
        for(let i=0; i < error.errors.length; i++){
            htmlError += `<li>${error.errors[i]}</li>`
        }
        htmlError += '</ul>'
        htmlError += '</div>'
        
        message.innerHTML = htmlError;
        message.className = 'message danger'
    }
}