import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { IRoomRepository, IUserRepository } from "../../../repository";

interface AddVideoRoomRequest {
  ownerId: string;
  roomId: string;
  roomLink: string;
}

export class AddVideoRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: AddVideoRoomRequest) {
    const { ownerId, roomId, roomLink } = data;

    const ownerAlreadyExists = await this.userRepository.getUserById(ownerId);

    if (!ownerAlreadyExists) {
      throw new ErrorHandler(400, "User Not Found, try again");
    }

    const roomExists = await this.roomRepository.getById(roomId);

    if (!roomExists) {
      throw new ErrorHandler(400, "Room Not Found, try again");
    }

    const videoRoom = this.roomRepository.createVideoRoom(
      ownerId,
      roomId,
      roomLink
    );

    return videoRoom;
  }
}
