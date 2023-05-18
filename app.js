require('dotenv').config()

//require('express-async-errors')
const express = require('express')
const app = express()

const connectDB = require('./db/connect');
const productsRouter = require('./routes/products')

const notfoundMiddleWare = require('./middleware/not-found')
const erroMmiddleWare = require('./middleware/error-handler');


//midelware
app.use(express.json())


app.use('/api/v1/products', productsRouter)

app.use(notfoundMiddleWare)
app.use(erroMmiddleWare)



app.get('/', (req, res) => {
    res.send('<h1>Store Api</h2><a href="api/v1/products">products rout</a>')
})



const port = process.env.PORT || 3000
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server listen at ${port}...`))
    } catch (error) {
        console.log(error);
    }
}
start()