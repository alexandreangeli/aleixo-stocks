
const state = {

}

const getters = {
    stocks: (state, getters, rootState) => rootState.Session.user.stocks || [],
    userStocks: (state, getters) => getters.stocks.filter(stock => stock.quantidade > 0),
    searchedStocks: (state, getters) => (searchInput, buying) => {
        let toSearch = [];
        buying 
            ? toSearch = getters.stocks.slice(0) 
            : toSearch = getters.userStocks.slice(0)
        if(searchInput == '') return toSearch
        return toSearch.filter(stock => stock.name.toUpperCase().includes(searchInput.toUpperCase()));
    },
    sortedStocks: (state, getters) => (selectedFilter, selectedOrder, searchInput, buying) => {
        let toSort = getters.searchedStocks(searchInput, buying).slice(0);
        return toSort.sort((a, b) => {  
            let antes;
            let depois;              
            switch (selectedFilter) {
                case 'Name':
                    antes = a.name;
                    depois = b.name;
                    break;
                case 'Price':
                    antes = a.value;
                    depois = b.value;
                    break;
                case 'Quantity':
                    antes = a.quantidade;
                    depois = b.quantidade;                        
                    break;
            }       
            if(selectedOrder == 'Descending') {
                if(antes < depois) return 1;
                if(antes > depois) return -1;
                if(antes == depois) return 0;
            }
            if(selectedOrder == 'Ascending') {
                if(antes < depois) return -1;
                if(antes > depois) return 1;
                if(antes == depois) return 0;
            }  
        })    
    }
}


const mutations = {
    
}

const actions = {    
    changeStockQuantidade({state}, payload) {
        let preco = payload.quantidade * payload.stock.value;
        if(preco > payload.user.funds) {
            alert("You don't have enough money!")
            return;
        }

        let newQuantidade = payload.stock.quantidade + payload.quantidade;
        let newFunds = payload.user.funds - preco;

        if(newQuantidade < 0) {
            alert("You don't have enough stocks!")
            return;
        }
        
        payload.stock.quantidade = newQuantidade;
        payload.user.funds = newFunds;
    },

    endDay({state, getters, dispatch}) {
        let stocks = getters.stocks;
        stocks.forEach(stock => {
            dispatch('randomizeStockValue', stock);        
        });
    },

    randomizeStockValue({state, getters, dispatch}, stock) {
        var porcentagem = Math.floor(Math.random() * 100 + 1);
        if(porcentagem <= 40) {      
            dispatch('changeStockValue', {min: 0, max: 10, stock: stock});
        }
        if(porcentagem > 40 && porcentagem <= 70) {
            dispatch('changeStockValue', {min: 10, max: 20, stock: stock});
        }
        if(porcentagem > 70 && porcentagem <= 90) {
            dispatch('changeStockValue', {min: 20, max: 50, stock: stock});
        }
        if(porcentagem > 90) {
            dispatch('changeStockValue', {min: 50, max: 100, stock: stock});
        }
    },

    async changeStockValue({state, getters, dispatch}, payload) {
        let valor = Math.floor(Math.random() * payload.max + 1 - payload.min) + payload.min;
        let a = await dispatch('positivoOuNegativo');
        a ? payload.stock.value *= (1 + valor/100) : payload.stock.value /= (1 + valor/100);
    },

    positivoOuNegativo({state, getters, dispatch}) {
        if(Math.floor(Math.random() * 2 + 1) == 1) {
          return true;
        } else {
          return false;
        }
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}
