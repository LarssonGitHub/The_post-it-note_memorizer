function validateUser(req, res, next) {
    console.log(req.session);
    if (!req.session.isValidated) {
        //Sätt ett lämpligt medelande på alla redirect
        req.session.notification = "access denied"
        return res.redirect('/user/login');
    }
    console.log(req.session.isValidated);
    return next();
}

export default {
    validateUser
}