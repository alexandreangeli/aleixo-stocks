import {router} from '../../router/router'
import Axios from 'axios'


const state = {
    idToken: null,
    userId: null,
    logoutTimer: null,
    user : {}
}

const getters = {
    user: state => state.user,  
    isAuthenticated: state => state.idToken !== null,
    idToken: state => state.idToken
}

const mutations = {
    authUser(state, userData) {
        state.idToken = userData.token;
        state.userId = userData.userId;
    },
    loadUser(state, user) {
        state.user = user;
    },
    clearAuthData(state) {
        state.idToken = null;
        state.userId = null;
    },
    clearLocalStorage(state) {        
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
    },
    clearTimeOut(state) {
        clearTimeout(state.logoutTimer);
    }
}

const actions = {    
    async loadUser({state, commit}) {
        let token = state.idToken;
        await Axios.get('https://stock-trader-54144.firebaseio.com/users.json?auth=' + token
        ).then(res => {
            let users = res.data;
            for(let key in users) {
                if(users[key].userId == state.userId) {
                    if(users[key].key == '') 
                        users[key].key = key;
                    commit('loadUser', users[key]);
                    break;
                }
            }
        }).catch(err => {
            console.log(err);
        });
    },

    setLogoutTimer ({dispatch}, expirationTime) {
        state.logoutTimer = setTimeout(() => {
            dispatch('logout')
        }, expirationTime * 500)   
    },

    async logout ({commit}) {
        commit('clearAuthData')
        commit('clearTimeOut')
        commit('clearLocalStorage')
        router.replace('/signin')
    },

    async login ({commit, dispatch}, res) {
        const now = new Date()
        const expirationDate = new Date(now.getTime() + res.data.expiresIn * 500)
        localStorage.setItem('expirationDate', expirationDate)
        localStorage.setItem('token', res.data.idToken)
        localStorage.setItem('userId', res.data.localId)
        commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
        })
        await dispatch('loadUser');
        await dispatch('setLogoutTimer', res.data.expiresIn)            
        router.replace('/')
    },

    async tryAutoLogin ({commit, dispatch}) {
        const token = localStorage.getItem('token')
        if (!token) {
            commit('clearAuthData')
            commit('clearTimeOut')
            commit('clearLocalStorage')
            return;
        }
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        const now = new Date()
        if (now >= expirationDate) {
            commit('clearAuthData')
            commit('clearTimeOut')
            commit('clearLocalStorage')
            return
        }
        const userId = localStorage.getItem('userId')
        await commit('authUser', {
            token: token,
            userId: userId
        })  
        let logoutTime = expirationDate - now;
        await dispatch('loadUser');
        await dispatch('setLogoutTimer', logoutTime);
      },

    async signin ({dispatch}, authData) {
    await Axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBnhMFBhxPrc9qeaJWUIqKwxMgv8oNATNU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
    }).then(async res => await dispatch('login', res
    )).catch(error => {
        alert('Usuário ou senha inválidos')
        console.log(error)
    })},

    async signup({dispatch}, authData) {
        await Axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBnhMFBhxPrc9qeaJWUIqKwxMgv8oNATNU', {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
        }).then(async res => {
            await dispatch('login', res);
            await dispatch('newUser', res)
        }).catch(err => {
            alert('E-mail em uso.')
            console.log(err)
        })
    },

    async newUser({state, dispatch}, res) {
        let userPadrao = {
            userId: state.userId,
            funds: 10000,
            stocks: [''],
            key: ''
        };
        let token = state.idToken;
        await Axios.post('https://stock-trader-54144.firebaseio.com/users.json?auth=' + token, userPadrao
        ).then(res => {
            dispatch('loadUser');
        }).catch(error => {
            console.log(error);
        });
    },

    async saveUser({state}) {
        let user = state.user;
        let token = state.idToken
        await Axios.put('https://stock-trader-54144.firebaseio.com/users/' + user.key + '.json?auth=' + token, user);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
