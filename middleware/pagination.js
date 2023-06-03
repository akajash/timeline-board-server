export default function navigate(model) {
    return (req,res,next) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}

        if(end < model.length){
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if(start > 0){
            results.prev = {
                page: page - 1,
                limit: limit
            }
        }

        results.data = model.slice(start,end)
        
        res.pageData = results
        next()

    }
}