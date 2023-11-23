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
        LineChartData:{
            squeals:[],
            popularity:[]
        }
    },
    getters: {
        getUserZero: (state) => {return state.userZero},
        getVips: (state) => { return state.myVips},
        getLineChartData: (state) => {return state.LineChartData}
    },
    mutations:{
        setUserZero(state, user){
            state.userZero = user;
        },
        setVips(state, vipsArray){
            state.myVips = vipsArray;
        },
        setLineChartData(state, DataObj){
            state.LineChartData = DataObj;
        }
    },
    plugins:[vuexLocal.plugin]
});