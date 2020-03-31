<template>    

  <nav class="navbar navbar-expand-md navbar-dark bg-dark" id="header" :class="{'menuCollapsed': !isCollapsed, 'menuNotCollapsed:': isCollapsed}"> 
    <div class="container">
      <div class="row col-centered">   
          <div v-if="isAuthenticated && user && user.funds" class="navbar-toggler nav-item col col-centered m-2">
            <a class="nav-link disabled text-nowrap text-center" href="#">Funds: ${{ user.funds.toFixed(2)  }}</a>
          </div>
          <button @click="collapse" ref="collapseButton" class="navbar-toggler col col-centered m-2" type="button" data-toggle="collapse" data-target=".navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
      </div>
        

      <div class="navbar-collapse collapse w-100 order-3 dual-collapse2 navbarSupportedContent">
        <ul class="navbar-nav mr-auto">

          <router-link tag="li" to="/" class="nav-item">
            <a class="nav-link text-nowrap text-center">Aleixo Stocks</a>
          </router-link>

          <router-link v-if="isAuthenticated" tag="li" to="/portfolio" class="nav-item">
            <a class="nav-link text-nowrap text-center">Portfolio</a>
          </router-link>

          <router-link v-if="isAuthenticated" tag="li" to="/stocks" class="nav-item">
            <a class="nav-link text-nowrap text-center">Stocks</a>
          </router-link>                
        </ul> 
      </div>

      <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav mx-auto nav-flex-icons">
          <li v-if="isAuthenticated && user && user.funds" class="nav-item">
            <a class="nav-link disabled text-nowrap text-center" href="#">Funds: ${{ user.funds.toFixed(2)  }}</a>
          </li> 
        </ul>
      </div>

      <div class="navbar-collapse collapse w-100 order-3 dual-collapse2 navbarSupportedContent">
        <ul class="navbar-nav ml-auto">       

          <li v-if="isAuthenticated" class="nav-item">
            <a class="nav-link text-nowrap text-center" href="#"  @click="$emit('endDay')">End Day</a>
          </li>    

          <li v-if="isAuthenticated" class="nav-item dropdown withPointer">
            <div class="nav-link dropdown-toggle text-nowrap text-center" id="saveDropdown" 
              data-toggle="dropdown" 
              aria-haspopup="true" aria-expanded="false"
            >
              Save/Load
            </div>
            <div class="dropdown-menu text-nowrap text-center" aria-labelledby="saveDropdown">
              <a class="dropdown-item text-nowrap text-center" href="#" @click="$emit('save')">Save Data</a>
              <a class="dropdown-item text-nowrap text-center" href="#" @click="$emit('load')">Load Data</a>
            </div>
          </li> 

          <li v-if="!isAuthenticated" class="nav-item dropdown withPointer">
            <div class="nav-link dropdown-toggle text-nowrap text-center" id="loginDropdown" 
              data-toggle="dropdown" 
              aria-haspopup="true" aria-expanded="false"
            >
              Login
            </div>
            <div class="dropdown-menu text-nowrap text-center" aria-labelledby="loginDropdown">
              <router-link tag="a" to="/signup" class="dropdown-item text-nowrap text-center">Sign Up</router-link>
              <router-link tag="a" to="/signin" class="dropdown-item text-nowrap text-center">Sign In</router-link>
            </div>
          </li>

          <router-link v-if="isAuthenticated" @click.native="logout" tag="li" to="/" class="nav-item">
            <a class="nav-link text-nowrap text-center">Logout</a>
          </router-link>  

        </ul>        

      </div>  
    </div>         
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      isCollapsed: true
    }
  },

  watch: {
    '$route' (to, from) {
      $('.navbar-collapse').collapse('hide');
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ]),

    collapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>

<style scoped>
#header {
  padding:8px 8%;
} 

.menuCollapsed {
  height: auto
}

.menuNotCollapsed {
  max-height: 56px;
  height: 56px;
}
</style>
