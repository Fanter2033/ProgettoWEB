import Vuex from 'vuex';
export const store = new Vuex.Store({
    state:{
        userZero : []
    },
    getters: {
        getUserZero: (state) => state.userZero
    }
});