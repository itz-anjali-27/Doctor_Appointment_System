import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers['dtoken']; // ✅ FIX

    if (!dtoken) {
      return res.json({
        success: false,
        message: 'Not Authorized, Login Again..'
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    console.log("Decoded Token:", token_decode);

    req.userId = token_decode.id;

    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;