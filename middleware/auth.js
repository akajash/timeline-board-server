import jwt from 'jsonwebtoken'

const auth = async (req,res,next) => {

    try{
        const token = req.headers.authorization?.split(" ")[1];
        const isCustomAuth = token?.length < 500

        let decodedData;

        if(!token) return res.status(403).send("Forbidden")

        if(token && isCustomAuth){
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
            if(!req.userId) return res.status(403).send("Unauthorized")
        }
        else{
            decodedData = jwt.decode(token)
            req.userId = decodedData?.sub;

        }

        
        next();

    }
    catch(error){
        console.log(error)
    }

}


export default auth;