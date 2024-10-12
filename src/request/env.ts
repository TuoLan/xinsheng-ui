const devBaseURL = 'http://localhost:8889/api';
const proBaseURL = 'http://175.178.215.129/api';


export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL;

export const TIMEOUT = 5000;
