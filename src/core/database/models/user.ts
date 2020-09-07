import {
  sequelize,
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  Association,
} from './sequelize-config';
import Conversation from './conversation';
import Product, { ProductAttributes } from './product';

interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified?: boolean;
  email_verification_token: string;
  password: string;
  image_url?: string;
  facebook?: string;
  twitter?: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public email_verified: boolean;
  public email_verification_token!: string;
  public password!: string;
  public image_url: string;
  public facebook: string;
  public twitter: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public getProducts!: HasManyGetAssociationsMixin<Product>;
  public addProduct!: HasManyAddAssociationMixin<Product, string>;
  public hasProduct!: HasManyHasAssociationMixin<Product, string>;
  public countProducts!: HasManyCountAssociationsMixin;
  public createProduct!: HasManyCreateAssociationMixin<
    ProductAttributes
  >;
  public removeProduct!: HasManyRemoveAssociationMixin<
    Product,
    string
  >;
  public getConversations!: HasManyGetAssociationsMixin<Conversation>;

  public readonly products?: Product[];
  public readonly conversations?: Conversation[];

  public static associations: {
    products: Association<User, Product>;
    conversations: Association<User, Conversation>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email_verification_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

User.hasMany(Product, {
  sourceKey: 'id',
  foreignKey: 'owner_id',
  as: 'products', // this determines the name in `associations`!
  onDelete: 'CASCADE',
});

User.hasMany(Conversation, {
  sourceKey: 'id',
  foreignKey: 'userOne',
});

User.hasMany(Conversation, {
  sourceKey: 'id',
  foreignKey: 'userTwo',
});

export default User;
