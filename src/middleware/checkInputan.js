export default async function checkInputan(req, res, next) {
  const { email, username, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "invalid fields not value" });
  }

  // created regex
  const regextText = /%-`!#-=/;

  if (
    regextText.test(email) ||
    regextText.test(username) ||
    regextText.test(password)
  ) {
    return res
      .status(403)
      .json({ status: false, message: "invalid character detection" });
  }

  next();
}
