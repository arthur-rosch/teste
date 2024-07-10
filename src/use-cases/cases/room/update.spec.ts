import { InMemoryUserRepository } from '@/repository/in-memory'
import { InMemoryRoomRepository } from '@/repository/in-memory/in-memory-room-repository'
import Chance from 'chance'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { UpdateRoomUseCase } from './update'

const chance = new Chance()

let roomRepository: InMemoryRoomRepository
let userRepository: InMemoryUserRepository
let sut: UpdateRoomUseCase

beforeEach(() => {
  roomRepository = new InMemoryRoomRepository()

  userRepository = new InMemoryUserRepository()

  sut = new UpdateRoomUseCase(roomRepository, userRepository)
})

const data = {
  name: chance.name(),
  userId: chance.string({ numeric: true }),
  roomId: chance.string({ numeric: true }),
}

describe('Update Room Use Case Test', () => {
  it('should update a room successfully', async () => {
    const user = {
      id: chance.guid({ version: 4 }),
      name: chance.name(),
      email: chance.email(),
      phone: chance.phone(),
      gender: chance.gender(),
      password: chance.name(),
      dateBirth: '22/08/2005',
    }

    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)

    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: user.id,
      updatedAt: chance.date(),
      createdAt: chance.date(),
    }

    vi.spyOn(roomRepository, 'getById').mockResolvedValue(room)

    const result = await sut.execute(data.name, data.roomId, data.userId)

    expect(result).toBeUndefined()
    expect(roomRepository.getById).toHaveBeenCalledWith(data.roomId)
    expect(userRepository.getUserById).toHaveBeenCalledWith(data.userId)
  })

  it('should return error, user not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute(data.name, data.roomId, data.userId),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should return error, room not found', async () => {
    const user = {
      id: chance.guid({ version: 4 }),
      name: chance.name(),
      email: chance.email(),
      phone: chance.phone(),
      gender: chance.gender(),
      password: chance.name(),
      dateBirth: '22/08/2005',
    }

    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)

    vi.spyOn(roomRepository, 'getById').mockResolvedValue(null)

    await expect(
      sut.execute(data.name, data.roomId, data.userId),
    ).rejects.toThrow(new ErrorHandler(400, 'Room Not Found, try again'))
  })

  it('should return error, unauthorized user', async () => {
    const user = {
      id: chance.guid({ version: 4 }),
      name: chance.name(),
      email: chance.email(),
      phone: chance.phone(),
      gender: chance.gender(),
      password: chance.name(),
      dateBirth: '22/08/2005',
    }

    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)

    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: chance.string(),
      updatedAt: chance.date(),
      createdAt: chance.date(),
    }

    vi.spyOn(roomRepository, 'getById').mockResolvedValue(room)

    await expect(
      sut.execute(data.name, data.roomId, data.userId),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can update the Room'),
    )
  })
})
