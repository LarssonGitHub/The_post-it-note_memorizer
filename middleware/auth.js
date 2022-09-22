function validateUser(req, res, next) {
    if (!req.session.isValidated) {
        req.session.notification = "access denied"
        return res.redirect('/user/login');
    }
    return next();
}

export default {
    validateUser
}