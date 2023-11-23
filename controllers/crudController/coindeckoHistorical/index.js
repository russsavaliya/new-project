const mongoose = require("mongoose");
var cron = require('node-cron');
const axios = require("axios")
const Marketcap = require("../../../models/CoingekoMarketcap")
const Error = require("../../../models/Error")

const list = async (req, res, next) => {
    try {
        let i = 0;
        while (i <= 30) {
            await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=${i}&sparkline=false`)
                .then(response => {
                    response.data.map(async (item, index) => {
                        const checkdata = await Marketcap.findOne({ id: item.id })
                        if (checkdata) {
                            await Marketcap.findOneAndUpdate({ id: item.id },
                                {
                                    symbol: item.symbol,
                                    name: item.name,
                                    image: item.image,
                                    current_price: item.current_price,
                                    market_cap: item.market_cap,
                                    market_cap_rank: item.market_cap_rank,
                                    fully_diluted_valuation: item.fully_diluted_valuation ? item.fully_diluted_valuation : null,
                                    max_supply: item.max_supply,
                                    total_volume: item.total_volume,
                                    high_24h: item.high_24h ? item.high_24h : null,
                                    low_24h: item.low_24h,
                                    price_change_24h: item.price_change_24h,
                                    price_change_percentage_24h: item.price_change_percentage_24h,
                                    market_cap_change_24h: item.market_cap_change_24h,
                                    market_cap_change_percentage_24h: item.market_cap_change_percentage_24h,
                                    circulating_supply: item.circulating_supply,
                                    total_supply: item.total_supply,
                                    ath: item.ath,
                                    ath_change_percentage: item.ath_change_percentage,
                                    ath_date: item.ath_date,
                                    atl: item.atl,
                                    atl_change_percentage: item.atl_change_percentage,
                                    atl_date: item.atl_date,
                                    last_updated: item.last_updated,
                                },
                                { new: true })
                                .then((response) => {

                                })
                                .catch((err) => {
                                    console.log(err);
                                })

                        } else {
                            Marketcap.create({
                                id: item.id,
                                symbol: item.symbol,
                                name: item.name,
                                image: item.image,
                                current_price: item.current_price,
                                market_cap: item.market_cap,
                                market_cap_rank: item.market_cap_rank,
                                fully_diluted_valuation: item.fully_diluted_valuation,
                                max_supply: item.max_supply,
                                total_volume: item.total_volume,
                                high_24h: item.high_24h ? item.high_24h : null,
                                low_24h: item.low_24h,
                                price_change_24h: item.price_change_24h,
                                price_change_percentage_24h: item.price_change_percentage_24h,
                                market_cap_change_24h: item.market_cap_change_24h,
                                market_cap_change_percentage_24h: item.market_cap_change_percentage_24h,
                                circulating_supply: item.circulating_supply,
                                total_supply: item.total_supply,
                                ath: item.ath,
                                ath_change_percentage: item.ath_change_percentage,
                                ath_date: item.ath_date,
                                atl: item.atl,
                                atl_change_percentage: item.atl_change_percentage,
                                atl_date: item.atl_date,
                                last_updated: item.last_updated,
                            })
                                .then((response) => {
                                })
                                .catch((err) => {
                                    console.log(err, "err");
                                })
                        }
                    })
                })
                .catch(err => {

                })
            i++
        }

    } catch (error) {
        if (error) {

        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const createCoinList = async (req, res, next) => {
    try {
        const coingeckoFindData = await CoingekoMarketcap.find({}).limit(13000)
        coingeckoFindData.map(async (item) => {
            const checkdata = await CoingeckoHistorycalCoinlist.findOne({ name: item.name })
            if (checkdata) {
                await CoingeckoHistorycalCoinlist.findOneAndUpdate({ name: item.name }, {
                    symbol: item.symbol,
                    image: item.image,
                    start_date: item.atl_date,
                    modify_date: item.last_updated,
                    id: item.id,
                    isDone: false
                }, { new: true })
                    .then(response => {
                    })

            } else {
                await CoingeckoHistorycalCoinlist.create({
                    name: item.name,
                    symbol: item.symbol,
                    image: item.image,
                    start_date: item.atl_date,
                    modify_date: item.last_updated,
                    id: item.id,
                    api_last_record_date: item.atl_date,
                    isDone: false
                })
            }
        })

        res.json({ status: true, message: "Record Inserted Successfully !!" })
    } catch (error) {

    }
}

const create = async (req, res, next) => {
    try {
        var date = new Date();
        var date = new Date(date.setDate(date.getMonth() - 1));
        const data = await Error.find()
        let i = 0;
        data.map(async (item) => {
            const find = await Error.deleteMany({ errorDateAndTime: { $lte: date } })
        })
        var coinGeckoHistory = await mongoose.model("coingecko_historical_coin_list").findOne({ isDone: false })
        if (coinGeckoHistory) {
            let start_date = new Date(coinGeckoHistory.api_last_record_date);
            let end_date = new Date()
            while (start_date <= end_date) {
                await sleep(100);
                var dd = start_date.getDate();
                var mm = start_date.getMonth() + 1;
                if (dd < 10) { dd = '0' + dd; }
                var yyyy = start_date.getFullYear();
                if (mm < 10) { mm = '0' + mm; }
                var vDate = dd + '-' + mm + '-' + yyyy;
                var name = coinGeckoHistory.id
                var response = await axios.get(`https://api.coingecko.com/api/v3/coins/${name}/history?date=${vDate}`);
                if (response.status == 200) {
                    await mongoose.model("coingecko_historical_coin_data").create({
                        name: response.data.name,
                        coinlist_id: coinGeckoHistory._id,
                        current_price: response.data.market_data === undefined ? null : response.data.market_data.current_price.usd,
                        market_cap: response.data.market_data === undefined ? null : response.data.market_data.market_cap.usd,
                        total_volume: response.data.market_data === undefined ? null : response.data.market_data.total_volume.usd,
                        date: vDate,
                        apiresponse: {
                            response: response.data
                        }
                    })
                    start_date = new Date(start_date.setDate(start_date.getDate() + 1))
                    let e_date = new Date()
                    var res = await mongoose.model("coingecko_historical_coin_list").findOneAndUpdate({ _id: coinGeckoHistory._id }, {
                        api_last_record_date: start_date,
                        isDone: start_date >= e_date ? true : false
                    }, { new: true })
                }

            }
        }
    } catch (error) {
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
        }
    }
}

// cron.schedule("*/1 * * * *", function () {
//     create();
// });
module.exports = { create, list, createCoinList }

