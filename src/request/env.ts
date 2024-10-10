const devBaseURL = 'http://172.17.201.64:8889';
const proBaseURL = 'https://production.org';


export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL;

export const TIMEOUT = 5000;
