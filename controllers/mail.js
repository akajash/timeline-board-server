import nodemailer from 'nodemailer'

import 'dotenv/config'

const sendEmail = (options) => {



    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure:false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
          }
    })


    const mailOptions = {
        from : process.env.EMAIL_USERNAME,
        to: options.to,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(mailOptions, function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log(info)
        }
    })
}

export default sendEmail