import request from '@/utils/request'

export function login(params) {
    return request({
        url: "/api/account/login",
        method: "post",
        data:params
    })
}

export function getList(params) {
    return request ({
        url: "/api/app/order",
        method: "get",
        params
    })
}

export function deleteOrder(id) {
    return request ({
        url: "/api/app/order/"+ id,
        method: "delete",
    })
}

export function addOrder(params) {
    return request ({
        url: "/api/app/order",
        method: "post",
        data:params
    })
}

export function editOrder(params,id) {
    return request ({
        url: "/api/app/order/" + id,
        method: "put",
        data:params
    })
}

export function getOrderDetailByTrackingNo(id) {
    return request ({
        url: "/api/app/order/"+ id +"/orderTrace",
        method: "get",
    })
}

export function addOrderList(params) {
    return request ({
        url: "/api/app/order/btchno",
        method: "post",
        data: params
    })
}
