const chalk = require('chalk');
const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/control_stock',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true            
        });
        console.log(chalk.blue('[MongoDB]') + ' - DB conectada correctamente');
    }catch(error){
        console.log(error);
        throw new Error('Error al levantar la base de datos');
    }
}

module.exports = dbConnection;
