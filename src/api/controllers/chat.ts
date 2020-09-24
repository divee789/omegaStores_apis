import { Router, Request, Response, NextFunction } from 'express';
import User from '../../core/database/models/user';
import db from '../../core/database/models';
import authMiddleware from '../middlewares/auth';

class ChatController {
  public path = '/chat';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(authMiddleware());
    this.router.get(this.path, this.getUserConversations);
    this.router.post(`${this.path}/message`, this.sendMessage);
    this.router.get(
      `${this.path}/message`,
      this.getConversationMessages,
    );
  }

  getUserConversations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let user: User;
      const conversations = await user.getConversations({
        include: [
          {
            model: db.user as any,
          },
        ],
      });
      res.json({
        status: true,
        data: {
          conversations,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getConversationMessages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { conversationID } = req.query;
      const messages = await db.message.findAll({
        where: {
          conversation_id: conversationID,
        },
        order: [['createdAt', 'ASC']],
      });
      res.json({
        status: true,
        data: {
          messages,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = res.locals;
      const getConversation = async () => {
        const conversation = await db.conversation.findOne({
          where: {
            userOne: {
              [db.Op.or]: [user.id, req.body.userID],
            },
            userTwo: {
              [db.Op.or]: [user.id, req.body.userID],
            },
          },
          include: [db.conversation.associations.messages],
          order: [
            [
              db.conversation.associations.messages,
              'createdAt',
              'ASC',
            ],
          ],
        });
        if (conversation) {
          return conversation;
        } else {
          const conversation = await db.conversation.create(
            { userOne: user.id, userTwo: req.body.userID },
            {
              include: [db.conversation.associations.messages],
            },
          );
          return conversation;
        }
      };
      const chat = await getConversation();
      await chat.createMessage({
        text: req.body.message,
        sender: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
        },
      });
      const messages = await chat.getMessages({
        order: [['createdAt', 'ASC']],
      });
      res.json({
        status: true,
        data: {
          messages,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default ChatController;
