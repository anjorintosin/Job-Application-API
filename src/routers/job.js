const express = require('express')
const Job = require('../models/job')
const router  = new express.Router()
const auth = require('../middleware/auth')


router.get('/', (req, res) =>{
    res.send('hello world')
})

router.post('/jobs', auth, async (req, res) =>{
    const job = new Job(
      {
        ...req.body,
        company: req.employer._id
      }
        )
    try {
        await job.save()
        res.status(201).send(job)
    } catch (error) {
        res.status(500).send(error) 
    }
})


router.get('/jobs/me',auth, async (req, res) =>{
    try {
        const jobs = await Job.find({ company: req.employer._id})
        res.send(jobs)
    } catch (error) {
       res.status(500).send() 
    }
})

router.patch('/jobs/:id', auth, async(req, res) =>{

    const _id = req.params.id
    try {
        const job1 = await Job.findById({_id, company: req.employer._id})
        const job = await Job.findByIdAndUpdate({_id, company: req.employer._id}, {postion: req.body.postion}, {new: true})
        if(job1.postion == req.body.postion ){
            return res.status(400).send({
                error: 'Invalid Update'
            })
        }
        
        await job.save()
        res.status(200).send(job)
    } catch (error) {
       res.status(500).send()
    }

})

router.get('/jobs/:id', auth, async(req, res) =>{
    const _id = req.params.id

    try {
        const job = await Job.findById({id, owner: req.user._id})
        if(!job){
            return res.status(404).send('no job with that id')
        }
        res.status(200).send(job)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/jobs/delete', auth, async (req, res) =>{
    try {
        const job = await Job.findOneAndDelete({position: req.body.position})
        if(!job){
            return res.status(404).send()
        }
        res.status(200).send(job)
    } catch (error) {
      res.status(500).send()  
    }
    
    
})



module.exports = router