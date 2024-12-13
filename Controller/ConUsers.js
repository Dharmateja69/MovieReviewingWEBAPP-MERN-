const User = require('../Models/Users');
const Emailtoken = require("../Models/EmailVerificationToken");
//12:12:27
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { isValidObjectId } = require('mongoose');
const EmailVerificationToken = require('../Models/EmailVerificationToken');
const { generateotp, generateEmailotp } = require('../utils/mail');
const { senderror, generateRandomByte } = require('../utils/helper');
const Passwordresttoken = require('../Models/Passwordresttoken');

exports.createcon = async (req, res) => {
    const { name, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser)//prevents from duplicates we can use this metode for any elements ;  same process
    {
        return senderror(res, "This emial is already exists !!");
    }
    const newUser = new User({ name, email, password });//indirectly creating a new object and saving in the database new User() it is similar to a class ;
    await newUser.save();
    //we have to generate 6 digits otp 
    let OTP = generateotp();

    //store it inside the db//at first import the model(emialverificationtoken)
    const EmailVerificationToken1 = new Emailtoken({
        owner: newUser._id,
        token: OTP
    });
    await EmailVerificationToken1.save();//storing in database

    //return we have to send it to the user email 
    var transport = generateEmailotp();;
    transport.sendMail({
        from: 'sidhu@gmail.com',
        to: newUser.email,
        subject: " Otp verification",
        html: `please verify this ${OTP}!`
    })

    res.status(201).json({ message: 'please verify your email. otp has been sent to your email!!' });
};
//7 th concept in email otp verification
exports.VerifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;
    //1st condtion
    if (!isValidObjectId(userId)) {
        return senderror(res, "Invalid User!!");
    };
    //2nd condtion
    const user = await User.findById(userId);
    if (!user) {
        return senderror(res, "user not found!!", 404);
    }
    //3rd
    if (user.isVerified) {
        return senderror(res, "user is already verified!!");
    }
    //4th
    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token) {
        return senderror(res, "token not found!!");
    }
    const isMatched = await token.compareToken(OTP);  // Use the correct method name
    if (!isMatched) return senderror(res, 'Please submit a valid otp!');

    user.isVerified = true;
    await user.save();
    await EmailVerificationToken.findByIdAndDelete(token._id)

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "b0a9a6b4f8ad87",
            pass: "55c60297b2a346"
        }
    });
    transport.sendMail({
        from: 'sidhu@gmail.com',
        to: user.email,
        subject: "Welcome user",
        html: `Welcome to this app and thanks for comming!`
    })




    res.json({ message: "your email is verified." })//will go to frontend
};

exports.resendEmailVerficationToken = async (req, res) => {

    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user)
        return senderror(res, "user not found!");

    if (user.isVerified)
        return senderror(res, "This email is already verfied!");
    const alreadyhastoken = await EmailVerificationToken.findOne({
        owner: userId
    });

    if (alreadyhastoken)
        return senderror(res, "Only after one hour you can request for another token! ");

    //we have to generate 6 digits otp 
    let OTP = "";
    for (let i = 0; i <= 5; i++) {
        const randomvalue = Math.round(Math.random() * 9)
        OTP += randomvalue;
    }
    //store it inside the db//at first import the model(emialverificationtoken)
    const EmailVerificationToken1 = new Emailtoken({
        owner: user._id,
        token: OTP
    });
    await EmailVerificationToken1.save();//storing in database

    //return we have to send it to the user email 
    var transport = generateEmailotp();
    transport.sendMail({
        from: 'sidhu@gmail.com',
        to: user.email,
        subject: " Otp verification",
        html: `please verify this ${OTP}!`
    });

    res.json({ message: "new otp sent to your email!" });

};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return senderror(res, 'email is missing!!');
    const user = await User.findOne({ email });
    if (!user) return senderror(res, 'user not found!!', 404);

    const alreadyhastoken = await Passwordresttoken.findOne({ owner: user._id })

    if (alreadyhastoken) return senderror(res, 'only after one hour you can request for another token!!');
    //11-12-2024
    const token = await generateRandomByte();
    const newPasswordResetToken = await Passwordresttoken({ owner: user._id, token });
    await newPasswordResetToken.save();

    const resetPasswordUrl = `https://localhost:3000/reset-password?token=${token}&id=${user._id}`

    const transport = generateEmailotp();
    transport.sendMail({
        from: 'security@gmail.com',
        to: user.email,
        subject: " Reset Password Link",
        html: `
    <p>Click here to reset password</p>
    <a href="${resetPasswordUrl}">Change password</a>`
    });
    res.json({ message: "Link sent to your email" });
};
//11-12-2024(7:13)
exports.sendResetPasswordTokenStatus = (req, res) => {

    res.json({ valid: true })
};

exports.resetPassword = async (req, res) => {

    const { newPassword, userId } = req.body;

    const user = await User.findById(userId);
    const matched = await user.comparePassword(newPassword)
    if (matched) return senderror(res, 'The new password must be different from the old one !');

    User.password = newPassword;

    await user.save();

    await Passwordresttoken.findByIdAndDelete(req.resetToken._id)
    const transport = generateEmailotp();
    transport.sendMail({
        from: 'security@gmail.com',
        to: user.email,
        subject: "Password Reset Successfully",
        html: `
    <p>Password Reset Successfull</p>
    <p>Now you can use new password:${newPassword}.</p>`
    });

    res.json({ message: 'Password Reset Successfull, now you can use new password ' })

};
//12-12-24
exports.signin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate inputs
      if (!email || !password) {
        return senderror(res, 'Email and password are required!');
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return senderror(res, 'Email/Password mismatch!');
  
      // Compare password
      const matched = await user.comparePassword(password); // Ensure comparePassword is defined in the User model
      if (!matched) return senderror(res, 'Email/Password mismatch!');
  
      // Generate JWT token
      const jwtToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'shdjsbvxhbvjhcvjb23', // Use an environment variable for the secret key
        { expiresIn: '1h' } // Optional: Add token expiration
      );
  
      // Send response
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: jwtToken,
        },
      });
    } catch (err) {
      console.error('Signin Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };