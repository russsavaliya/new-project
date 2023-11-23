const mongoose = require("mongoose")
const axios = require("axios")
var Decimal = require('decimal');
var cron = require('node-cron');
const Big = require("big.js")
const priceDaily = require("../../../models/PriceHistoryDaily")
const coingeckoHistoriacal = require("../../../models/CoingeckoHistorycalcoinlist")
const Error = require("../../../models/Error")

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const create = async (Model, req, res) => {
    try {
        console.log("every 5minite");
        let limit = 1;
        let skip = 0;
        let i = 0;
        let coingekosCoin = false;
        do {
            const data = await coingeckoHistoriacal.findOne().skip(skip).limit(limit);
            await sleep(2000);
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${data.id}`)

                .then(async (response) => {
                    const existName = await mongoose.model('price_history_exchange_data').findOne({ name: response.data.id }).lean()
                    if (!existName) {
                        const allprice = await new mongoose.model('price_history_exchange_data')({
                            name: response.data.id,
                            coingeckoPrice: response.data.market_data.current_price.usd
                        }).save()
                    } else {
                        const res = await mongoose.model('price_history_exchange_data').findOneAndUpdate(
                            {
                                name: response.data.id
                            }, 
                            {
                            coingeckoPrice: response.data.market_data.current_price.usd
                        }, { new: true }).exec();
                    }
                })
                .catch((error) => {
                    console.log(error, "error");
                    coingekosCoin = true;
                    if (error.port) {
                        Error.create({
                            errorStatus: error.port,
                            errorUrl: error.config.url
                        })
                    }
                    if (error.response.status == 429) {
                        Error.create({
                            errorStatus: error.response.status,
                            errorText: error.response.statusText,
                            errorUrl: error.response.config.url
                        })
                    }
                })
            if (coingekosCoin) {
                break;
            }
            skip = skip + limit;
        } while (skip <= 99)
        let coinstatelimit = 1;
        let coinstateskip = 0;
        do {
            const data = await coingeckoHistoriacal.findOne().skip(coinstateskip).limit(coinstatelimit);
            await sleep(2000);
            await axios.get(`https://api.coincap.io/v2/assets/${data.id}`)
                .then(async (response) => {
                    const datetoday = new Date();
                    const existName = await mongoose.model('price_history_exchange_data').findOne({ name: response.data.data.id }).lean()
                    if (!existName) {
                        const allprice = await new mongoose.model('price_history_exchange_data')({
                            name: response.data.data.id,
                            coinCapprice: response.data.data.priceUsd
                        }).save()
                    } else {
                        if (
                            (existName.coingeckoPrice != undefined || existName.coingeckoPrice != null)
                            && (existName.coinCapprice != undefined || existName.coinCapprice != null)
                        ) {
                            const coinCapprice = Big(existName.coinCapprice.toString());
                            const coingeckoPrice = Big(existName.coingeckoPrice.toString());
                            let total = (coinCapprice.plus(coingeckoPrice));
                            let cprice = total.div(2).toString();
                            var date = new Date().toISOString().slice(0, 10);
                            await mongoose.model('price_history_exchange_data').findOneAndUpdate({ name: response.data.data.id || response.data.data.name }, {
                                totalPrice: total,
                                current_price: cprice,
                                date: datetoday.toLocaleDateString()
                            }, { new: true }).exec()
                            const existDate = await priceDaily.find({ name: response.data.data.id || response.data.data.name, date: date }).lean();
                            if (existDate.length == 0) {
                                priceDaily.create({
                                    name: response.data.data.id,
                                    date: date,
                                    price: cprice
                                })
                            } else {
                                existDate.map((item) => {
                                    priceDaily.findByIdAndUpdate({ _id: item._id }, {
                                        price: cprice
                                    }, { new: true })
                                })
                            }
                        }
                        const res = await mongoose.model('price_history_exchange_data').findOneAndUpdate(
                            {
                                name: response.data.data.id
                            }, {
                            coinCapprice: response.data.data.priceUsd
                        }, { new: true }).exec();
                        console.log(res, "response");
                    }
                })
                .catch((error) => {
                    if (error) {
                        if (error.port) {
                            Error.create({
                                errorStatus: error.port,
                                errorUrl: error.config.url
                            })
                        }
                        if (error.response.status == 429) {
                            Error.create({
                                errorStatus: error.response.status,
                                errorText: error.response.statusText,
                                errorUrl: error.response.config.url
                            })
                        }
                        if (error.response.status == 404) {
                            Error.create({
                                errorStatus: error.response.status,
                                errorText: error.response.statusText,
                                errorUrl: error.response.config.url
                            })
                        }
                    }
                })
            coinstateskip = coinstateskip + coinstatelimit;
        } while (coinstateskip <= 99)
    } catch (error) {
        console.log(error, "error");
    }
}

// cron.schedule('* * * * *', () => {
//     create();
// });

module.exports = { create }