import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";

export const userRegister = async (req, res) => {
  const { username , email , password} = req.body

  try {
    const isUserAlredyExist = userModel.findOne({
        $or : [{username }, {email}]
    })

    if(isUserAlredyExist){
        res.status(400).json({
            message : "userAlredy exist"
        })
    }

    const user = userModel.create({
        username , 
        email,
        password ,

    })



  } catch (error) {
    
  }





};

