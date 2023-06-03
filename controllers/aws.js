import fs, { readFileSync } from 'fs'
import { fileURLToPath } from 'url';
import path, {dirname} from 'path'
import AWS from "aws-sdk"
export const uploadFile = (user,filename) => {

    const s3 = new AWS.S3({
        accessKeyId: 'AKIA3PB635A3BYABABOA',
        secretAccessKey: "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"
    })

    const file = readFileSync(filename)

    const params = {
        Bucket: "timeline-cloud",
        Key: `${user}/email/${filename}`,
        Body: file,
        ContentType: "text/html"
    }

    s3.upload(params,(err,data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("File uploaded successfully")
        }
    })
    fs.unlink(filename,function(err){
        if(err){
            console.log("Error deleting the file")
        }
    })
}

export const getFile = async(user, filename) => {
    const s3 = new AWS.S3({
        accessKeyId: 'AKIA3PB635A3BYABABOA',
        secretAccessKey: "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" 
    })

     const params = {
        Bucket: "timeline-cloud",
        Key: '62644092c77058c2406060d8/email/6374a0a7fd77926108222f10.hbs',
       
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    let readStream = s3.getObject(params).createReadStream()
    let writeStream = fs.createWriteStream(path.join(__dirname, '62644092c77058c2406060d8/email/6374a0a7fd77926108222f10.hbs'))
    readStream.pipe(writeStream)
    console.log("everything is fine")
}

export const deleteFile = (user,filename) => {

    const s3 = new AWS.S3({
        accessKeyId: 'AKIA3PB635A3BYABABOA',
        secretAccessKey: "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" 
    })

     const params = {
        Bucket: "timeline-cloud",
        Key: `${user}/email/${filename}`,
       
    }


    s3.deleteObject(params,(err,data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("File deleted successfully")
        }
    })
    
}