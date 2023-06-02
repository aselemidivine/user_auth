// IMPORTING LIBRARIES
const app = require('./app');
const port = process.env.PORT || 1025;

app.listen(port, () => {
    console.log(`server listening on port ${port}!`)
})
