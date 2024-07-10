import { Server, Socket } from 'socket.io'

export default function chatSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => {})
  })
}
