import { Sequelize, Model, DataTypes } from 'sequelize';

interface ProductAttributes {
  id?: string; // id is an auto-generated UUID
  name: string;
  price: string;
  image_url: string;
  description: string;
  category: string;
}

export class Product
  extends Model<ProductAttributes>
  implements ProductAttributes {
  public id!: string;
  public name!: string;
  public price!: string;
  public image_url: string;
  public description!: string;
  public category: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function instantiateProduct(sequelize: Sequelize) {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'products',
    },
  );

  return Product;
}
