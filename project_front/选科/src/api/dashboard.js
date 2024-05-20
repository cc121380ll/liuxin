import request from '../utils/request';

export const downloadTemplateApi = () => {
    return request({
        url: 'http://localhost:8083/api/school-system/download-template',
        method: 'get'
    });
};