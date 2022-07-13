const User = require("../model/userModel");
const bcrypt = require("bcrypt");

// ----ROUTE-1 FOR USER REGISTRATION-----

module.exports.register = async (req, res, next) => {

    try{
        const {name, email, password} = req.body;
        // finding whether the name exists or not
        const usernameCheck = await User.findOne({name}); 
        if(usernameCheck){
            return res.json({msg:"User name already exists", status: false});
        }

        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already exists", status: false});
        }
        // if everything is correct thn we will encrypt the password with salt value
        const hashedPassword = await bcrypt.hash(password,10 );

        //after encrypttion we will create the user in the db
        const user = await User.create({
            email,
            name,
            password: hashedPassword,
        });
        //const user will have the instance of the user.i.e all the info of the use
        delete user.password; // removing the password from the response.
        return res.json({status: true, user})

    }
    catch(err){
        console.log({mgs:"Internal Sever eroor", err});
    }   
}

// ----ROUTE-2 FOR USER REGISTRATION-----
module.exports.login = async (req, res, next) => {

    try{
        const {name, password} = req.body;
        // finding whether the name in db 
        const findUser = await User.findOne({name}); 
        if(!findUser){
            return res.json({msg:"User name not exists", status: false});
        }
        // conmparing the entered password with the user password
        const isPasswordValid = await bcrypt.compare(password, findUser.password)
       
        if(!isPasswordValid){
            return res.json({msg:"Incorrect password", status: false});
        }
        delete findUser.password;
        return res.json({status: true, findUser});

    }
    catch(err){
        console.log({mgs:"Internal Sever eroor", err});
    }   
}

// ----ROUTE-3 FOR SETTING THE USER AVATAR-----
module.exports.setAvatar = async (req, res, next)=>{
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        console.log(avatarImage.avatarImage);
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true, 
            avatarImage: avatarImage.avatarImage,
        })
        
        return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    } catch (error) {
        console.log({mgs:"Internal Sever eroor", error});
        
    }
}

// ----ROUTE-4 FOR GETTING THE USER -----
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id:{$ne: req.params.id}}). select([    //$ne means not selecting the id which is in params 
            "email",
            "name",
            "_id",
            "avatarImage",
        ])
        return res.json(users)
    } catch (error) {
        console.log({mgs:"Internal Sever eroor", err});
        
    }
}