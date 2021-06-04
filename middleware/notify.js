function notify(req,res,next) {
    res.locals.notification = req.session.notification;
    delete req.session.notification;
    next();
}

export default {notify};