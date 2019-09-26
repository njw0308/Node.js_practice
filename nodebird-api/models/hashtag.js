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
        charset:'utf8', // 한글 사용 가능 하게끔
        collate:'utf8_general_ci', // 한글 사용 가능 하게끔
    })
);