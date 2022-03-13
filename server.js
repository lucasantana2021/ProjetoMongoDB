//importando nosso express
const express = require('express')
const app = express()
const { ObjectId } = require('mongodb').ObjectId

//permite o servidor se comunicar com o navegador
app.listen(3000, function(){
    console.log('o nosso servidor está rodando na porta 3000')
})

//app.get('/', (req,res) => {
    //res.send('Olá Mundo!')
//})

app.get('/',(req, res) => {
    res.render('index.ejs')
})

//para que o ejs seja usado configurado com o express
app.set('view engine', 'ejs')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))

//app.post('/show',(req, res)=>{
    //console.log(req.body)
//})

//importa o mongodb e insere a URI copiada colocando a senha cadastrada ou local
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://localhost:27017'

//conectando o nosso banco
MongoClient.connect(uri,(err, client)=>{
    if(err) return console.log(err)
    //colocando o nosso banco de dados
    db = client.db('teste-bd')

    //para salvar no nosso banco ao clicar no botão
    app.post('/show', (req,res)=>{
        db.collection('crud').save(req.body, (err, result)=>{
            if(err) return console.log(err)
            console.log('salvo no nosso banco de dados mongodb')
            res.redirect('/')
            db.collection('crud').find().toArray((err, results)=>{
                console.log(results)
            })
        })
    })

})

//O método de localização retorna um cursor(um objeto do Mongo), 
//este objeto contém todas as citações de nosso banco de dados
app.get('/', (req,res)=> {
    let cursor = db.collection('crud').find()
})

//renderizar e retornar o conteúdo do nosso banco
app.get('/show',(req,res)=>{
    db.collection('crud').find().toArray((err, results)=>{
        if(err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

//criando a nossa rota para editar
app.route('/edit/:id')
.get((req,res)=> {
    var id = req.params.id

    db.collection('crud').find(ObjectId(id)).toArray((err, result) =>{
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('crud').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, results) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')
    })
})

//criando rota para deletar
app.route('/delete/:id')
.get((req,res)=>{
    var id = req.params.id

    db.collection('crud').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletando do nosso banco de dados!')
        res.redirect('/show')
    })
})

let request = require('request');
 
let url = `http://ip-api.com/json`
let dados = '';
 
request(url, function (err, response, body) {
   if(err){
       console.log('error:', err);
   } else {
       let ipInfo = JSON.parse(body);
       dados = 
                `IP: ${ipInfo.query}
                Country: ${ipInfo.country}
                City: ${ipInfo.city}
                Region: ${ipInfo.regionName}
                Lat: ${ipInfo.lat}
                Lon: ${ipInfo.lon}
                Organization: ${ipInfo.org}`
                
       console.log(dados);
   }
});