const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();

const clarifaiKey = `Key ${process.env.CLARIFAI_AUTH_KEY}`
const modelID = `${process.env.CLARIFAI_MODEL_ID}`
const versionID = `${process.env.CLARIFAI_VERSION_ID}`

metadata.set("authorization", clarifaiKey);

const handleAPICall = (req, res) => {
  const inputURL = req.body.imgURL

  stub.PostModelOutputs({
    model_id: modelID, version_id: versionID,  // This is optional. Defaults to the latest model version.
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