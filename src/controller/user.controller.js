const User = require("../models/user.schema");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const newUser = new User({
      firstName,
      lastName,
      email,
      otp: otp,
      password: hashedPassword,
      phoneNumber,
    });
    await newUser.save();
    return res.status(201).json({ message: "User Signed Up Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyUser = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  try {
    const user = await User.findOne({ otp: otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.otp = null; // Clear the OTP after verification
    await user.save();
    return res.status(200).json({ message: "User Verified Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Doesn't Exist Please Signup" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "User Not Verified" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    return res.status(200).json({ message: "User Logged IN Succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is Required" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User Doesn't Exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    user.otp = otp; // Set the OTP in the user document
    await user.save();
    return res.status(200).json({ message: "OTP Sent Successfully", otp: otp }); // For testing purposes, you can send the OTP back in the response
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  if ( !otp || !newPassword) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  try {
    const user = await User.findOne({ otp: otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null; // Clear the OTP after resetting the password
    await user.save();
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  signup,
  login,
  verifyUser,
  forgetPassword,
  resetPassword,
};
