<template>
    <div>
        <transition name="slide" >
            <div v-if="buying" :key="buying">
                
                <div>
                    <h2 >Stock Market</h2>
                </div>
            </div>
            <div v-else :key="buying">
                
                <div>
                    <h2>Your Portfolio</h2>  
                </div>
            </div>  
        </transition>
        <hr>
                Exemplos: AAPL, DELL, MSFT, AMZN, MSI, NVDA, TWTR, letras de A a Z, FB, JNJ, NETS, WMT, INTC
        <transition-group name="slide" >

            <div v-if="buying && stocks && stocks[0] == ''" key='noStocks'>
                <h2>No stocks in the market, please add one.</h2>
            </div>
            <div v-if="!buying && userStocks.length == 0" key='noUserStocks'>
                <h2>You don't have any Stocks.</h2>
                <br>
                <div class="submit">
                    <router-link tag="button" type="submit" class="submit" to="/stocks">Buy Stocks!</router-link>
                </div>
            </div>
        </transition-group>
        <br>
        
        <transition-group name="fadeOut" tag="div" class="d-flex flex-wrap align-items-center justify-content-center" 
            v-if="userStocks.length != 0 || (userStocks.length == 0 && buying == true)"
            enter-active-class="animated fadeIn" appear
            leave-active-class="animated fadeOut move"
            @before-leave="beforeLeave" mode="out-in" 
        >           
            <div v-if="stocks[0] != ''" class="input-group m-1" style="height: 40px; width: 200px" key="searchStock">
                <img src="../assets/pesquisa.png" style="height: 100%"  alt="">
                <input placeholder="Search Stock" v-bind:value="searchInput" style="height: 100%" v-on:input="searchInput = $event.target.value" type="text" class="form-control" aria-label="search" aria-describedby="inputGroup-sizing-default">
            </div>
                    
            <div v-if="stocks[0] != ''" class="input-group m-1 withPointer" style="height: 40px; width: 200px" key="sortStock">
                <div style="height: 100%" @click="changeOrder" >
                    <img v-if="selectedOrder=='Ascending'"  src="../assets/crescente.png"   alt="" style="height: 100%">
                    <img v-if="selectedOrder=='Descending'" src="../assets/decrescente.png" alt="" style="height: 100%"> 
                </div>
                <select
                    v-model='selectedFilter'
                    id="filter" name="filter"
                    class='form-control p-2'
                    style="height: 100%"
                >
                    <option v-for='filter in filters' :key='filter'>{{ filter }}</option> 
                </select>
            </div>

            <div v-if="buying" class="input-group m-1 withPointer" style="height: 40px; width: 200px" key="newStock">
                <div @click="addStock" style="height: 100%">
                    <img src="../assets/adicionar.png"  alt="adicionar" style="height: 100%">
                </div>
                <input @keyup.enter="addStock" placeholder="Add Stock" v-bind:value="addInput" style="height: 100%" v-on:input="addInput = $event.target.value" type="text" class="form-control" aria-label="add" aria-describedby="inputGroup-sizing-default">
            </div>    
        </transition-group>
        
        <br>
        <div id="loadingDiv">
            <img v-if="loading" class="loading" src="../assets/loading2.gif" alt="loading">
        </div>

        <transition-group v-if="stocks[0] != ''"
            tag="div" appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut move"
            name="fadeOut" mode="out-in"  
            class="d-flex flex-row justify-content-center flex-wrap"
            @before-leave="beforeLeave"            
        > 
            <h2 v-if="(sortedStocks.length == 0 && buying) || (sortedStocks.length == 0 && !buying && userStocks.length != 0)" :key="'noStocksFound'">No stocks found.</h2>
            <app-stock v-for="stock in sortedStocks(selectedFilter, selectedOrder, searchInput, buying)" :key="stock.name" :stock="stock" :buying="buying"/>
        </transition-group>
        
    </div>
