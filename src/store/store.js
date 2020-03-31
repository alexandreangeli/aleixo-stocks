import Vue from 'vue';
import Vuex from 'vuex';
import Session from './modules/session'
import Stocks from './modules/stocks'

Vue.use(Vuex);

export const store = new Vuex.Store({   

    modules: {
        Session,
        Stocks
    } 
    
})