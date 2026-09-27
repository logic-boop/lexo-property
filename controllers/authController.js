const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
};

module.exports = { login };