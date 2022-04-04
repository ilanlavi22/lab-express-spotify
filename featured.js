const featured = (req, res, next) => {
    req.featured = Date.now();
    next();
}


module.exports = featured;