const axios = require("axios");
const mongoose = require("mongoose")
var cron = require('node-cron');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const create = async (Model, req, res) => {
    try {
        let i = 0;
        while (i <= 100) {
            await sleep(2000)
            await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${i}&sparkline=false`)
                .then(async (response) => {
                    response.data.map(async (item, index) => {
                        const checkdata = await mongoose.model("coins").findOne({ id: item.id }).lean()
                        if (checkdata) {
                            await mongoose.model("coins").findOneAndUpdate({ id: item.id },
                                {
                                    icon: item.image,
                                    circulating_supply: item.circulating_supply,
                                    max_supply: item.max_supply,
                                    total_supply: item.total_supply,
                                    market_cap: item.market_cap,
                                    rank: item.market_cap_rank,
                                    volume_24_hours: null,
                                    volume_7_days: null,
                                    last_price_usd: null,
                                    last_price_usd: null
                                },
                                { new: true })
                                .then((response) => {
                                    //console.log(response, "responsecoingecko");
                                })
                                .catch((err) => {
                                    console.log(err, "errcoingeko");
                                })
                        } else {
                            mongoose.model("coins").create({
                                id: item.id,
                                icon: item.image,
                                circulating_supply: item.circulating_supply,
                                max_supply: item.max_supply,
                                total_supply: item.total_supply,
                                market_cap: item.market_cap,
                                rank: item.market_cap_rank,
                                volume_24_hours: null,
                                volume_7_days: null,
                                last_price_usd: null,
                                last_price_usd: null
                            })
                                .then((response) => {
                                    // console.log(response, "response");
                                })
                                .catch((err) => {
                                    console.log(err, "error");
                                })
                        }
                    })
                })
                .catch(err => {

                })
            i++
        }
    } catch (error) {
        console.log(error, "errorcoindynamic");
        return res
            .status(500)
            .json({ success: false, result: [], message: "Oops there is an Error" });
    }
}

const list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        const resultsPromise = Model.aggregate([
            {
                $addFields:
                {
                    hasValue: { $cond: [{ $eq: ["$rank", null] }, 21, 11] },
                }
            },
        ])
            .sort({ hasValue: 1, rank: 1 })
            .skip(skip)
            .limit(limit);


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



// cron.schedule("*/1 * * * *", function () {
//     create();
// });

module.exports = { create, list }