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
        },
        doughnutChart: [],
        squealInputCoor: [],
    },
    getters: {
        getUserZero: (state) => {return state.userZero},
        getVips: (state) => { return state.myVips},
        getLineChartData: (state) => {return state.LineChartData},
        getSInCoor: (state) => {return state.squealInputCoor},
        getDoughnutChart: (state) => {return state.doughnutChart},
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
        },
        setSInCoor(state, newCoor) {
            state.squealInputCoor = newCoor;
        },
        setDoughnutChart(state, array){
            state.doughnutChart = array;
        },
    },
    plugins:[vuexLocal.plugin]
});

//TODO: clear data after logout