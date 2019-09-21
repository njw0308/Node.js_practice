module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nick : {
            type: DataTypes.STRING(15),
            allowNull: false,
        }, 
        // 카카오로 가입하는 경우 null 일 수 있으니까.
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        // local 로 가입을 했는지, kakao 로 가입을 했는지.
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        // 카카오로 로그인 하는 경우에만.
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        }
    }, {
        timestamps: true,
        paranoid: true,
        charset:'utf8', // 한글 사용 가능 하게끔
        collate:'utf8_general_ci', // 한글 사용 가능 하게끔
    })

);