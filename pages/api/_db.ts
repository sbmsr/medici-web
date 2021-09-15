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
  'User',
  {
    publicAddress: {
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
    },
  },
  {
    timestamps: false,
  }
)

db.sync()
