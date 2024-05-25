import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });
// const API = axios.create({ baseURL: "https://newplex.searchsping.com" });


API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });

export const getUser = (userId) => API.get(`/user/${userId}`);
export const updateUser = (id, formData) =>  API.put(`/user/${id}`, formData);
export const getAllUser = ()=> API.get('/user')
export const followUser = (id,data)=> API.put(`/user/${id}/follow`, data)
export const unfollowUser = (id, data)=> API.put(`/user/${id}/unfollow`, data)
export const getUserProfile = (id) => API.get(`/user/profile/${id}`);
export const blockUser = (id, currentUserId) => API.post(`/user/block-user/${id}`, { userId: currentUserId });
export const getBlockUser = (userId) => API.get(`/user/blocked-users/${userId}`);
export const unblockUser = (id, currentUserId) => API.post(`/user/unblock/${id}`, { userId: currentUserId });