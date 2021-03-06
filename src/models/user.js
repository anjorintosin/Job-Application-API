const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Experience = require('./userExperience')


const userSchema = new mongoose.Schema({
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
    profession:{
       type: String,
       required: true
    },
    resume:{
     type: String,
     required: false
    },
    cloudinary_id:{
        type: String,
        required: false
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
    
},{
    timestamps: true
})

userSchema.virtual('experience', {
    ref: 'Experience',
    localField: '_id',
    foreignField: 'client'
})

userSchema.methods.toJSON= function(){
    const user = this
    const userObject = user.toObject() 

    delete userObject.password
    delete userObject.__v
    delete userObject.tokens
    delete userObject.resume
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next){
    const employer = this
    await Experience.deleteMany({company: employer._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User