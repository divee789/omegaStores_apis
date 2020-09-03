import {
  sequelize,
  Model,
  DataTypes,
  Association,
  Optional,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
} from './sequelize-config';
import Message from './message';
import { HasManyCreateAssociationMixin } from 'sequelize/types';

export interface ConversationAttributes {
  id: string;
  userOne: string;
  userTwo: string;
}

interface ConversationCreationAttributes
  extends Optional<ConversationAttributes, 'id'> {}

class Conversation
  extends Model<
    ConversationAttributes,
    ConversationCreationAttributes
  >
  implements ConversationAttributes {
  public id!: string;
  public userOne!: string;
  public userTwo!: string;

  public addMessage!: HasManyAddAssociationMixin<Message, string>;
  public getMessages!: HasManyGetAssociationsMixin<Message>;
  public createMessage!: HasManyCreateAssociationMixin<Message>;

  public readonly messages: Message[];

  public static associations: {
    messages: Association<Conversation, Message>;
  };

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userOne: {
      type: DataTypes.UUID,
    },
    userTwo: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    tableName: 'conversations',
  },
);

Conversation.hasMany(Message, {
  sourceKey: 'id',
  foreignKey: 'conversation_id',
  as: 'messages',
  onDelete: 'cascade',
});

export default Conversation;
