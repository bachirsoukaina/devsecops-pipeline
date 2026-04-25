import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export const login = (credentials) =>
    API.post('/auth/login', credentials);

export const register = (user) =>
    API.post('/auth/register', user);

export const getUsers = () =>
    API.get('/users');

export const deleteUser = (id) =>
    API.delete(`/users/${id}`);