module.exports = (sequelize, DataTypes) => {
    const DeviceConnection = sequelize.define('DeviceConnection', {
        interfaceAId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'DeviceInterfaces', key: 'id' }
        },
        interfaceBId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'DeviceInterfaces', key: 'id' }
        },
        connectionTypeA: { type: DataTypes.STRING, allowNull: false },
        connectionTypeB: { type: DataTypes.STRING, allowNull: false },
        cableType: { type: DataTypes.STRING, allowNull: false },
        discoveryMethod: { type: DataTypes.STRING, allowNull: false },
        confidenceScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 10 }
        }
    });

    return DeviceConnection;
};
