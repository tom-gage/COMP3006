let mongoose = require('mongoose');

let User;

function initDBConnection() {

    const dbUrl = "mongodb+srv://barnaby:admin@cluster0.3qn4a.mongodb.net/myDatabase?retryWrites=true&w=majority";

    mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}).then(function () {
        console.log('db initialised successfully');
    });

    let userSchema = mongoose.Schema({
        username:String,
        password:String,
        wins:Number,
        losses:Number
    });

    User = mongoose.model('Users', userSchema);
}

function getUserModel() {
    if(User){
        return User;
    }
    return null;
}

function updateUser(user){
    User.updateOne({
        username : user.username
    },{
        wins : user.wins,
        losses : user.losses
    });
}

function getUsers(){
    User.find({}, function (err, users) {
        return users;
    });
}

module.exports = {
    initDBConnection,
    getUserModel,
    updateUser,
    getUsers
};