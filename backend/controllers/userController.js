import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
//import Razorpay from 'razorpay'



//API to Register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a avalid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }
        //hashing user password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//API to get user profile data
const getProfile = async (req, res) => {
    try {

        const userId = req.userId;   // ✅ from middleware
        console.log("UserId:", userId);

        const userData = await userModel
            .findById(userId)
            .select('-password');

        res.json({ success: true, userData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//APi to update user profile data
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Missing Details" })
        }

        let parsedAddress = {};

        try {
            parsedAddress = address ? JSON.parse(address) : {};
        } catch (error) {
            return res.json({ success: false, message: "Address must be valid JSON" });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {
                image: imageUrl
            });
        }
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



//API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId; // ✅ get from authUser middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not Authorized" });
        }

        // get doctor data
        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available for appointment" });
        }

        let slots_booked = docData.slots_booked || {};

        // check if slot already booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        // get user data
        const userData = await userModel.findById(userId).select('-password');

        // remove slots_booked from docData before saving appointment
        const docDataCopy = { ...docData._doc };
        delete docDataCopy.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docDataCopy,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now(),
            payment: false, // default false
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//API to get user appointments for frontend my-appoints page
const listAppointments = async (req, res) => {
    try {
        // Use req.userId from the auth middleware, NOT req.body
        const userId = req.userId;
        console.log("UserId:", userId); 

        const appointments = await appointmentModel.find({ userId }).sort({ createdAt: -1 }); 
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.userId; // get from auth middleware, NOT from req.body

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        // Cancel appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Release doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData && doctorData.slots_booked[slotDate]) {
            doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
                (slot) => slot !== slotTime
            );
            await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
        }

        res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


/*const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
//API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try{
    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(!appointmentData || appointmentData.cancelled){

    return res.json({success:false,message:"Appointment Cancelled or not found"})


    //creating options for razorpay payment
    const options = {
        amount: appointmentData.amount * 100,
        currency : process.env.CURRENCY,
        receipt: appointmentId,
    }


    //creation of an order

    const order = await razorpayInstance.order.create(options)

    res.json({success:true,order})

    }
    }catch(error){
         console.log(error);
         res.status(500).json({ success: false, message: error.message });
    }

    

}
*/

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment };