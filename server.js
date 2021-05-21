import express from 'express';
// import routes from './routes/routes.js'
import controller from './controller/controller.js';

const app = express();
const port = process.env.port || 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// app.use(routes.routes);

app.get('/', controller.getCollection);

app.get('/:id', controller.getDocument);

app.post('/', controller.createMongoData);

app.put('/put/:id', controller.updateDocument);

app.delete('/delete/:id', controller.deleteDocument);

app.delete('/nuke/database', controller.deleteCollection);

//If it does not exist...
app.get('*', controller.pageNotfound);
app.post('*', controller.pageNotfound);
app.put('*', controller.pageNotfound);
app.delete('*', controller.pageNotfound);

app.listen(port, () => {
    console.log("I'm listening", port, "Lets fucking do this!");
})