import express from 'express';
// import routes from './routes/routes.js'
import controller from './controller/controller.js';

const app = express();
const port = process.env.port || 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// app.use(routes.routes);

app.get('/', controller.getData);

app.get('/post', controller.createMongoData);

app.listen(port, () => {
    console.log("I'm listening", port, "Lets fucking do this!");
})