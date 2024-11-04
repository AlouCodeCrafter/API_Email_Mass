module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };
  if (err.message.includes("pseudo"))
    errors.pseudo = "pseudo incorrect ou deja pris ";
  if (err.message.includes("email")) errors.email = " Email incorect";

  if (err.message.includes("pseudo"))
    errors.password = "le mot de passe doit faire 6 carracter minimum ";

  if (err.message === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "ce pseudo est deja pris ";
  if (err.message === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "cet email est deja pris ";
  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.message.includes("email")) errors.email = "email inconnu";
  if (err.message.includes("password"))
    errors.password = "le mot de passe ne corespond pas ";
  return errors;
};
