import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5000' });
// const API = axios.create({ baseURL: 'https://newplex.searchsping.com' });

export const logIn= (formData)=> API.post('/auth/login',formData);

export const signUp = (formData) => API.post('/auth/register', formData);

export const verify = (data) => API.put(`/auth/verify`, data);

export const forget = (data) => API.post('/auth/forget', data);

export const forgetPassword = (data) => API.post('/auth/forget-password', data)
