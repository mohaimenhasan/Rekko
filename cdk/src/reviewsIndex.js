require('./database');
const Response = require('./util/response');
const mongoose = require('mongoose');
const reviewModel = require('./models/review.model');
const errorTypes = require('./consts/errorTypes');
const responseObj = new Response();


async function getAllReviews() {
    return await reviewModel.find({}).sort({ReviwedAt: -1})
    .then(results => {
        return results;
    })
    .catch(error => {
        console.error(`Failed to fetch all reviews with error: ${error}`);
    })
}

async function getReview (productId) {
    const productIdObject = mongoose.Types.ObjectId(productId);
    return await reviewModel.find({"Product._id": productIdObject})
    .then(results => {
        return results;
    })
}

async function searchThroughEntireReviews (searchText) {
    return await reviewModel.find(
        {$or: 
            [
                {
                    'Product.ProductBrand': {
                        "$regex": searchText, 
                        "$options": "i"
                    }
                }, 
                {
                    'Product.ProductName': {
                        "$regex": searchText, 
                        "$options": "i"
                    }
                }, 
                {
                    'User.UserName': {
                            "$regex": searchText, 
                            "$options": "i"
                    }
                }, 
                {
                    ReviewText: { 
                        "$regex": searchText, 
                        "$options": "i"
                    }
                }
            ]
        })
    .then(results => {
        return results;
    });
}


exports.createNewReview = async (userModel, productModel, lengthOfUse, imageName, reviewText) => {
    let newUserReview = new reviewModel({
        User: userModel,
        Product: productModel,
        LengthOfUse: lengthOfUse,
        ImageName: imageName,
        ReviewText: reviewText
    });
    await newUserReview.save();
    return newUserReview;
}

exports.getAllReviews = async (event) => {
    var responseVal = undefined;
    try {
        const mongoRequest = await getAllReviews();
        responseVal = responseObj.constructResponseObject(`Successfully fetched all reviews`, event.headers, mongoRequest);
    } catch (error) {
        responseVal = responseObj.constructResponseObject(error.message, error['statusCode'], error, error.name)
    } finally {
        return responseVal;
    }
}

exports.getReview = async (event) => {
    var responseVal = undefined;
    const productID = event.queryStringParameters.productId;

    try {
        if (!productID || productID === null || productID === undefined) {
            responseVal = responseObj.constructResponseObject(`Fetching review requires param productId`, event.headers, `Fetching review requires param productId`, errorTypes.default.badQuery)
        }
        else{
            const mongoRequest = await getReview(productID);
            responseVal = responseObj.constructResponseObject(`Successfully fetched review`, event.headers, mongoRequest);
        }
    } catch (error) {
        console.error(`Error is: ${error}`);
        responseVal = responseObj.constructResponseObject(error.message, error['statusCode'], error, error.name)
    } finally {
        return responseVal;
    }
}


exports.searchThroughEntireReview = async (event) => {
    var responseVal = undefined;
    const reviewRegex = event.queryStringParameters.reviewRegex;
    try {
        if (!reviewRegex || reviewRegex === null || reviewRegex === undefined) {
            responseVal = responseObj.constructResponseObject(`Fetching review by text requires param reviewRegex`, event.headers, `Fetching review by text requires param reviewRegex`, errorTypes.default.badQuery)
        }
        else{
            const mongoRequest = await searchThroughEntireReviews(reviewRegex);
            responseVal = responseObj.constructResponseObject(`Successfully fetched review`, event.headers, mongoRequest);
        }
    } catch (error) {
        console.error(`Error is: ${error}`);
        responseVal = responseObj.constructResponseObject(error.message, error['statusCode'], error, error.name)
    } finally {
        return responseVal;
    }
}