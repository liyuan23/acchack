require("dotenv").config({ silent: true })
const port = 3000
const dbUrl = "mongodb://127.0.0.1:27017/acchack"

// installing all modules
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const passport = require("./config/ppConfig")
const app = express()

//helpers
const { hasLoggedOut, isLoggedIn, compare } = require("./helpers")

//models
const User = require("./models/user")

const register_routes = require("./routes/register_routes")
const login_routes = require("./routes/login_routes")

//middlewares
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(express.static(path.join(__dirname, "public")))
app.use(function(req, res, next) {
  console.log("Method: " + req.method + " Path: " + req.url)
  next()
})

app.use(methodOverride("_method"))

// initialize mongoose and mongodb
mongoose.connect(dbUrl, {
  useMongoClient: true
})
mongoose.Promise = global.Promise

//sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

//passport initialize
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  app.locals.user = req.user
  next()
})

//routes
app.get("/", (req, res) => {
  console.log("running")
  User.find()
    .then(users => {
      res.render("index", {
        users
      })
    })
    .catch(err => {
      console.log(err)
    })
})

app.get("/logout", hasLoggedOut, (req, res) => {
  req.logout()
  res.redirect("/")
})

app.use("/register", isLoggedIn, register_routes)
app.use("/login", isLoggedIn, login_routes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
