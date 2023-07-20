import axios from 'axios';
import { getEnVariables } from '../helpers';

const { VITE_API_URL }= getEnVariables();

const calendarApi = axios.create({
    baseURL:VITE_API_URL
});

//TODO:configurar interceptores
calendarApi.interceptors.request.use(config =>{
    config.headers = {
        //para compartir todos los headers que vienen en la configuracion
        ...config.headers,
        'x-token':localStorage.getItem('token')
    }
    return config;
})

export default calendarApi;

//calendarApi.get('http://localhost:4000/api'+'/auth/new')