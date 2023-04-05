const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan =  require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')

//Load config
 dotenv.config({path: './config/.env'})

 //Passport config 
require('./config/passport')(passport)


 //Logging
 const app = express()

 //Body Parser
 app.use(express.urlencoded({extended: false}))
 app.use(express.json())
 
 if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
 }
//
//Handlebars Helpers
const {formatDate, stripTags, truncate, editIcon} = require('./helpers/hbs')



 //Handlebars engine
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
    },
    defaultLayout : "main",
    extname:  '.hbs'
    })
)

//Static Folders
//path.join not really needed
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'hbs')
 connectDB()
//sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
  })
)


//passport middleware
app.use(passport.initialize())
app.use(passport.session())
 //Routes
 app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
 //app.use('/dashboard', require('./routes/index'))




const PORT = process.env. PORT || 3000
app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))