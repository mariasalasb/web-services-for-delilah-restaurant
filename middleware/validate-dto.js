const ApiError=require('../error/api-error');

function validateDto(schema){   
    return async(req,res,next)=>{
        try{
            const validatedBody = await schema.validate(req.body);
            req.body=validatedBody;
            console.log(req.body);
            next();
        } catch(err){
            res.status(400).json(err.message);
            next(ApiError.badRequest(err));
        }
    };
}

module.exports=validateDto;