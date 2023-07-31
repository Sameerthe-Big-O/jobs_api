const notFound = (req, res) => res.status(404).json({
    message: `Sorry we can\'t find anythng on ${req.url} 🎾 `
})

module.exports = notFound;
