const util = {};

// 반환 메시지
util.responseMsg = (data) => {
    return{
        status: 200,
        data: data
    }
}

export default util;