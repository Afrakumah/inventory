const express = require('express') 
const {MongoClient, ObjectId} = require('mongodb')
const morgan = require('morgan')


const app = express()
const port = process.env.PORT || 5500

app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan('dev'))

// const mongoUrl = 'mongodb://127.0.0.1:27017'

// const mongoUrl = 'mongodb+srv://angel:angel@cluster0.grxx2nl.mongodb.net/inventory'
const baseName = 'inventory';

let dbase;

async function connectDb() {
    const client = new MongoClient(mongoUrl)
    try { 

    await client.connect()

    dbase = client.db(baseName)
    console.log('mongodb connected successfully')

} catch (error) {
    console.log('error', error);
}
}


//        storing data
app.post('/api/paper_product', async (req, res) => {
    const { item, state, qtyinStock, price} = req.body

    const paper_product = {
        item,
        state,
        qtyinStock,
        price
    }

    const paper = await dbase.collection('paper_products').insertOne(paper_product);
    res.status(201).send(paper)
})


//        display all in the collection in an array format
app.get('/api/paper_products', async (req, res) => {

    try { 
    const paper_products = await dbase.collection('paper_products').find().toArray()

    res.send(paper_products)

} catch(error) {
    console.log(error);
}

})


//       display data using id
app.get('/api/paper_products/:id', async (req, res) => {
    const {id} = req.params
try { 
    const paper_product = await dbase.collection('paper_products').findOne({ _id: new ObjectId(id) })

    if(!paper_product) {
        return res.status(500).send('item not found')
    }

    res.send(paper_product)

} catch(error) {
    console.log(error);
    res.status(500).send(error)
}
})



//        deleting item using id
app.delete('/api/paper_products/:id', async (req, res) => {
    const {id} = req.params

    try {
    const paper_product = await dbase.collection('paper_products').deleteOne({ _id: new ObjectId(id) })

    if(!paper_product === 0) {
        return res.status(500).send('item not found')
    }

    // res.redirect('api/paper_products')

} catch(error) {
    console.log(error);
    res.status(500).send(error)
}
})



//         updating collection using id
app.put('/api/paper_products/:id', async (req, res) => {

    const { id } = req.params

    const { item, state, qtyinStock, price} = req.body

    const paper_product = {
        item,
        state,
        qtyinStock,
        price
    }

    try { 
    const updatedPaper = dbase.collection('paper_products').findOneAndUpdate({_id: new ObjectId(id)}, 
    {$set: paper_product}, {returnDocument: 'after'})

    res.send(updatedPaper)

} catch(error) {
    console.log(error);
}
})





//             crud on toiletteries collection
app.post('/api/toilettery', async (req, res) => {
    const {type, quantity, productionState, price} = req.body

    const toilettery = {
        type, quantity, productionState, price
    }

    const product = await dbase.collection('toiletteries').insertOne(toilettery)

    res.status(201).send(product)
})



//    retrieving toilettery
app.get('/api/toiletteries', async (req, res) => {
    try { 
    const toiletteries = await dbase.collection('toiletteries').find().toArray()

    res.send(toiletteries)

} catch(error) {
    console.log(error);
}
})



//     retrieving one using an id
app.get('/api/toiletteries/:id', async (req, res) => {
    const {id} = req.params
try { 
    const toilettery = await dbase.collection('toiletteries').findOne({_id: new ObjectId (id)})

    if(!toilettery) {
        return res.status(500).send('item not found')
    }

    res.send(toilettery)
} catch(error) {
    console.log(error);
    res.status(500).send(error)
}
})



//     deleting one using id
app.delete('/api/toiletteries/:id', async (req, res) => {
    const {id} = req.params
try {
    const toilettery = await dbase.collection('toiletteries').deleteOne({_id: new ObjectId(id)})

    if(!toilettery === 0) {
        return res.status(500).send('item not found')
    }

    res.redirect('/api/toiletteries')
} catch(error) {
    console.log(error);
    res.status(500).send(error)
}
})



//     updating collection using id
app.put('/api/toiletteries/:id', async (req, res) => {
    const {id} = req.params

    try { 
    const { type, quantity, productionState, price } = req.body

    const toilettery = {
        type, quantity, productionState, price
    }

    const updatedProduct = await dbase.collection('toiletteries').findOneAndUpdate({_id: new ObjectId(id)}, 
    {$set: toilettery}, {returnDocument: 'after'})

    res.send(updatedProduct)

} catch(error) {
    console.log(error);
}
})






app.listen(port, () => { 
    connectDb();
 console.log(`server is listening on port ${port}`)
})