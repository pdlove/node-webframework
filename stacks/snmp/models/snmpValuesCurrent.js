module.exports = (sequelize, DataTypes) => {
    const CurrentSNMPValue = sequelize.define('CurrentSNMPValue', {
        deviceId: { type: DataTypes.INTEGER, allowNull: false },
        oid: { type: DataTypes.STRING, allowNull: false },
        value: { type: DataTypes.STRING, allowNull: false },
        numericChange: { type: DataTypes.FLOAT, allowNull: true }, // For numeric changes
        secondsSinceLastWalk: { type: DataTypes.INTEGER, allowNull: true }, // Time passed since last walk
        isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }, // Mark if deleted in the latest walk
        lastUpdated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    return CurrentSNMPValue;
};
