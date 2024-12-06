const express = require('express');
const app = express();
const port = 3001;

//Routers
//const itemRouter = require('./routes/Items')
//app.use("/items", itemRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});