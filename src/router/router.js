import Home from '../components/Home.vue'
import Stocks from '../components/Stocks.vue'
import Signup from '../components/Signup.vue'
import Signin from '../components/Signin.vue'
import { store } from '../store/store';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const router = new VueRouter({
    routes: [
        {path: '', name: 'home', component: Home},
    
        {path: '/stocks', name: 'stocks',  params: {id: 1}, component: Stocks, props: {buying: true}, async beforeEnter(to, from, next) {
            if(!localStorage.userId) await store.dispatch('tryAutoLogin');            
            if(localStorage.userId) {
                next()
            } else {
                next('/signin')
            }        
        }},
    
        {path: '/portfolio', name: 'portfolio', params: {id: 2}, component: Stocks, props: {buying: false}, async beforeEnter(to, from, next) {
            if(!localStorage.userId) await store.dispatch('tryAutoLogin');
            if(localStorage.userId) {
                next()
            } else {
                next('/signin')
            }
        }},
    
        {path: '/signup', name: 'signup', component: Signup, beforeEnter(to, from, next) {
            if(localStorage.userId) {
                next('/home')
            } else next()},
        },
        
        {path: '/signin', name: 'signin', component: Signin, beforeEnter(to, from, next) {
            if(localStorage.userId) {
                next('/home')
            } else next()},
        },
    
        {path: '*', redirect: {name: 'home'}}
    
    ],
    mode: 'hash'    
});