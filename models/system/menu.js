module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define("Menu", {
        menuID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        iconText: { type: DataTypes.STRING, allowNull: true },
        iconClass: { type: DataTypes.STRING, allowNull: true },
        parent_menu_id: { type: DataTypes.INTEGER, allowNull: true },
        external_link: { type: DataTypes.STRING, allowNull: true },
        panel: { type: DataTypes.STRING, allowNull: true },
        panel_parameters: { type: DataTypes.JSON, allowNull: true },
        enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        debug: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        production: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    });

     return Menu
}