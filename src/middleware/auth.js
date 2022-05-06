const jwt = require("jsonwebtoken");
const Employer = require("../models/employer");


module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employer = await Employer.findOne({ _id: decoded._id, 'tokens.token': token })
        
        
      if(!employer){
          throw new Error()
      }
        
       req.employer = employer
       req.token = token
       
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
   
};