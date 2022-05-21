const crypto = require('crypto');
const hashService = require('./hash-service');

// SOME ERROR OCCUR IN THIS SO I CREATE DIRECT SID AND AUTH TOKEN TEMPORARY 
// const smsSid = process.env.SMS_SID
// const smsAuthToken = process.env.SMS_AUTH_TOKEN

// THIS IS TEMPORARY SID AND AUTH TOKEN FOR TWILLO 
// LATER PUT THIS IN THE ENV FILE
const SMS_SID="AC1c652593fd64aff7c6c524986d29b19f"
const SMS_AUTH_TOKEN="5ae4d60f793c0dd35538d7d70e75b403"

const twilio = require('twilio')(SMS_SID,SMS_AUTH_TOKEN,{
    lazyLoading: true,
});

// const smsSid = process.env.SMS_SID;
// const smsAuthToken = process.env.SMS_AUTH_TOKEN;
// const twilio = require('twilio')(smsSid, smsAuthToken, {
//     lazyLoading: true,
// });

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    async sendBySms(phone, otp) {
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your codershouse OTP is ${otp}`,
        });
    }

    verifyOtp(hashedOtp, data) {
        let computedHash = hashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}

module.exports = new OtpService();
