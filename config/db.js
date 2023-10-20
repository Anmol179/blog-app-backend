const mongoose = require(`mongoose`);

const connection = mongoose.connect(`mongodb+srv://anmoljain834:Anmol123456@cluster0.tnrlsw8.mongodb.net/BlogApp`);

module.exports = {connection}