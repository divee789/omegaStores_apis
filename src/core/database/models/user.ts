import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';
import { Product } from './product';

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image_url: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public image_url: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public getProducts!: HasManyGetAssociationsMixin<Product>;
  public addProduct!: HasManyAddAssociationMixin<Product, number>;
  public hasProduct!: HasManyHasAssociationMixin<Product, number>;
  public countProducts!: HasManyCountAssociationsMixin;
  public createProduct!: HasManyCreateAssociationMixin<Product>;

  public readonly products?: Product[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associate: {
    products: Association<User, Product>;
  };
}

export function instantiateUser(sequelize: Sequelize) {
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
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
  });

  return User;
}
