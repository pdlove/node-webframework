module.exports = (sequelize, DataTypes) => {
    const HistoricalSNMPValue = sequelize.define('HistoricalSNMPValue', {
        deviceId: { type: DataTypes.INTEGER, allowNull: false },
        oid: { type: DataTypes.STRING, allowNull: false },
        previousValue: { type: DataTypes.STRING, allowNull: false },
        newValue: { type: DataTypes.STRING, allowNull: false },
        changeType: { type: DataTypes.ENUM('changed', 'deleted', 'added'), allowNull: false }, // Track the type of change
        numericChange: { type: DataTypes.FLOAT, allowNull: true }, // For numeric changes
        secondsSinceLastWalk: { type: DataTypes.INTEGER, allowNull: true }, // Time passed since last walk
        changedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    return HistoricalSNMPValue;
};
