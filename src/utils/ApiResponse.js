class ApiResponse{
    constructor(statuscode,data,messeage="Succes"){
        this.statuscode=statuscode
        this.data=data
        this.message=messeage
        this.success=statuscode < 400

    }
}
export {ApiResponse}
