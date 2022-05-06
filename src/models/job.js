const mongoose = require('mongoose')
//const validator = require('validator')

const JobSchema = new mongoose.Schema({

 companyName:{
     type: String,
     required: true,
     trim: true
 },
 position:{
     type: String,
     required: true,
     trim: true
 },
 experience:{
      type: String,
      required: false,
      trim:true
 },
 company:{
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: 'Employer'
 }
    
},{
    timestamps: true
})

const Job = mongoose.model('Jobs', JobSchema)

module.exports = Job