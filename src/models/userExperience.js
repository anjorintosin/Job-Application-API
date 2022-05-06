const mongoose = require('mongoose')


const experienceSchema = new mongoose.Schema({
    experience:[{
        company:{
            type: String,
            required: false
        },
        postion:{
             type: String,
             required: true
        },
        employmentLength:{
            type: String,
            required:true
        }
    }],
    client:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})




const Experience = mongoose.model('Experience', experienceSchema)

module.exports = Experience