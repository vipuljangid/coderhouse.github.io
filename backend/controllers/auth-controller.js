const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ message: 'Phone field is required!' });
        }

        const otp = await otpService.generateOtp();

        const ttl = 1000 * 60 * 2; // 2 min
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // send OTP
        try {
            // await otpService.sendBySms(phone, otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'message sending failed' });
        }
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;
        if (!otp || !hash || !phone) {
            res.status(400).json({ message: 'All fields are required!' });
        }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400).json({ message: 'OTP expired!' });
        }

        const data = `${phone}.${otp}.${expires}`;
        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            res.status(400).json({ message: 'Invalid OTP' });
        }

        let user;
        try {
            user = await userService.findUser({ phone });
            if (!user) {
                user = await userService.createUser({ phone });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Db error' });
        }

        const { accessToken, refreshToken } = tokenService.generateTokens({
            _id: user._id,
            activated: false,
        });

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }


    async refresh(req,res){
        // GET REFRESH TOKEN FROM COOKIE
        const {refreshToken:refreshTokenFromCookie}=req.cookies;

        // CHECK IF TOKEN IS VALID
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token in token valid' });
        }
        // Check if token is in db

        // CHECK IF TOKEN IS IN DATABASE
        try {
            const token=await tokenService.findRefreshToken(userData._id,refreshTokenFromCookie)
        if(!token){
           return res.stauts(404).json({message:'error in token refresh CHECK IF TOKEN IS IN DATABASE'})
        }
        } catch (error) {
          return  res.status(500).json({message:'Internal server Error'}) 
        }

        // CHECK IF VALID USER
        const user=await userService.findUser({_id:userData._id});
        if(!user){
         return  res.status(401).json({message:'Invalid User 1'});
        }

        // GENERATE NEW TOKEN
        const {refreshToken,accessToken}=tokenService.generateTokens({_id:userData._id})

        // UPDATE REFRESH TOKEN
        try {
            await tokenService.updateRefreshToken(userData._id,refreshToken)
        } catch (error) {
           return res.status(400).json({message:'Error while updating Refresh Token'})
        }
        // PUT IN COOKIE
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        // response
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    } 
    async logout(req,res){
        const {refreshToken}=req.cookies
        //DELETE REFRESH TOKEN
        await tokenService.removeToken(refreshToken)
        //DELETE COOKIE
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        res.json({user:null,auth:false})
    }
}


module.exports = new AuthController();
