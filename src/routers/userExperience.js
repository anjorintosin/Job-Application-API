const express = require('express')
const Experience = require('../models/userExperience')
const router  = new express.Router()
const auth = require('../middleware/userAuth')


router.get('/', (req, res) =>{
    res.send('hello world')
})

router.post('/users/experience', auth, async (req, res) =>{
    const experience = new Experience(
      {
        ...req.body,
        client: req.user._id
      }
        )
    try {
        await experience.save()
        res.status(201).send(experience)
    } catch (error) {
        res.status(500).send(error) 
    }
})


router.get('/users/experience', async (req, res) =>{
     try {
         const experience = await Experience.find({})
         res.send(experince)
     } catch (error) {
        res.status(500).send() 
     }
})

router.get('/users/experience/me',auth, async (req, res) =>{
    try {
        const jobs = await Job.find({ client: req.user._id})
        res.send(jobs)
    } catch (error) {
       res.status(500).send() 
    }
})

router.patch('/users/experience/:id', auth, async(req, res) =>{

    const _id = req.params.id
    try {
        const experience1 = await Experience.findById({_id, client: req.user._id})
        const experience = await Experience.findByIdAndUpdate({_id, client: req.user._id}, {experience: req.body}, {new: true})
        if(experience1 == req.body){
            return res.status(400).send({
                error: 'Invalid Update'
            })
        }
        
        await experience.save()
        res.status(200).send(experience)
    } catch (error) {
       res.status(500).send()
    }

})

router.get('/users/experience/:id', auth, async(req, res) =>{
    const _id = req.params.id

    try {
        const experience = await Experience.findById({id, client: req.user._id})
        if(!experience){
            return res.status(404).send('no job with that id')
        }
        res.status(200).send(experience)
    } catch (error) {
        res.status(500).send()
    }
})




module.exports = router