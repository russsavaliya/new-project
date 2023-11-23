const express = require("express");
const { catchErrors } = require("../handlers/errorHandlers");
const path = require("path");

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/admin');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg') {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
            cb(null, true);
        } else {
            //cb(null, false);
            return cb(new Error('Only .gif, .png, .jpg and .jpeg format allowed!'));
        }
    } else if (ext === '.mp4' || ext === '.m1v' || ext === '.m4v' || ext === '.avi' || ext === '.mov') {
        if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mpeg' || file.mimetype === 'video/x-m4v' || file.mimetype === 'video/x-msvideo' || file.mimetype === 'video/quicktime') {
            cb(null, true);
        } else {
            //cb(null, false);
            return cb(new Error('Only .mp4, .m1v, .m4v, .avi, .mov format allowed!'));
        }
    }
}

const upload = multer({ fileFilter: fileFilter, storage: storage });


const articleMedia = []
for (let i = 0; i < 4; i++) {
    articleMedia.push({ name: (`media${+i ? i : ''}`), maxCount: 1 })
}

const router = express.Router();

const adminController = require("../controllers/adminController");
const postController = require("../controllers/postController");
const roleController = require("../controllers/roleController");
const travelPlansController = require("../controllers/travelplansController");
const profilesController = require("../controllers/profilesController");
const cryptoController = require("../controllers/cryptoController")
const articlesController = require("../controllers/articlesController");
const cryptoHistory = require("../controllers/cryptohistoryController")
const newsCategory = require("../controllers/newsCategoryController")
const newsController = require("../controllers/newsController")
const priceHistoryController = require("../controllers/pricehistoryController")
const coinStaticController = require("../controllers/CoinStaticConteoller")
const coinDynamicController = require("../controllers/CoinDynamicConteoller");
const coingeckoHistorycalController = require("../controllers/coingeckoHistoricalController")
const allCoinPriceController = require("../controllers/allPriceController")
const ErrorController = require("../controllers/ErrorController")
const contactController = require("../controllers/contactController")


//_____________________________________ API for get user access role __________________________
router.route("/get/uac").post(catchErrors(adminController.uac));

//_______________________________ Admin management_______________________________
router.route("/admin/create").post(catchErrors(adminController.create));
router.route("/admin/read/:id").get(catchErrors(adminController.read));
router.route("/admin/update/:id").post(catchErrors(adminController.update));
router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
router.route("/admin/search").get(catchErrors(adminController.search));
router.route("/admin/list").get(catchErrors(adminController.list));

router
    .route("/admin/password-update/:id")
    .patch(catchErrors(adminController.updatePassword));
//list of admins ends here

//_____________________________________ API for clients __________________________
router.route("/post/create").post(upload.array('media', 5), catchErrors(postController.create));
router.route("/post/read/:id").get(catchErrors(postController.read));
router.route("/post/update/:id").post(upload.array('media', 5), catchErrors(postController.update));
router.route("/post/delete/:id").delete(catchErrors(postController.delete));
router.route("/post/search").get(catchErrors(postController.search));
router.route("/post/list").get(catchErrors(postController.list));

//_____________________________________ API for get tags __________________________
router.route("/get/tags").post(catchErrors(postController.getTags));

//_____________________________________ API for roles ___________________________
router.route("/role/create").post(catchErrors(roleController.create));
router.route("/role/read/:id").get(catchErrors(roleController.read));
router.route("/role/update/:id").post(catchErrors(roleController.update));
router.route("/role/delete/:id").delete(catchErrors(roleController.delete));
router.route("/role/search").get(catchErrors(roleController.search));
router.route("/role/list").get(catchErrors(roleController.list));

//_____________________________________ API for Travelplans ___________________________
router.route("/travelplans/create").post(catchErrors(travelPlansController.create));
router.route("/travelplans/read/:id").get(catchErrors(travelPlansController.read));
router.route("/travelplans/update/:id").post(catchErrors(travelPlansController.update));
router.route("/travelplans/delete/:id").delete(catchErrors(travelPlansController.delete));
router.route("/travelplans/search").get(catchErrors(travelPlansController.search));
router.route("/travelplans/list").get(catchErrors(travelPlansController.list));

//______________________________________API for Contact____________________________
router.route("/contact/list").get(catchErrors(contactController.list))
router.route("/contact/update/:id").post(catchErrors(contactController.update))
router.route("/contact/delete/:id").delete(catchErrors(contactController.delete))

