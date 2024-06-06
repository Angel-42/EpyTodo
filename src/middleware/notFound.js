const not_found = (req, res, next) => {
    console.error(`Not found: ${req.method} ${req.originalUrl}`);
    res.status(404).send('Not found');
};

module.exports = not_found;