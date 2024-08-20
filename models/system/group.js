module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
    groupID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },        
    name: { type: DataTypes.STRING, allowNull: false },
    permissions: { type: DataTypes.STRING, allowNull: false },
    added_by_user_id: { type: DataTypes.INTEGER, allowNull: false }
    });
    
    return Group;
}

