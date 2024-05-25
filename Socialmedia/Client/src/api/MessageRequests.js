import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5000' });
//  const API = axios.create({ baseURL: 'https://newplex.searchsping.com' });


export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data); 

export const unreadMessages = (id) => API.get(`/message/unread/${id}`);

export const readMessages = (senderId, receiverId) => API.put(`/message/read/${senderId}/${receiverId}`);
