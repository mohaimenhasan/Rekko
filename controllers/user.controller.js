const Response = require('../util/response');
const userModel = require('../models/user.model');
const userInfoModel = require('../models/userInfo.model');
const errorTypes = require('../consts/errorTypes');
const responseObj = new Response();

async function updateUserLogin(userID) {
    let newUserLogin  = new userInfoModel({
        UserId: userID,
        LoginStatus: true // might need to rethink this method by passing it in the param of the method
    });
    await newUserLogin.save();
    return newUserLogin;
}

async function getAllUsers() {
    return await userModel.find({})
    .then(results => {
        return results;
    })
    .catch(error => {
        console.error(`Failed to fetch all users with error: ${error}`)
        throw (error);
    })
}

exports.checkIfUserExists = async (userLogin) => {
    return await userModel.findOne({UserLogin: userLogin})
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error(`Failed to check if userLogin exists with error: ${error}`);
        throw(error);
    });
}

async function addNewUser(userLogin) {
    let newUser = new userModel({
        UserLogin: userLogin
    });
    await newUser.save();
    return newUser;
}

exports.getAllUsers = async (req, res, next) => {
    var responseVal = undefined;
    try{
        const mongoRequest = await getAllUsers();
        responseVal = responseObj.constructResponseObject(`Successfully fetched all users`, req.headers, mongoRequest);
    }
    catch (error){
        responseVal = responseObj.constructResponseObject(error.message, error['statusCode'], null, error.name)
    }
    finally{
        res.status(responseVal.statusCode).send(responseVal);
    }
}

exports.createNewUser = async (req, res, next) => {
    const userLogin = req.body.userLogin;
    var responseVal = undefined;
    try{
        // response validation
        if (!userLogin || userLogin === null || userLogin === undefined){
            responseVal = responseObj.constructResponseObject(`Request body requires param userLogin`, req.headers, null, errorTypes.default.badQuery)
        }
        else{
            // check if the user exists first
            let userCheck = await this.checkIfUserExists(userLogin);
            if (userCheck){
                // create a login value
                await updateUserLogin(userCheck?._id);
                responseVal = responseObj.constructResponseObject(`User with login ${userLogin} already exists`, req.headers, 
                {
                    "UserLogin": userLogin,
                    "_id": userCheck?._id,
                    "existingUser": true
                });
            }
            else{
                const mongoRequest = await addNewUser(userLogin);
                // create a login value
                await updateUserLogin(mongoRequest?._id);
                responseVal = responseObj.constructResponseObject(`Successfully created a user with login ${userLogin}`, req.headers, mongoRequest);
            }
        }
        
    }
    catch (error){
        responseVal = responseObj.constructResponseObject(error.message || 'Internal server error', error.headers, null, error.name || errorTypes.default.serverError)
    }
    finally{
        res.status(responseVal.statusCode).send(responseVal);
    }
}