module.exports = (sequelize, Datatypes) => (
    sequelize.define('hashtag' ,{
        title: {
            type: Datatypes.STRING(15),
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: true,
        paranoid: true,
    })
);