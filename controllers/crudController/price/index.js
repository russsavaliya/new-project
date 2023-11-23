const { default: axios } = require("axios");
const mongoose = require("mongoose");
const cron = require('node-cron');

const create = async (Model, req, res) => {
    try {
        const limit = 1;
        let skip = 0;
        do {
            var crypto = await mongoose.model("coingecko_historical_coin_data").aggregate([
                {
                    $project: {
                        name: 1,
                        date: 1,
                        apiresponse: 1,
                        _id: 0
                    }
                }
            ]).skip(skip)
                .limit(limit);
            skip = skip + limit;
            crypto.map((itemValue) => {
                itemValue.apiresponse.map(async (item) => {
                    if (item.response.market_data) {
                        const nameExist = await mongoose.model('price_history').findOne({ name: itemValue.name, date: itemValue.date })
                        if (!nameExist) {
                            const cryptoPrice = new mongoose.model('price_history')({
                                name: itemValue.name,
                                date: itemValue.date,
                                price_usd: item.response.market_data.current_price.usd ? item.response.market_data.current_price.usd : null,
                                price_btc: item.response.market_data.current_price.btc ? item.response.market_data.current_price.btc : null,
                                image: item.response.image.small
                            })
                            const result = await cryptoPrice.save()
                        }
                    }
                })
            })
        } while (crypto);
        res.send(crypto)
    } catch (error) {
        console.log(error, "errordatasdfdsf");
    }
}

const list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Model.find()
            .skip(skip)
            .limit(limit)

        let newresult = []

        // Counting the total documents
        const countPromise = Model.countDocuments();
        // Resolving both promises
        const [result, count] = await Promise.all([resultsPromise, countPromise]);
        // Calculating total pages
        const pages = Math.ceil(count / limit);

        // Getting Pagination Object
        const pagination = { page, pages, count };
        if (count > 0) {
            return res.status(200).json({
                success: true,
                result,
                pagination,
                // message: "Successfully found all documents",
            });
        } else {
            return res.status(203).json({
                success: false,
                result: [],
                pagination,
                message: "Collection is Empty",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, result: [], message: "Oops there is an Error" });
    }
};


// cron.schedule('* * * * *', function () {
//     create()
// });

module.exports = { create, list }