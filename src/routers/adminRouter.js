import express from 'express'
import Debug from 'debug'
import mongodb from 'mongodb'

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

// mongodb+srv://shinichiokada:<password>@cluster0.sabpl.mongodb.net/?retryWrites=true&w=majority

export { adminRouter }