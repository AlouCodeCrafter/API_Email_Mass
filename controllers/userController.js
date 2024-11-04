const userModel = require("../models/userModel");
const objectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.userInfo = async (req, res) => {
  if (!objectID.isValid(req.params.id))
    return res.status(400).send("ID unknown: " + req.params.id);

  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error retrieving user: " + err.message);
  }
};

module.exports.userUpdate = async (req, res) => {
  if (!objectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.userDelete = async (req, res) => {
  if (!objectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User deleted successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
