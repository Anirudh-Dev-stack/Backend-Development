class ApiResponse{
    constructor(statusCode,data,messeage="Succes"){
        this.statusCode=statusCode
        this.data=data
        this.message=messeage
        this.success=statusCode < 400

    }
}
export {ApiResponse}
