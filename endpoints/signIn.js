const signIn = (req, res, dbConnection) => {

  dbConnection.find({email: req.body.email, password: req.body.password}, (err, result) => {
    try {
      if (result.length) return res.status(200).json(result[0]);
      res.status(404).json({msg: "No user found with given credentials."})
    } catch (err) {
      res.status(500).json({msg: "Something went wrong."})
    }
  })
}

module.exports = signIn;
