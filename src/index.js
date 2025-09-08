const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { PORT, FRONT_END_LINK} = require('./config/serverConfig');
const apiRoutes = require('./routes/index');

const db = require('./models/index'); 

const app = express();

app.use(cors({
  origin: FRONT_END_LINK,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    app.listen(PORT, async ()=> {
        console.log(`server started on port ${PORT}`); 
        if(process.env.DB_SYNC){
            db.sequelize.sync({ alert: true });
        }
    });
}

prepareAndStartServer();