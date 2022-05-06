const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Job = require('./job')


const employerSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:true
    },
    email:{
        type: String,
        unique:  true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('password cannot contain password')
            }
        },
        required: true 
    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot be password')
            }
        }
    },
    company:{
        type: String,
        required: true,  
    },
    companyURL:{
       type: String,
       required: true,
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]

},{
    timestamps: true
})

employerSchema.virtual('job',{
    ref: 'Jobs',
    localField: '_id',
    foreignField: 'company'
})



employerSchema.methods.toJSON = function(){
    const employer = this
    const userObject = employer.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
 
    
    return userObject
}

employerSchema.methods.generateAuthToken = async function () {
    const employer = this
    const token = jwt.sign({ _id: employer._id.toString(), name: employer.name}, process.env.JWT_SECRET)
    
    employer.tokens = employer.tokens.concat({ token })
    await employer.save()
    return token;
}


employerSchema.pre('remove', async function(next){
    const employer = this
    await Job.deleteMany({company: employer._id})
    next()
})

const Employer = mongoose.model('Employer', employerSchema)

module.exports = Employer