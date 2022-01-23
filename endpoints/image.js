const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key b22ab89b1bab46168589c598aa00d08d");

const handleAPICall = (req, res) => {
  const inputURL = req.body.imgURL

  stub.PostModelOutputs({
    model_id: "f76196b43bbd45c99b4f3cd8e8b40a8a", version_id: "45fb9a671625463fa646c3523a3087d5",  // This is optional. Defaults to the latest model version.
    inputs: [{data: {image: {url: inputURL}}}]
  }, metadata, (err, response) => {
    if (err) {
      return res.status(500).json({msg: "Something went wrong."})
    }

    if (response.status.code !== 10000) {
      return res.status(500).json({msg: "Something went wrong."})
    }

    res.status(200).json(response.outputs[0].data.regions);
    // [0].region_info.bounding_box
  });
}

const increaseEntries = (req, res, dbConnection) => {
  dbConnection.findOneAndUpdate({id: req.body.id}, {$inc: {entries: 1}}, ((error, result) => {
    try {
      res.status(200).json(Object.assign(result, {entries: result.entries + 1}));
    } catch (error) {
      res.status(500).json({msg: "Something went wrong."})
    }
  }))
}

module.exports = {
  handleAPICall, increaseEntries
}