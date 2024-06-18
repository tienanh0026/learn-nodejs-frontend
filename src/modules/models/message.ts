type Message = {
  id: string;
  ownerId: string;
  roomId: string;
  content: string;
  createdAt: string;
  updatedAt: Date;
  deletedAt?: Date;
};

export type { Message };
