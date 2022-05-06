const express = require('express')
const Job = require('../models/job')
const User = require('../models/user')
const cloudinary = require('../utils/cloudinary')
const router  = new express.Router()
const auth = require('../middleware/userAuth')
const multer = require('multer')
const path = require('path')


router.post('/users/register', async (req, res) => {
    const user = new User(req.body)

    try {
        
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/jobs', auth, async(req, res) =>{
 try {
    const jobs = await Job.find({})
    res.send(jobs)
 } catch (error) {
     res.status(500).send()
 }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})



router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
       
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Multer config
const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);  
      if (ext !== ".docx" && ext !== ".doc" && ext !== ".pdf" && ext !== ".odt") {
        cb(new Error("File type is not supported"), false);
        return;
      }
      cb(null, true);
    },
})


router.post('/users/me/uploadResume', auth, upload.single('resume'), async(req, res) =>{
  try {
    const result = await cloudinary.uploader.upload(req.file.path)
    await req.user.save()
     res.send({user: req.user, result}) 
  } catch (error) {
      res.status(500).send(error)
  }
})



router.delete('/users/me', auth, async(req, res) =>{
    try {
       await req.user.remove()
       res.status(200).send(req.user) 
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router