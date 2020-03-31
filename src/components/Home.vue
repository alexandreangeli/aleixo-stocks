<template>
    <div>
        <h1>Trade or view your Portfolio</h1>
        <p>You may Save and Load your Data</p>
        <div v-if="isAuthenticated && user">
            <p>Click on 'End Day' to begin a new day!</p>
            <hr>
            <h3>Your Funds: ${{ user.funds.toFixed(2) }}</h3>
        </div>
        <div v-else>
            <p>Make a new account or login into an existing one to begin!</p>    
            <div class="d-flex flex-wrap align-items-center justify-content-center">
                <div class="submit m-2">
                    <router-link tag="button" type="submit" class="submit" to="/signin">Login</router-link>
                </div>
                <div class="submit m-2">
                    <router-link tag="button" type="submit" class="submit" to="/signup">Create Account</router-link>
                </div>
            </div>   
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters([
            'user',
            'isAuthenticated'
        ])
    }    
}
</script>

<style>
.submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>
