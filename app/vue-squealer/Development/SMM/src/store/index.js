import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

const vuexLocal = new VuexPersist({
    key: 'vuex',
    storage: window.localStorage
})
export const store = new Vuex.Store({
    state:{
        userZero : "",
        myVips : [],
    },
    getters: {
        getUserZero: (state) => {return state.userZero},
        getVips: (state) => { return state.myVips},
    },
    mutations:{
        setUserZero(state, user){
            state.userZero = user;
        },
        setVips(state, vipsArray){
            state.myVips = vipsArray;
        }
    },
    plugins:[vuexLocal.plugin]
});