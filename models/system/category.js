module.exports = (sequelize, DataTypes) => {
    //Category
    const Category = sequelize.define('Category', {
        categoryID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
        parent_categoryID: { type: DataTypes.INTEGER, allowNull: true }, 
        tabletype: { type: DataTypes.STRING, allowNull: false, defaultValue: "Products" },
        name: { type: DataTypes.STRING, allowNull: false }
    });

    return Category;
}

