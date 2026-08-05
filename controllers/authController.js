const login = (req, res) => {

    const { email, password } = req.body;

    console.log("Email entered:", email);
    console.log("Password entered:", password);

    console.log("ENV Email:", process.env.ADMIN_EMAIL);
    console.log("ENV Password:", process.env.ADMIN_PASSWORD);

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.status(200).json({
            success: true,
            message: "Login successful"
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });

};

module.exports = { login };