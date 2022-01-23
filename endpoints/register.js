const register = (req, res, dbConnection) => {

  dbConnection.create(req.body, (err, createdInstance) => {
    try {
      res.status(200).json(createdInstance)
    } catch (err) {
      res.status(500).json({msg: "Something went wrong."})
    }
  })
}

module.exports = register;
