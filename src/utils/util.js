const util = {};

// 반환 메시지
util.responseMsg = function(data){
    return{
        status: 200,
        data: data
    }
}

export default util;