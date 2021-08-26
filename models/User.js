const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/*
const reportSchema = new mongoose.Schema({
    availability : { type: Number},
    outages : { type: Number},
    downtime : { type: Number},
    uptime : { type: Number},
    responeTime : { type: Number},
    history : { type: Date, default: Date.now  },
    count : { type: Number},
    totalTime : { type: Number}
});
*/
const checkSchema = new mongoose.Schema({
            name : { type: String, required: true},
            url : { type: String, required: true},
            protocol : { type: String, required: true},
            path : { type: String},
            port : { type: Number},
            webhook : { type: String},
            timeout : { type: Number},
            interval : { type: Number},
            threshold : { type: Number},
            auth : { type: String},
            httpHeaders : { type: String},
            assert : { type: Number, default: 200},
            tags : { type: String},
            ignoreSSL : { type: Boolean, default: true},
            
           // reports: [reportSchema]
});

const userSchema = new mongoose.Schema({
     email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true
     },
     password: {
        type: String,
        required: true,
        minLength: 6
     },
     checks : [checkSchema]
 });

 userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

 userSchema.statics.login = async function (email, password){
     const user = await this.findOne({email});
     if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password!');
     }
     throw Error('Invalid Email!');
 }

 const User = mongoose.model('user', userSchema);
 

 module.exports = User;