import { sequelize, Model, DataTypes } from './sequelize-config';
import User from './user';

export interface ProductAttributes {
  id: string; // id is an auto-generated UUID
  name: string;
  price: string;
  owner_id: string;
  image_url: string;
  description: string;
  category: string;
  contact: string;
}

class Product
  extends Model<ProductAttributes>
  implements ProductAttributes {
  public id!: string;
  public name!: string;
  public price!: string;
  public owner_id!: string;
  public image_url: string;
  public description!: string;
  public category!: string;
  public contact!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://connectnigeria.com/articles/wp-content/uploads/2016/07/product-launch-2.jpg',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
  },
);

export default Product;
