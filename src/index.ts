import cors from 'cors'
import axios from 'axios'
import { createServer } from 'http'
import { router } from './routes/route'
import { Server } from 'socket.io'
import chatSocket from './websocket/chatSocket'
import express, { Application, Request, Response, NextFunction } from 'express'
import { ErrorHandler, handleError } from './http/middleware/errorResponse'

const app: Application = express()
app.use(cors())
const port = 3003

const httpServer = createServer(app)

export const io = new Server(httpServer)
chatSocket(io)

const start = async () => {
  app.use(express.json())
  app.use(router)
  app.use(
    (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
      handleError(err, req, res, next)
    },
  )
  app.use(express.urlencoded({ extended: true }))
  app.set('trust proxy', true)
  app.disable('etag')

  axios.interceptors.request.use((request) => {
    request.maxContentLength = Infinity
    request.maxBodyLength = Infinity
    return request
  })

  try {
    httpServer.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  } catch (error: any) {
    console.log(`Error occurred: ${error.message}`)
  }
}

start()
