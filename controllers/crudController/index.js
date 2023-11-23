const crudMethods = require("./crudMethods");
const article = require('./article')
const post = require('./post')
const travelPlan = require('./travelPlan')
const profile = require('./profile')
const role = require('./role')
const crypto = require("./crypto")
const cryptoHistory = require("./cryptohistory")
const newsCategory = require("./newscategory")
const news = require("./news")
const contact = require("./contact")
const price = require("./price")
const mongoose = require("mongoose");
const coinDynamic = require("./coindynamic")
const tokenStatic = require("./coinstatic")
const coingeko = require("./coindeckoHistorical")
const allPrice = require("./allprice");
const error = require("./Error")
const { modelName } = require("../../models/CoingekoMarketcap");

exports.crudController = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};

    methods.create = async (req, res) => {
        await crudMethods.create(Model, req, res);
    };

    methods.read = async (req, res) => {
        await crudMethods.read(Model, req, res);
    };

    methods.update = async (req, res) => {
        await crudMethods.update(Model, req, res);
    };

    methods.delete = async (req, res) => {
        await crudMethods.delete(Model, req, res);
    };

    methods.list = async (req, res) => {
        await crudMethods.list(Model, req, res);
    };

    methods.search = async (req, res) => {
        await crudMethods.search(Model, req, res);
    };

    return methods;
};

exports.coinDynamic = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {};
    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('Tokens_c') || req.admin.isSuperAdmin) await coinDynamic.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('Tokens_r') || req.admin.isSuperAdmin) await coinDynamic.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    return methods
}

exports.tokenStatic = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {};
    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('Tokens_c') || req.admin.isSuperAdmin) await tokenStatic.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('Tokens_r') || req.admin.isSuperAdmin) await tokenStatic.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('Token_u') || req.admin.isSuperAdmin) await crudMethods.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    return methods
}

exports.Error = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};
    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('error_r') || req.admin.isSuperAdmin) await error.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied"
        })
    }
    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('error_d') || req.admin.isSuperAdmin) await error.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied"
        })
    }
    return methods;
}

exports.article = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('article_c') || req.admin.isSuperAdmin) await article.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('article_u') || req.admin.isSuperAdmin) await article.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('article_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('article_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'article');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('article_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_u ') || req.admin.isSuperAdmin) await post.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('article_r') || req.admin.isSuperAdmin) await crudMethods.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    return methods;
}

exports.post = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_c') || req.admin.isSuperAdmin) await post.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_u') || req.admin.isSuperAdmin) await post.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_d') || req.admin.isSuperAdmin) await post.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'post');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('feed_r') || req.admin.isSuperAdmin) await crudMethods.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.getTags = async (req, res) => {
        await crudMethods.getTags(req, res);
    };
    return methods;
}

exports.travePlan = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('travelplan_c') || req.admin.isSuperAdmin) await travelPlan.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('travelplan_u') || req.admin.isSuperAdmin) await travelPlan.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('travelplan_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('travelplan_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'travelPlan');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('travelplan_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('travelplan_r') || req.admin.isSuperAdmin) await crudMethods.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });

    };
    return methods;
}

exports.profile = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('profile_c') || req.admin.isSuperAdmin) await profile.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('profile_u') || req.admin.isSuperAdmin) await profile.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('profile_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('profile_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'profile');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('profile_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('profile_r') || req.admin.isSuperAdmin) await crudMethods.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.banUser = async (req, res) => {
        await profile.banUser(Model, req, res);
    };
    return methods;
}

exports.newsCategory = (modlename) => {
    const Model = mongoose.model(modlename)
    let methods = {}

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('newscategory_c') || req.admin.isSuperAdmin) await newsCategory.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }
    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('newscategory_r') || req.admin.isSuperAdmin) await newsCategory.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('newscategory_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('newscategory_u') || req.admin.isSuperAdmin) await newsCategory.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('newscategory_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('newscategory_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'newscategory');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.banNews = async (req, res) => {
        await newsCategory.banNews(Model, req, res);
    };

    return methods
}

exports.news = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {}

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('news_c') || req.admin.isSuperAdmin) await news.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('news_u') || req.admin.isSuperAdmin) await news.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('news_r') || req.admin.isSuperAdmin) await news.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('news_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('news_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'news');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('news_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    return methods
}

exports.coingeckoHistorical = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {};
    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('coingekoHistorycalData_c') || req.admin.isSuperAdmin) await coingeko.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }
    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('coingekoHistorycalData_r') || req.admin.isSuperAdmin) await coingeko.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    methods.createCoinList = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('coingekoHistorycalData_r') || req.admin.isSuperAdmin) await coingeko.createCoinList(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    return methods
}

exports.price = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {};
    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('pricehistory_c') || req.admin.isSuperAdmin) await price.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('pricehistory_r') || req.admin.isSuperAdmin) await price.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('pricehistory_u') || req.admin.isSuperAdmin) await price.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    return methods
}

exports.pricesAll = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {}

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('allprice_c') || req.admin.isSuperAdmin) await allPrice.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    return methods;
}

exports.Contact = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {}
    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('contact_r') || req.admin.isSuperAdmin) await contact.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('contact_u') || req.admin.isSuperAdmin) await contact.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('contact_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    return methods;
}

exports.crypto = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {}

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('crypto_c') || req.admin.isSuperAdmin) await crypto.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    methods.delete = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('crypto_d') || req.admin.isSuperAdmin) await crudMethods.delete(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.read = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('crypto_r') || req.admin.isSuperAdmin) await crudMethods.read(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('crypto_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'crypto');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.update = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('crypto_u') || req.admin.isSuperAdmin) await crypto.update(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('crypto_r') || req.admin.isSuperAdmin) await crypto.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    return methods
}

exports.cryptoHistory = (modelName) => {
    const Model = mongoose.model(modelName)
    let methods = {};

    methods.create = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('cryptoHistory_c') || req.admin.isSuperAdmin) await cryptoHistory.create(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    }

    methods.list = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('cryptoHistory_r') || req.admin.isSuperAdmin) await cryptoHistory.list(Model, req, res);
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };

    methods.search = async (req, res) => {
        const { permissions = [] } = req.admin.role || {}
        if (permissions.includes('cryptoHistory_r') || req.admin.isSuperAdmin) await crudMethods.search(Model, req, res, 'cryptohistory');
        else return res.status(404).json({
            success: false,
            result: null,
            message: "Access denied.",
        });
    };
    return methods
}

exports.role = (modelName) => {
    const Model = mongoose.model(modelName);
    let methods = {};

    methods.create = async (req, res) => {
        await crudMethods.create(Model, req, res);
    };

    methods.read = async (req, res) => {
        await crudMethods.read(Model, req, res);
    };

    methods.update = async (req, res) => {
        await crudMethods.update(Model, req, res);
    };

    methods.delete = async (req, res) => {
        await role.delete(Model, req, res);
    };

    methods.list = async (req, res) => {
        await crudMethods.list(Model, req, res);
    };

    methods.search = async (req, res) => {
        await crudMethods.search(Model, req, res, 'roles');
    };

    return methods;
};


