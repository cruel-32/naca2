import defaults from './defaults';

export default {
    getMembers : (params:{}={})=> defaults.axios.get('/members',params)

}