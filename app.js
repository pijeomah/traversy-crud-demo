const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan =  require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
//Load config
 dotenv.config({path: './config/.env'})

 //Passport config 
require('./config/passport')(passport)


 //Logging
 const app = express()
 if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
 }
//
 
app.engine('.hbs', exphbs.engine({
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
  })
)


//passport middleware
app.use(passport.initialize())
app.use(passport.session())
 //Routes
 app.use('/', require('./routes/index'))
 app.use('/auth', require('./routes/auth'))
 //app.use('/dashboard', require('./routes/index'))




const PORT = process.env. PORT || 3000
app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))