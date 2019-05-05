const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    console.log(event);
    callback(null, "Success");
}