const chalk = require('chalk');
const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/automatizacion_semaforos',{
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
