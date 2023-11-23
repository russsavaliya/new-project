const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
const promisify = require("es6-promisify");
const morgan = require('morgan')

var cors = require('cors')
const mongoose = require("mongoose")
const apiRouter = require("./routes/api");
const authApiRouter = require("./routes/authApi");
const userApiRouter = require("./routes/user")

const errorHandlers = require("./handlers/errorHandlers");
const google = require("./routes/google")
const facebook = require("./routes/facebook")
const { isValidToken } = require("./controllers/authController");



// create our Express app
const app = express();
app.use(morgan('dev'))

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, "public")));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions allow us to Contact data on visitors from request to request
// This keeps admins logged in and allows us to send flash messages
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
  })
);


// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});


NODE_IMAGE_PATH = path.join(__dirname, "public/uploads/admin/")
app.get("/uploads/:image", (req, res) => {
  if (req.params.image) {
    res.sendFile(
      path.resolve(
        NODE_IMAGE_PATH,
        req.params.image
      )
    )
  }
});


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
//1

app.post("/api/news/image", upload.single("image"), (req, res) => {
  try {
    console.log(req.file);
    res.send("hello")
  } catch (error) {

  }
})

// Here our API Routes
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
//   res.header("Access-Control-Expose-Headers", "Content-Length");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
//   );
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   } else {
//     return next();
//   }
// });



app.use("/api", authApiRouter);
app.use("/api/user", userApiRouter)
app.use("/", google)
app.use("/", facebook)
// for development & produserApiRouterction don't use this line app.use("/api", apiRouter); , this is just demo login contoller
//app.use("/api", apiRouter);

//uncomment line below // app.use("/api", isValidToken, apiRouter);
app.use("/api", isValidToken, apiRouter);


// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port 8080`)
})

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;


