import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: '',
    },
    mutation: {
        setToken: (state,token) =>{
            state.token = token
            localStorage.setItem('token',token)
        }
    },
    getters: {
        getToken(state){
            if(!state.token){
                state.token =  localStorage.getItem('token')
            }
            return state.token
        }
        
    }
})
export default store