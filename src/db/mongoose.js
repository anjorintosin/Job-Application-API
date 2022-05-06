const mongoose = require('mongoose')

const mongodbURL = 'mongodb://127.0.0.1:27017/job-application-api'

mongoose.connect(mongodbURL, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   useUnifiedTopology: true

})