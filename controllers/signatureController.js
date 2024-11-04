const SignatureModel = require("../models/SignatureModel");

module.exports.createSignature = async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id; // assurer que l'utilisateur est authentifié

  try {
    const signature = await SignatureModel.create({ userId, content });
    res.status(200).json(signature);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les signatures de l'utiisateur
module.exports.getSignature = async (req, res) => {
  const userId = req.user._id;

  try {
    const signature = await SignatureModel.find({ userId });
    res.status(200).json(signature);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//mettre a jour une signature
module.exports.updateSignature = async (req, res) => {
  const { signatureId } = req.params;
  const { content } = req.body;

  try {
    const signature = await SignatureModel.findByIdAndUpdate(
      signatureId,
      {
        content,
        updateAt: Date.now(),
      },
      { new: true }
    );

    if (!signature) {
      return res.status(404).json({ message: "signature not found" });
    }

    res.status(200).json(signature);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// supprimer un signature
module.exports.deleteSignature = async (req, res) => {
  const { signatureid } = req.params;

  try {
    const signature = await SignatureModel.findOneAndDelete(signatureid);

    if (!signature) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: "signature deleted successfull" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
