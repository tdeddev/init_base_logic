const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const bodyparser = require('body-parser')
const cors = require('cors')
let conn = null
let selectedId = null
async function connect(){
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test'
      });
}
app.use(bodyparser.json())
app.use(cors())
app.post('/insert', (req, res) => {
    let user = req.body
    let insert = conn.query('INSERT INTO users SET ?', user)
    
    res.json({
        message : 'insert success',
        code : 0,
        data : req.body
    })
})

app.get('/getuser', async (req, res) => {
    let getUser = await conn.query('SELECT * from users')
    if(getUser.length > 0){
        res.json({
            message : 'Select users',
            data : getUser[0]
        })
    }
})

app.get('/getuser/:id', async (req, res) => {
    let id = req.params.id
    let getUser = await conn.query(`select * from users where id = ?`,id)
    if(getUser.length > 0){
        res.json({
            message : 'Select users',
            data : getUser[0]
        })
    }
})

app.put('/updateuser/:id', async (req, res) => {
    let id = req.params.id

    let update = await conn.query('update users SET ? WHERE id = ?',[req.body, id])

    res.json({
        message : 'update success',
        code : 0,
        data : req.body
    })
})

app.delete('/delete/:id', async (req, res) => {
    let id = req.params.id

    let Delete = await conn.query('delete from users where id = ?', id)

    res.json({
        message : 'delete success',
        code : 0,
        data : Delete
    })

})

app.listen(4000, async () => {
    await connect();
    console.log(`port 4000 online...`)
})