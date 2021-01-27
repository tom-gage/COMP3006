let mongoose = require('mongoose');

let User;

async function initDBConnection() {

    let dbUrl = "mongodb+srv://barnaby:admin@cluster0.3qn4a.mongodb.net/myDatabase?retryWrites=true&w=majority";

    let userSchema = mongoose.Schema({
        username:String,
        password:String,
        wins:Number,
        losses:Number
    });

    if(!User){
        User = mongoose.model('Users', userSchema);
    }


    try{
        await mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}).then(function () {
            console.log('db initialised successfully');
            return true;
        });

    } catch (e) {
        console.log('db connection failed!');
        return false;
    }
}

async function closeConnection() {
    mongoose.connection.close();
}

function getUserModel() {
    if(User){
        return User;
    }
    return null;
}


module.exports = {
    initDBConnection,
    getUserModel,
    closeConnection
};