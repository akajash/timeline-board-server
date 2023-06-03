const pdf = require('html-pdf')

const generateInvoice = async(req,res) => {
    pdf.create(template(req.data),{}).toFile('invoice.pdf',(err) => {
        if(err){
            return Promise.reject();
        }

        return Promise.resolve();
    })
}

const fetchInvoice = async(req,res) => {
    res.sendFile
}

