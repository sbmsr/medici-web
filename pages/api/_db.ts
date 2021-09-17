import { ethers } from 'ethers'
import { DataTypes, Sequelize } from 'sequelize'

export const db = new Sequelize(process.env.DATABASE_CONNECTION_URL, {
  logging: false,
})

export interface User {
  publicAddress: string
  nonce: number
  username: string
}

db.define(
  'stores',
  {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      primaryKey: true,
      unique: true,
    },
    contractAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      unique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEthereumAddress: ethers.utils.isAddress },
      primaryKey: true,
      unique: true,
    },
    store: {
      type: DataTypes.INTEGER,
      validate: { isEthereumAddress: ethers.utils.isAddress },
      references: {
        model: 'stores',
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'galleries',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      unique: true,
      primaryKey: true,
    },
    store: {
      type: DataTypes.INTEGER,
      references: {
        model: 'stores',
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'images',
  {
    gallery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'galleries',
        key: 'id',
      },
      primaryKey: true,
    },
    url: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
)

db.sync()
