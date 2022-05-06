const express = require('express')
const router  = new express.Router()
const bcrypt = require('bcryptjs')
const Employer = require('../models/employer')
const auth = require('../middleware/auth')

router.post("/employer/register", async (req, res) => {
  try {
      const employer = new Employer(req.body);
      
      const salt = await bcrypt.genSalt(8);
      employer.password = await bcrypt.hash(employer.password, salt);


      await employer.save();

      res.send({employer});
  } catch (error) {
      res.status(500).send("An error occured");
  }
});

router.post("/employer/login", async (req, res) => {
  try {


      const employer = await Employer.findOne({ email: req.body.email });
      if (!employer) return res.status(400).send("Invalid email or password");

      const validPassword = await bcrypt.compare(
          req.body.password,
          employer.password
      );
      if (!validPassword)
          return res.status(400).send("Invalid email or password");

          const token = await employer.generateAuthToken()
      res.send({employer, token});
  } catch (error) {
      console.log(error);
      res.send("An error occured");
  }
});

  

router.get('/employer/me', auth, async (req, res) =>{
     res.send(req.employer)
})

router.patch('/employer/:id', async(req, res) =>{
  const body = req.body
   const employer = await Employer.findByIdAndUpdate(req.params.id, body, {new: true})
  res.send(employer)
 })

 router.post('/employer/logout', auth , async (req, res) =>{
      try {
        req.employer.tokens = req.employer.tokens.filter((token) =>{
          return token.token !== req.token
        })
        await req.employer.save()

        res.send(req.employer)
      } catch (error) {
        res.status(500).send(error)
      }
 })

 router.delete('/employer/me', auth, async(req, res) =>{
  try {
     await req.employer.remove()
     res.status(200).send(req.employer) 
  } catch (error) {
      res.status(500).send()}
  })


  



module.exports = router