</template>
<script>
import Stock from './Stock.vue'
import Axios from 'axios';
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default { 
    data() {
        return {
            filters: ['Name', 'Price', 'Quantity'],
            orders: ['Ascending', 'Descending'],
            selectedFilter: 'Name',
            selectedOrder: 'Ascending',
            searchInput: '',
            addInput: '',
            leavingRoute: false,
            loading: false,
        }
    },

    props: ['buying'],

    computed: {
        ...mapGetters([
            'user',
            'stocks',
            'userStocks',
            'searchedStocks',
            'sortedStocks'
        ]),        
    },
    methods: {
        ...mapActions([
            'changeStockQuantidade'
        ]),

        beforeLeave(el) {
             const {marginLeft, marginTop, width, height} = window.getComputedStyle(el)
             el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`
             el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`
             el.style.width = width
             el.style.height = height
        },
        changeOrder() {
            if(this.selectedOrder == 'Ascending') {
                this.selectedOrder = 'Descending'
                return;
            };
            if(this.selectedOrder == 'Descending'){
                this.selectedOrder = 'Ascending'
                return;
            };
        },

        async tryGetUrl(res,imgLink) {
            this.wikiHtml=res.data.parse.text["*"];
            let indexLogo=this.wikiHtml.indexOf(String.raw`class="logo"`);
            if(indexLogo==-1)
            indexLogo=this.wikiHtml.indexOf(String.raw`class="infobox`);
            let aposLogo=this.wikiHtml.substring(indexLogo,this.wikiHtml.length);
            let indexUrl=aposLogo.indexOf(String.raw`src="`);
            let aposSrc=aposLogo.substring(indexUrl+6,aposLogo.length);
            let ateAspas=aposSrc.indexOf(String.raw`"`);
            let urlFinal=aposSrc.substring(0,ateAspas);
            imgLink='https://'+urlFinal;
            return imgLink;
        },

        numberOfWords(_stockName, number) {

            _stockName = _stockName.split('%2C').join('');
            const underscore = '_';
            let string = "_stockName.substr(0,";

            for(let i = 0; i < number - 1; i++) {
                string += "_stockName.indexOf(underscore,"
            }

            string += "_stockName.indexOf(underscore)"

            for(let i = 0; i < number - 1; i++) {
                string += "+1)"
            }
            
            string += ")"
            
            let valorFinal = eval(string);
            return valorFinal;
        },

        async addStock() {
            try {
            this.loading = true;
            let errCheck = 0;
            let stockPost = await Axios.get("https://cloud.iexapis.com/beta/stock/"+this.addInput+"/quote?token=pk_1eb86f7f57214128b7d984b1b9626a2e"
            ).catch(async err => {
                console.log(err);
                errCheck = 1;
                alert("Invalid Stock")
            });
            if(errCheck == 1) return;
            let completeName = stockPost.data.companyName;
            let imgLink = '';            
            if(this.stocks.filter(stock => stock.name == stockPost.data.symbol).length != 0) {
                alert("Stock is already in the Market")
                return;
            }
            const underscore = '_';
            const comma = '%2C';
            const empty = '';
            let _stockName = encodeURIComponent(completeName.split(' ').join('_'))
            if(_stockName.endsWith("Corp.")) _stockName = _stockName.substring(0, _stockName.length - 1) + 'oration';
            // if(_stockName.endsWith("Co.")) _stockName = _stockName.substring(0, _stockName.length - 1) + 'mpany';
            await Axios.get(String.raw`https://en.wikipedia.org/w/api.php?action=parse&page=${_stockName}&redirects&origin=*&format=json`
            ).then(async res => {
                imgLink = await this.tryGetUrl(res,imgLink);
            }).catch(async err => {
                console.log(err)
                await Axios.get(String.raw`https://en.wikipedia.org/w/api.php?action=parse&page=${this.numberOfWords(_stockName, 5)}&redirects&origin=*&format=json`
                ).then(async res => {
                    imgLink = await this.tryGetUrl(res,imgLink);
                }).catch(async err => {
                    console.log(err)
                    await Axios.get(String.raw`https://en.wikipedia.org/w/api.php?action=parse&page=${this.numberOfWords(_stockName, 4)}&redirects&origin=*&format=json`
                    ).then(async res => {
                        imgLink = await this.tryGetUrl(res,imgLink);
                    }).catch(async err => {
                        console.log(err)
                        await Axios.get(String.raw`https://en.wikipedia.org/w/api.php?action=parse&page=${this.numberOfWords(_stockName, 3)}&redirects&origin=*&format=json`
                        ).then(async res => {
                            imgLink = await this.tryGetUrl(res,imgLink);
                        }).catch(async err => {
                            console.log(err)
                            await Axios.get(String.raw`https://en.wikipedia.org/w/api.php?action=parse&page=${this.numberOfWords(_stockName, 2)}&redirects&origin=*&format=json`
                            ).then(async res => {
                                imgLink = await this.tryGetUrl(res,imgLink);
                            }).catch(async err => {
                                console.log(err)
                                await Axios.get(String.raw`https://en.wikipedia.org/w/api.php?action=parse&page=${this.numberOfWords(_stockName, 1)}&redirects&origin=*&format=json`
                                ).then(async res => {
                                    imgLink = await this.tryGetUrl(res,imgLink);
                                }).catch(async err => {
                                    console.log(err)
                                });
                            });
                        });
                    });
                });
            });
            let newStock = {
                name: this.addInput.toUpperCase(),
                completeName: completeName,
                value:  stockPost.data.close,
                imgLink: imgLink,
                quantidade: 0
            }
            if(this.stocks[0] == '') this.stocks.length = 0;
            this.stocks.push(newStock);
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
            
        }
    },
    components: {
        appStock: Stock
    }
}
</script>

<style scoped>

#loadingDiv{

    Width:100%;

}

.loading {
    display:block;
    margin: 0 auto;
    margin-left:auto;

    margin-right:auto;

    float :none;

}

.form-control {
    border: solid black 2px;
}
</style>

  
