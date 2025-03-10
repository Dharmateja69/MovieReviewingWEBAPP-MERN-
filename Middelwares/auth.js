const jwt = require("jsonwebtoken");

const User = require("../Models/Users");
const { senderror } = require("../utils/helper")


exports.isAuth = async (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) return senderror(res, "Invalid token!", 401);
    const jwtToken = token.split("Bearer ")[1];
    if (!jwtToken) return senderror(res, "Invalid token!", 401);
    // console.log(jwtToken);
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const { userId } = decode

    const user = await User.findById(userId)
    console.log(JSON.stringify(user))
    if (!user) return senderror(res, "Invalid token user not found!", 404)
    // res.json({ user: { id: user._id, name: user.name, email: user.email } })
    req.user = user
    next()

}