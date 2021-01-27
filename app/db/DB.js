let mongoose = require('mongoose');

let User;

async function initDBConnection() {

    let dbUrl = "mongodb+srv://barnaby:admin@cluster0.3qn4a.mongodb.net/myDatabase?retryWrites=true&w=majority";//figured it better to leave this in than have the app fail when reviewed

    let userSchema = mongoose.Schema({
        username:String,
        password:String,
        wins:Number,
        losses:Number
    });

    if(!User){//if User not initiated
        User = mongoose.model('Users', userSchema);//initiate usre model
    }

    try{
        await mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}).then(function () {// connect to DB
            console.log('db initialised successfully');
            return true;
        });

    } catch (e) {
        console.log('db connection failed!');//connection failed
        return false;
    }
}

async function closeConnection() {// close connection
    mongoose.connection.close();
}

function getUserModel() { // get user model
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