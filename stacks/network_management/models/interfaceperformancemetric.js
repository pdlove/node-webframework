module.exports = (sequelize, DataTypes) => {
    const InterfacePerformanceMetric = sequelize.define('InterfacePerformanceMetric', {
        deviceInterfaceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'DeviceInterfaces', key: 'id' }
        },
        inOctets: { type: DataTypes.BIGINT, allowNull: false },
        outOctets: { type: DataTypes.BIGINT, allowNull: false },
        inUcastPkts: { type: DataTypes.BIGINT, allowNull: false },
        outUcastPkts: { type: DataTypes.BIGINT, allowNull: false },
        highSpeed: { type: DataTypes.BOOLEAN, allowNull: false },
        timestamp: { type: DataTypes.DATE, allowNull: false }  // Timestamp for the metrics
    });

    return InterfacePerformanceMetric;
};
