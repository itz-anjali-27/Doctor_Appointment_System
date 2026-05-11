import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailability = async(req,res)=>{
    try{
        const {docId} =req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availability'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList = async (req,res) =>{
    try{
        const doctors =await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    }catch(error){
         console.log(error)
        res.json({success:false,message:error.message})
    }
}


//Api for doctor login
const loginDoctor = async (req,res) =>{
    try{

        const {email,password} =req.body
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid credentials"})

        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            

            res.json({success:true,token})

        }else{
            res.json({success:false,message:"Invalid credentials"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//APi  to get doctor appointments for doctor panel
const appointmentsDoctor = async (req,res) =>{
    try{
        const docId = req.userId
        const appointments = await appointmentModel.find({docId})
        console.log("Appointments for doctor:", appointments);
        res.json({success:true,appointments})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//API to mark appointment complete or cancel by doctor

const appointmentComplete = async(req,res)=>{
    try{
        const docId = req.userId;


       const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString() === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            res.json({success:true,message:"Appointment marked as completed"})
        }else{
            res.json({success:false,message:"Appointment not found or unauthorized"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//API to cancel appointment by doctor
const appointmentCancel = async(req,res)=>{
    try{
        const docId = req.userId;

       const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString() === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            res.json({success:true,message:"Appointment cancelled"})
        }else{
            res.json({success:false,message:"Appointment not found or unauthorized"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//API to get dashboard data for doctor panel
const doctorDashboard = async(req,res) =>{
    try{
        const docId = req.userId
        const appointments = await appointmentModel.find({docId})
        let earnings = 0
        appointments.map((item)=>{
            if(item.isCompleted){
                earnings += item.amount
            }
        })
        let patients = []
        appointments.map((item)=>{
            if(patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })
        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}


//API  to get doctor profile for Doctor panel
const doctorProfile = async(req,res) =>{
    try{
        const docId= req.userId
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({success:true,profile:profileData})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//API to update doctor profile for doctor panel
const doctorProfileUpdate = async(req,res) =>{
    try{
        const {docId,fees,address,available} = req.userId
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:"Profile updated successfully"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }       
}
export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor,
    appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,doctorProfileUpdate}