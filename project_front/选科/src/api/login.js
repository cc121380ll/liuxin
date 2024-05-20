import request from '../utils/request';

export const registerApi = () => {
    return request({
        url: 'https://localhost:8083/api/auth/register',
        method: 'post'
    });
};

export const loginApi = () => {
    return request({
        url: 'https://localhost:8083/api/auth/login',
        method: 'get'
    });
};
