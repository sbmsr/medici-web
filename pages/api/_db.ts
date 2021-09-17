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
  'users',
  {
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: { isEthereumAddress: ethers.utils.isAddress },
      primaryKey: true,
    },
    nonce: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: () => Math.floor(Math.random() * 1000000), // Initialize with a random nonce
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'roles',
  {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'user_roles',
  {
    address: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'address',
      },
    },
    role: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'stores',
  {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contractAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'address',
      },
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
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'galleries',
  {
    store: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id',
      },
      primaryKey: true,
    },
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
)

db.sync()
