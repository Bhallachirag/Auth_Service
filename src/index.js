const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
const apiRoutes = require('./routes/index');

const db = require('./models/index'); 

// const UserRepository = require('./repository/user-repository');
// const UserService = require('./services/user-service');

const app = express();

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    app.listen(PORT, async ()=> {
        console.log(`server started on port ${PORT}`); 
        if(process.env.DB_SYNC){
            db.sequelize.sync({ alert: true });
        }

        // const repo = new UserRepository();
        // const response = await repo.getById(1);
        // console.log(response);
        // const service = new UserService();
        // const newToken = service.createToken({email: 'chirag@admin.com',id: 1});
        // console.log(newToken);
    });
}

prepareAndStartServer();