// Price ticker
ExpTools.ticker = new Mongo.Collection('expanse_price_ticker', {connection: null});
if(Meteor.isClient)
    new PersistentMinimongo(ExpTools.ticker);

var updatePrice = function(e, res){

    if(!e && res && res.statusCode === 200) {
        var content = JSON.parse(res.content);

        if(content){
            _.each(content, function(price, key){
                var name = key.toLowerCase();

                // make sure its a number and nothing else!
                if(_.isFinite(price)) {
                    ExpTools.ticker.upsert(name, {$set: {
                        price: String(price),
                        timestamp: null
                    }});
                }

            });
        }
    } else {
        console.warn('Can not connect to https://mini-api.cryptocompare.com to get price ticker data, please check your internet connection.');
    }
};

// update right away
HTTP.get('https://min-api.cryptocompare.com/data/price?fsym=EXP&tsyms=BTC,USD,EUR', updatePrice);
    

// update prices
Meteor.setInterval(function(){
    HTTP.get('https://min-api.cryptocompare.com/data/price?fsym=EXP&tsyms=BTC,USD,EUR', updatePrice);    
}, 1000 * 30);
