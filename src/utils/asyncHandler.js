const asyncHandler   = async (requestHandler) => {
    try {
        await requestHandler()        
    } catch (error) {
        console.log(error);
    }

}



















