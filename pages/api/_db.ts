import { DataTypes, Sequelize } from 'sequelize'

export const db = new Sequelize(process.env.DATABASE_CONNECTION_URL, {
  logging: false,
})

db.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'posts',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
)

db.define(
  'content',
  {
    post: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
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
try {
  await db.sync()
} catch (e) {
  console.error(e)
}
