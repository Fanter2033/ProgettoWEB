import Vuex from 'vuex';
export const store = new Vuex.Store({
    state:{
        userZero : "",
        myVips : [],
    },
    getters: {
        getUserZero: (state) => state.userZero,
        getVips: (state) => state.myVips,
    },
    mutations:{
        setVips(state, vipsArray){
            state.myVips = vipsArray;
        }
    }
});