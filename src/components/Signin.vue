<template>
  <div id="signin">
    <div class="signin-form">
      <h2>Signin</h2>
      <form @submit.prevent="signin({email: email, password: password})">
        <div class="input" :class="{ invalid: $v.email.$error}">
          <label for="email">Mail</label>
          <input
                  type="email"
                  id="email"
                  @blur="$v.email.$touch()"
                  v-model="email">
          <p class="invalid" v-if="(!$v.email.email && $v.email.$dirty)">Please provid a valid e-mail address</p>
          <p class="invalid" v-if="(!$v.email.required && $v.email.$dirty)">This field must not be empty</p>
        </div>
        <div class="input" :class="{ invalid: $v.password.$error}">
          <label for="password">Password</label>
          <input
                  type="password"
                  id="password"
                  @blur="$v.password.$touch()"
                  v-model="password">
          <p class="invalid" v-if="(!$v.password.minLen && $v.password.$dirty)">Passwords need atleast 6 characters</p>
          <p class="invalid" v-if="(!$v.password.required && $v.password.$dirty)">This field must not be empty</p>
        </div>
        <div class="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
    <div class="submit">
        <router-link tag="button" type="submit" class="submit" to="/signup">Create Account</router-link>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex';
  export default {

    data () {
      return {
        email: '',
        password: ''
      }
    },

    validations: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLen: minLength(6)
      }
    },
    
    methods: {
      ...mapActions([
        'signin'
      ])
    }
  }
</script>

<style scoped>
  .signin-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }
  
  .input.invalid input {
    border: 1px solid red;
    background-color: #ffc9aa
  }
  .invalid {
    color: red;
  }

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