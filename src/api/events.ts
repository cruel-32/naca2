import defaults from './defaults';

export default {
    getEvents : (params:{}={})=> defaults.axios.get('/events',params)

}