<template>
    <div>    
        <div class="p-2">
            <div class="card">
                <div class="d-flex flex-column justify-content-between card-block">
                    <img class="logo"  style="max-height: 40%; min-height: 30%" :src="stock.imgLink">
                    <h4 class="card-title" style="max-height: 10%; min-height: 10%">{{ stock.name }} - ${{ stock.value.toFixed(2)  }}</h4>
                    <h5 class="card-subtitle text-muted"  style="">{{ stock.completeName  }}</h5>

                    <div style="max-height: 35%; min-height: 35%">
                        <input class="form-control inputQuantidade" style="height: 34%" placeholder="How much?" type="text" @blur="checaQuantidade" v-bind:value="quantidade" v-on:input="quantidade = $event.target.value">             
                        <h6 class="card-subtitle text-muted" style="height: 28%" >You have: {{ stock.quantidade }} 
                            <span v-if="stock.quantidade == 1">stock</span>
                            <span v-else>stocks</span>  
                        </h6>
                        <div @click="changeStock()" style="width: 100%; height: 38%">
                            <button class="btn btn-outline-success" style="width: 100%" v-if="buying">Buy</button>
                            <button class="btn btn-outline-primary" style="width: 100%" v-else>Sell</button>
                        </div>  
                    </div>
                               
                </div>
            </div>
        </div>
    </div>  
        
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            quantidade: '',
            imgLink: '',
            wikiHtml: ''
        }
    },   

    props: ['stock', 'buying'],

    computed: {
        ...mapGetters([
            'user',
            'stocks'
        ])
    },

    methods: {
        changeStock() {
            if(this.quantidade == '') return;
            let quantidadeChange = 0
            this.buying ? quantidadeChange = parseInt(this.quantidade) : quantidadeChange = -parseInt(this.quantidade)
            this.$store.dispatch('changeStockQuantidade', {quantidade: quantidadeChange, stock: this.stock, user: this.user})
            this.quantidade = '';            
        },
        checaQuantidade() {
            if(parseInt(this.quantidade) < 0 || (isNaN(parseInt(this.quantidade)) && this.quantidade != '')) {
                this.quantidade = '';
                alert("Invalid quantity!")
            }
        }
    }    
}

</script>

<style scoped>
.logo {
    object-fit:contain;
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: 100%
}

.card {
    padding: 10px 15px 10px 15px;
    margin: 5px;
    height: 350px;
    width: 300px;
}

.card-block {
    height: 100%;
}

.cardTexts > * {
    margin: 2px;
}

.inputQuantidade {
    text-align: center;
    margin: auto;
    margin-bottom: 10px;
    
}
</style>
