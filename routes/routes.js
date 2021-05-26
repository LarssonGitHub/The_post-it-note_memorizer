import express from 'express';
import controller from '../controller/controller.js';

const router = express.Router();

router.get('/', controller.validateUser, controller.getCollection);

router.get('/login', controller.login)

router.get('/:id', controller.validateUser, controller.getDocument);

router.post('/', controller.validateUser, controller.createDocument);

router.put('/:id', controller.validateUser, controller.updateDocument);

router.delete('/:id', controller.validateUser, controller.deleteDocument);

router.delete('/nuke/database', controller.validateUser, controller.deleteCollection);


//If it does not exist...
router.get('*', controller.pageNotfound);
router.post('*', controller.pageNotfound);
router.put('*', controller.pageNotfound);
router.delete('*', controller.pageNotfound);

export default {
    routes: router
}