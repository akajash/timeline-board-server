import nodemailer from 'nodemailer'

import Email from 'email-templates'
import EmailSettings from '../models/emailSettings.js'
import EmailTemplate from '../models/emailTemplate.js'
import Project from '../models/project.js'
import Workforce from '../models/Workforce.js'
import axios from 'axios'
import hbs from 'nodemailer-express-handlebars'
import { getFile } from './aws.js'


export const sendPayload = async(userId,mailLoad) => {
    try{
        
        const mailData = await EmailSettings.findOne({user:userId})
        const mail = await EmailTemplate.findOne({_id:mailLoad.template.id})
        if(!mailData) {
            console.log("There is no mail server connected")
        }

        var recMail = "";
        var variables = {}
        if(mailLoad.isClient){
            const projectData = await Project.findOne({_id: mailLoad.project})
            recMail = projectData.email
            variables = {
                "client_name" : projectData.eventName,
                "event_type" : projectData.eventType,
                "location" : projectData.eventLocation,
                "contact" : projectData.primaryContact,
                "start_date" : projectData.dateFrom,
                "end_date" : projectData.dateTo,
                "package_name" : projectData.package,
                "reference" : projectData.reference.title,
                "quoted_amount" : projectData.amountQuoted,
                "amount_paid" : projectData.amountPaid,
                "client_email" : projectData.email,
                "discount" : projectData.discount,
                "discount_type" : projectData.discount_type,
                "client_notes" : projectData.additionalNotes,
                "services" : projectData.services
            }
        }
        else{
            const workforceData = await Workforce.findOne({_id: mailLoad.workforce.id})
            recMail = workforceData.email
            variables = {
                "workforce_name": workforceData.name,
                "workforce_contact" : workforceData.primaryContact,
                "workforce_joining" : workforceData.dateOfJoining,
                "workforce_payout" : workforceData.payout_type,
                "workforce_amount" : workforceData.payout_amount,
                "workforce_designation" : workforceData.designation,
                "workforce_email" : workforceData.email,
                "workforce_type" : workforceData.work_type
            }
        }

        const data = {
            username : mailData.username,
            word : mailData.password,
            server: mailData.server,
            port: mailData.port,
            isSSL : mailData.ssl,
            isClient: mailLoad.isClient,
            payload: mail.body,
            variables: variables,
            recepient: recMail,
            subject: mail.subject
        }

        axios.post('http://142.93.223.130:5000/mailer', data)
            .catch(error => {
                console.log(error);
            });

        // let fn = '6374a0a7fd77926108222f10'
        // const filename = `${fn}.hbs`
        // getFile(userId,filename)

    }
    catch(error){
        console.log(error.message)
    }
}


// export const mailConverter = (mail) => {
//     var body = mail.body
//     body = body.replace(/%client_name%/gi,'Chennai')
//     body = body.replace(/%client_mail%/gi,'Chennai')
//     body = body.replace(/%company_name%/gi,'Chennai')
//     body = body.replace(/%client_contact%/gi,'Chennai')
//     body = body.replace(/%quoted_amount%/gi,'Chennai')
//     body = body.replace(/%event_type%/gi,'Chennai')
//     body = body.replace(/%location%/gi,'Chennai')
//     console.log(body)
// }



// export const transpondMail = (data,mail) => {
//     const transporter = nodemailer.createTransport({
//         host: data.server,
//         port : data.port,
//         secure: data.isSsl,
//         auth: {
//             user: data.username,
//             pass: data.password
//         },
//     })


//     var mailOptions = {
//         from: data.username,
//         to: "remixo5403@lidely.com",
//         subject: "Testing the mail server",
//         template: "6374a0a7fd77926108222f10",
//         context: {
//             title: "Timeline"
//         }
//     }


//         transporter.sendMail(mailOptions, function(error,info){
//         if(error){
//             console.log(error)
//         }
//         else{
//             console.log("Email sent "+ info.response)
//         }
//     })
// }


export const transpondMail = (data) => {

    console.log("transpondMail")
    const transporter = nodemailer.createTransport({
        port: data.port,
        host: data.server,
        secure: data.isSsl,
        auth: {
            user: data.username,
            pass: data.password
        },
        tls: {
            rejectUnauthorized: false
          }
    })

    var options = {
        viewEngine: {
            extname : '.hbs',
            defaultLayout: false,
            partialsDir: './controllers/templates'
        },
        viewPath: './controllers/templates',
        extName: ".hbs"
    }

    transporter.use('compile', hbs(options))

    var mailOptions = {
        from: data.username,
        to: "remixo5403@lidely.com",
        subject: "Testing the mail server",
        template: "temp",
        context: {
            title: "Timeline"
        },
        attachments: []
    }


    transporter.sendMail(mailOptions, function(error,info){
    if(error){
        console.log(error)
    }
    else{
        console.log("Email sent "+ info.response)
    }
    })


    const email = new Email({
        views: {root: './invoices/',  options: { extension: 'hbs'}},
        message: {
            from: data.username,
    
        },
        send: true,
        preview: false,
        transport: transporter
    })
    

    email.send({
            template: 'temp',
            message: {
                to: 'remixo5403@lidely.com',
                subject: "testing mail",
            },
            locals: {
                name: "Karthick",
                company: "Timeline"
            }
        })
        .then(console.log)
        .catch(console.error)
        return res.send("Email sent")
          
}



    

    



