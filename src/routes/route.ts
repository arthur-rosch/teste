import { Router } from 'express'
import { authenticateUser } from '../http/middleware/authenticateUser'
import {
  ChangePassword,
  SendEmailToken,
  ValidEmailToken,
  addUserInProject,
  addUserToRoomController,
  addVideoRoom,
  createAnnotation,
  createProject,
  createRoomController,
  createTask,
  createUser,
  deleteAnnotation,
  deleteProject,
  deleteRoomController,
  deleteTask,
  deleteUser,
  editUser,
  getAllMessages,
  getByIdAnnotation,
  getByUserId,
  getMessagesByChatId,
  getMessagesByUserId,
  getProjectsByUserId,
  getRoomByIdController,
  getUsers,
  loginUser,
  removeUserInProject,
  removeUserToRoomController,
  sendMessage,
  updateRoomController,
  updateStatusPrivacy,
  updateTaskStatus,
} from '../http/controller'

const router = Router()

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)
router.patch('/editUser', authenticateUser, editUser)
router.delete('/deleteUser', authenticateUser, deleteUser)
router.get('/users', authenticateUser, getUsers)

router.post('/validEmail', ValidEmailToken)
router.post('/sendEmailToken', SendEmailToken)
router.patch('/changePassword', ChangePassword)

router.post('/sendMessage', authenticateUser, sendMessage)
router.get('/allMessages', authenticateUser, getAllMessages)
router.get('/messagesByChatId/:chatId', authenticateUser, getMessagesByChatId)
router.get('/messagesByUserId/:userId', authenticateUser, getMessagesByUserId)

router.post('/createTask', authenticateUser, createTask)
router.delete('/deleteTask', authenticateUser, deleteTask)
router.patch('/updateTaskStatus', authenticateUser, updateTaskStatus)

router.patch('/addUserProject', authenticateUser, addUserInProject)
router.post('/createProject', authenticateUser, createProject)
router.delete('/deleteProject', authenticateUser, deleteProject)
router.get('/projectsByUserId', authenticateUser, getProjectsByUserId)
router.delete('/removeUserInProject', authenticateUser, removeUserInProject)
router.patch('/updateStatusPrivacy', authenticateUser, updateStatusPrivacy)

router.post('/addUserToRoom', authenticateUser, addUserToRoomController)
router.post('/addVideoRoom', authenticateUser, addVideoRoom)
router.post('/createRoom', authenticateUser, createRoomController)
router.delete('/deleteRoom/:roomId', authenticateUser, deleteRoomController)
router.get('/getRoomById/:roomId', authenticateUser, getRoomByIdController)
router.delete('/deleteUserToRoom', authenticateUser, removeUserToRoomController)
router.patch('/updateRoom', authenticateUser, updateRoomController)

router.post('/createAnnotation', authenticateUser, createAnnotation)
router.delete('/deleteAnnotation', authenticateUser, deleteAnnotation)
router.get(
  '/getAnnotationById/:annotationId',
  authenticateUser,
  getByIdAnnotation,
)
router.get('/getAnnotationByUserId/:userId', authenticateUser, getByUserId)

export { router }
