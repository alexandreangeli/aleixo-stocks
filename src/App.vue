<template>
  <div class="bodyContent">
    <app-header @save="saveUser" @load="loadUser" @endDay="endDay"/>
    
    <div class="paginas">
      <div class="container custom-container">
        <div class="row">
          <div class="col text-center py-5" style="margin: 0; width: 100%">
            <transition name="slide" mode="out-in">
              <router-view :key="$route.component"/>
            </transition>
          </div>
        </div>
      </div>
    </div>    
    
    <app-footer v-if="!(typeof wind.orientation !== 'undefined')" />
    
  </div>  
</template>

<script>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { mapActions } from 'vuex'
export default {

  components: {
    appHeader: Header,
    appFooter: Footer
  },

  data() {
    return {
      wind: {}
    }
  },

  mounted() {
    this.wind = window;
  },

  methods: {
    ...mapActions([
      'loadUser',
      'endDay',
      'saveUser',
      'tryAutoLogin'
    ])    
  },

  async created() {
    if(!this.$store.getters.idToken) await this.$store.dispatch('tryAutoLogin');
  },
}
</script>

<style>

  .withPointer {
    cursor: pointer;
  }

  html { 
    overflow-y: scroll; 
    overflow-x: scroll; 
  }

  html, body, .bodyContent {
    min-height: 100%;
    height: 100%;
  }

  .paginas {
    min-height: calc(100% - 92px);
  }  

  .content {
    height: 100%;
    min-height: 100%;
  }

  .slide-move {
    transition: transform 1s;
  }

 .slide-leave-active {
    transition: opacity 0.3s ease;
    opacity: 0;
    animation: slide-out 0.3s ease-out forwards;
    position: absolute;
  }

  .slide-leave {
    opacity: 1;
    transform: translateX(0);
  }


  .slide-enter-active {
    animation: slide-in 0.3s ease-out forwards;
  } 

  @keyframes slide-out {
    0% {
      transform: translateX(0);
    } 
    100% {
      transform: translateX(1500px);
    }
  }

  @keyframes slide-in {
    0% {
      transform: translateX(-1500px);
      
    } 
    100% {
      transform: translateX(0);
    }
  }

  .col-centered{
    float: none;
    margin: 0 auto;
    width: auto;
  }
  
  .fadeOut-move {
    transition: transform 1s;
  }
  .move {
      position: absolute;
    }
</style>
