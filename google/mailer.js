import nodemailer from 'nodemailer'
import google from 'googleapis'


const CLIENT_ID = '21078231626-cla617f2hm31p6k1ta2k1raqmoq7cr6r.apps.googleusercontent.com'
const CLIENT_SECRET = 'y5I6C_0qDyo8UrNBKLwg_5gd'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04HmtCBV7ybUsCgYIARAAGAQSNwF-L9IrqZOHtTQVO8P_y22iodH1LG5IN7T5JrZ-utSqd9wpBT0cxgaJqHWo0jT-QtkUPyZH3dA'

const oAuth2Client = new google.Auth.OAuth2Client(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendMail(){
    try{
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'karthickjash10@gmail.com',
                clientId: CLIENT_ID,
                refresh_token: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from : 'TIMELINE CREATIVES <karthickjash10@gmail.com>',
            to: 'karthickash10@gmail.com',
            subject: 'Hello, Welcome Aboard',
            text: 'Hey whatsup howz it going',
            html: '<h1>Hey whatsup howz it going</h1>'
        }

        const result = await transport.sendMail(mailOptions)
        return result

    }catch(error){
        return error
    }
}


sendMail().then(result => console.log('Email sent',result))
.then((error) => console.log(error.message))