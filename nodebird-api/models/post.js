module.exports = (sequelize, Datatypes) => (
    sequelize.define('post',{
        content: {
            type: Datatypes.STRING(140),
            allowNull: false,
        },
        // 이미지 주소를 올릴 것임. 이미지를 서버에 저장해두고. 서버에 저장을 해두면 주소가 생기는데, 그 주소를 디비에 저장해서 불러올 수 있게끔.
        img: {
            type: Datatypes.STRING(200),
            allowNull: true,
        }
    }, {
        timestamps: true,
        paranoid: true,
        charset:'utf8', // 한글 사용 가능 하게끔
        collate:'utf8_general_ci', // 한글 사용 가능 하게끔
    })
);