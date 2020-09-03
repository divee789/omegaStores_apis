import {
  Model,
  DataTypes,
  sequelize,
  Optional,
} from './sequelize-config';

export interface MessageAttributes {
  id: string; // id is an auto-generated UUID
  text: string;
  sender: any;
  conversation_id: string;
}

interface MessageCreationAttributes
  extends Optional<MessageAttributes, 'id'> {}

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes {
  public id!: string;
  public text!: string;
  public sender!: {};
  public conversation_id: string;

  // public static createMessage(
  //   text: string,
  //   sender: { name: string; id: string },
  //   receiver: { id: string },
  //   conversation: typeof Conversation,
  // ) {
  //   return Promise.all([
  //     this.create({
  //       text,
  //       sender: {
  //         id: sender.id,
  //         name: sender.name,
  //       },
  //     }),
  //     conversation.findOrCreateConversation(sender.id, receiver.id),
  //   ]).then(([message, conversation]) => {
  //     conversation.addMessage(message);
  //   });
  // }

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.TEXT,
      allowNull: false,
      get: function () {
        return JSON.parse(this.getDataValue('sender'));
      },
      set: function (value) {
        this.setDataValue('sender', JSON.stringify(value));
      },
    },
    conversation_id: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    tableName: 'messages',
  },
);

export default Message;
