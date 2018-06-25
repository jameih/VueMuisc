import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions.js'
import * as getters from './getter.js'
import state from './state.js'
import mutations from './mutation.js'

Vue.use(Vuex);


export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})