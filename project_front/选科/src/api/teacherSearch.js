import request from '../utils/request';

export const teacherSearchApi = (usename) => {
    return request({
        url: 'https://localhost:8083/api/school-system/teachers/view/{id}',
        method: 'get',
    }).then(response => {
        // 在这里处理返回的数据
        const newData = {
            code: 200, // 使用响应状态码作为新的code
            data: response.data  , // 使用响应数据中的数据
            message: "success"     // 设置自定义的成功信息
        };
        return newData; // 返回处理后的数据
    }).catch(error => {
        // 如果请求失败，可以在这里处理错误
        console.error("请求出错:", error);
        // 返回自定义的错误信息
        return {
            code: 400,
            data: null,
            message: "报错信息"
        };
    });
};