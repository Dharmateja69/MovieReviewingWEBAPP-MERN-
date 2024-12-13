
//13-12-24
exports.errorHandler = (err,req,res,next)=>{
    console.log("err:",err);
    res.status(500).json({error:err||err.message});
  }