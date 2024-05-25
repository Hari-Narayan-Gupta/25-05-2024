import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000' });
//  const API = axios.create({ baseURL: 'https://newplex.searchsping.com' });


export const notification = (userId, data) => API.post(`/notification/notifications/${userId}`, data);

//  export const getNotification = (userId) => API.get(`/notification/notify?userId=${userId}`);

export const getReact = (userId) => API.get(`/notification/reactions?userId=${userId}`);

export const getPost = (notificationId) => API.get(`/notification/${notificationId}`);

export const getUnreadNotificationCount = (userId) => API.get(`/notification/unread/count?userId=${userId}`);

export const markNotificationAsRead = (userId) => API.put(`/notification/notifications/read?userId=${userId}`); 