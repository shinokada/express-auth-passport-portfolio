import express from 'express'
import chalk from 'chalk'
import Debug from 'debug'
import morgan from 'morgan'
import path from 'path'
// import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import passport from 'passport'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { isAuth } from './src/middleware/isAuth.js';
import { projectsRouter } from './src/routers/projectsRouter.js'
import { adminRouter } from './src/routers/adminRouter.js'
import { authRouter } from './src/routers/authRouter.js'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const debug = Debug('app')
const PORT = process.env.PORT || 3000;
const secret = process.env.SECRET || 'secret123'

// middleware
app.use(morgan('tiny')) // or combined
// To solve the "__dirname is not defined in ES module scope" error, import and use the dirname() method from the path module.
// We used the fileURLToPath method from the url module to get the filename.
// The fileURLToPath method returns the fully-resolved, platform-specific Node.js file path.
// The import.meta object contains context-specific metadata for the module, e.g. the module's URL.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '/public/'))) // serve from static
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// set view engine and view path
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ secret }))
// must import and initialize after cookieParser and session
import passportConfig from './src/config/passport.js'
passportConfig(app)
// must be after session middleware
app.use(isAuth);

app.use('/projects', projectsRouter)
app.use('/admin', adminRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.render('index', { title: 'Awesome Portfolio', data: ['a', 'b', 'c'] })
})

app.listen(PORT, () => {
  debug(`listening on port ${chalk.green(PORT)}`)
})