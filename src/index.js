const express = require('express')
const app = express()
const userRouter = require('./routers/user')
const jobRouter = require('./routers/job')
const experience = require('./routers/userExperience')
const sharp = require('sharp')
const fileupload = require('express-fileupload')
const employerRouter = require('./routers/employer')
require('./db/mongoose')


//app.use(bodyParser())
app.use(express.json())
app.use(userRouter)
app.use(jobRouter)
app.use(employerRouter)
app.use(experience)
app.use(fileupload({useTempFiles: true}))

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`connected on port ${port}`)
})

// const Job = require('../src/models/job')
// const Employer = require('./models/employer')

// const main = async () =>{
//     // const job = await Job.findById('62732ac9c430690529a7947c')
//     //  await job.populate('company').execPopulate()
//     // console.log(job.company)
//   const employer = await Employer.findById('62732abcc430690529a79476')
//   await employer.populate('job').execPopulate()
//    console.log(employer.job)

// }


// main()