//_____________________________________ API for Crypto ____________________________
router.route("/crypto/create").post(catchErrors(cryptoController.create));
router.route("/crypto/read/:id").get(catchErrors(cryptoController.read));
router.route("/crypto/update/:id").post(catchErrors(cryptoController.update));
router.route("/crypto/delete/:id").delete(catchErrors(cryptoController.delete));
router.route("/crypto/search").get(catchErrors(cryptoController.search));
router.route("/crypto/list").get(catchErrors(cryptoController.list));

//____________________________________API coingeko _______________________________
router.route("/marketcap/historycaldata").post(catchErrors(coingeckoHistorycalController.create))
router.route("/coingeko/marketcap/add").post(catchErrors(coingeckoHistorycalController.list))
router.route("/coingeko/create").post(catchErrors(coingeckoHistorycalController.createCoinList))

//____________________________________ API for all price ______________________________
router.route("/allpricecoin/create").post(catchErrors(allCoinPriceController.create))

//____________________________________ API for price ______________________________
router.route("/price/create").post(catchErrors(priceHistoryController.create));
router.route("/price/list").get(catchErrors(priceHistoryController.list));
router.route("/price/update/:id").post(catchErrors(priceHistoryController.update))

//____________________________________ API for Crypto History ______________________
router.route("/cryptohistory/create").post(catchErrors(cryptoHistory.create))
router.route("/cryptohistory/list").get(catchErrors(cryptoHistory.list))
router.route("/cryptohistory/search").get(catchErrors(cryptoHistory.search));

//_____________________________________API for current price________________________
router.route("/coinstatic/create").post(catchErrors(coinStaticController.create))
router.route("/coinstatic/list").get(catchErrors(coinStaticController.list))
router.route("/coinstatic/update/:id").post(catchErrors(coinStaticController.update));

//____________________________________ API for Dynamic token ______________________
router.route("/coindynamic/create").post(catchErrors(coinDynamicController.create))
router.route("/coindynamic/list").get(catchErrors(coinDynamicController.list))

//_____________________________________ API for Newscategory________________________
router.route("/newscategory/create").post(catchErrors(newsCategory.create))
router.route("/newscategory/list").get(catchErrors(newsCategory.list));
router.route("/newscategory/update/:id").post(catchErrors(newsCategory.update));
router.route("/newscategory/delete/:id").delete(catchErrors(newsCategory.delete));
router.route("/newscategory/search").get(catchErrors(newsCategory.search))
router.route("/newscategory/ban/:id").post(catchErrors(newsCategory.banNews));

//____________________________________ API for news ________________________________
router.route("/news/create").post(upload.single("news_picture_url"), catchErrors(newsController.create))
router.route("/news/list").get(catchErrors(newsController.list));
router.route("/news/update/:id").post(upload.single("news_picture_url"), catchErrors(newsController.update))
router.route("/news/read/:id").get(catchErrors(newsController.read))
router.route("/news/search").get(catchErrors(newsController.search))
router.route("/news/delete/:id").delete(catchErrors(newsController.delete));


router.route("/error/list").get(catchErrors(ErrorController.list))
router.route("/error/delete/:id").delete(catchErrors(ErrorController.delete))

//_____________________________________ API for articles ___________________________
router.route("/articles/create").post(upload.fields(articleMedia), catchErrors(articlesController.create));
router.route("/articles/read/:id").get(catchErrors(articlesController.read));
router.route("/articles/update/:id").post(upload.fields(articleMedia), catchErrors(articlesController.update));
router.route("/articles/delete/:id").delete(catchErrors(articlesController.delete));
router.route("/articles/search").get(catchErrors(articlesController.search));
router.route("/articles/list").get(catchErrors(articlesController.list));

//_____________________________________ API for profiles ___________________________
router.route("/profile/create").post(upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), catchErrors(profilesController.create));
router.route("/profile/ban/:id").post(catchErrors(profilesController.banUser));
router.route("/profile/read/:id").get(catchErrors(profilesController.read));
router.route("/profile/update/:id").post(upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), catchErrors(profilesController.update));
router.route("/profile/delete/:id").delete(catchErrors(profilesController.delete));
router.route("/profile/search").get(catchErrors(profilesController.search));
router.route("/profile/list").get(catchErrors(profilesController.list));

module.exports = router;

