module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      userID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: true },
      password: { type: DataTypes.STRING, allowNull: false },
      totp_key: { type: DataTypes.STRING, allowNull: true },
      locked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      last_login: { type: DataTypes.DATE, allowNull: true },
    });
    return User;
  };
  
  