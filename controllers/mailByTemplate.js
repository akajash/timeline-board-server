import nodemailer from 'nodemailer'

import Email from 'email-templates'




// const AutoMailer = (options) => {
//     const transporter =  nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'timeline.sass@gmail.com',
//             pass: 'Karthick@10'
//         },
//         tls: {
//             rejectUnauthorized: false
//           }
//     }),
    


// }

// let user = {
//         name: "Karthick",
//         company: "Timeline"
//     }
    


// const loadTemplate = (templateName, contexts) => {
//     const __dirname = path.resolve()
//     const template = new Email(templateName);
//     return Promise.all(contexts.map((context) => {
//         return new Promise((resolve,reject) => {
//             template.render(context, (err,result) => {
//                 if(err) reject(err)
//                 else resolve(result)
//             })
//         })
//     }))
// }

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'timeline.sass@gmail.com',
        pass: 'Karthick@10'
    },
    tls: {
        rejectUnauthorized: false
      }
})

const email = new Email({
    views: {root: './controllers/templates',  options: { extension: 'hbs'}},
    message: {
        from: "timeline.sass@gmail.com",

    },
    send: true,
    preview: false,
    transport: transporter
})


export const AutoMailer = (req,res) => {
    email.send({
        template: 'welcome',
        message: {
            to: 'karthickjash10@gmail.com',
            subject: "testing mail",
        },
        locals: {
            name: "Karthick",
            company: "Signature Frames"
        }
    })
    .then(console.log)
    .catch(console.error)
    return res.send("Email sent")
    

}
    

    



