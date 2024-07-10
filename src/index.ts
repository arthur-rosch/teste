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

const startServer = () => {
  return new Promise((resolve, reject) => {
    httpServer.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`)
      resolve(httpServer)
    }).on('error', (error: any) => {
      console.log(`Ocorreu um erro: ${error.message}`)
      reject(error)
    })
  })
}

export default startServer
