const mongoose = require('mongoose')

const dbConnection = async() => {
  try {
    mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Conexion exitosa');
  } catch(error) {
    console.log(error);
    throw new Error('Error a la hora de iniciar la DB ver logs');
  }
}

module.exports = {
  dbConnection
}
