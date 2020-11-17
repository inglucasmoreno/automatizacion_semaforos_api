const chalk = require('chalk');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const topic = 'intermitencia';
const socketIO = require('socket.io');   // IMPORTANTE - Version 2.3.0
const Semaforo = require('../models/semaforo.model');

const mqttConnect = (server) => {

    const io = socketIO(server);
    io.on('connect', socket => {
        
        // Conexion / Desconexion de usuarios - WebSocket
        console.log('Nuevo usuario conectado');
        socket.on('disconnect', ()=>{
            console.log('Usuario desconectado');
        })

        // Se recibe un codigo
        client.on('message', async (topic, message) => {
            let codigo = String(message);
            console.log(`Topico: ${topic} | Codigo: ${message}`);
            const semaforo = await Semaforo.findOneAndUpdate({codigo},{intermitente: true}); 
            if(semaforo) socket.emit('intermitencia', semaforo.descripcion);
        });

    });
   
    client.on('connect', () => {
        console.log(chalk.blue('[MQTT]') + ' - Conectado a Broker');
        client.subscribe(topic);
    });
}

module.exports = mqttConnect;