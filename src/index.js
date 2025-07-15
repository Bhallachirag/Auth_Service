const express = require('express');

const { PORT } = require('./config/serverConfig');

const app = express();

const prepareAndStartServer = () => {
    app.listen(PORT, ()=> {
        console.log(`server started on port ${PORT}`); 
    })
}

prepareAndStartServer();