const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const web = require('../modules/slack').slack();

const { user, schoolCode } = require('../models');

exports.signup = async function(req, res) {
    try {
        const param = Joi.object({
            schoolCode: Joi.string().required(),
            grade: Joi.number().integer().required(),
            class: Joi.number().integer().required(),
            number: Joi.number().integer().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            studentName: Joi.string().required()
        });
        if (param.validate(req.body).error) {
            res.status(400).send({
                message: '공란이 존재합니다.'
            })
        }

        const {
            schoolCode: school_code,
            grade,
            class: _class,
            studentName: student_name,
            number,
            email,
            password
        } = req.body;

        const code = await schoolCode.findOne({
            where: {
                code: school_code
            },
            attributes: ['code', "name"]
        });

        const result = await user.findOne({
            where: {
                email
            },
            attributes: ['email']
        });

        if (result != null) return res.status(400).send({
            message: "이메일이 중복된 사용자가 있습니다"
        });

        const result_another = await user.findOne({
            where: {
                grade,
                number,
                class: _class
            },
            attributes: ['email']
        });

        if (result_another != null) return res.status(400).send({
            message: "이미 가입된 학년 반 번호입니다"
        });
        const hash = await bcrypt.hash(password, 10);
        const create_row = await user.create({
            student_name: student_name,
            school_name: code.dataValues.name,
            grade: grade,
            class: _class,
            number: number,
            email: email,
            pw_hash: hash
        }).then(result => {
            res.status(200).send({
                message: "회원가입을 성공하였습니다"
            })
        }).catch(err => {
            res.status(500).send({
                message: "회원가입을 하지 못하였습니다"
            })
        });

    } catch (error) {

        res.status(500).send({
            message: "서버에서 오류가 발생하였습니다."
        })
    }
};


exports.register = async(req, res) => {
    const {
        email,
        name,
        phonenumber,
        password,
    } = req.body;
    const passportUser = AuthHandler.getPassportSession(req);
    const passportEmail = (passportUser) ? passportUser['email'] : undefined;

    try {
        if (passportEmail) {
            AuthHandler.validateCheck(undefined, String(phonenumber), String(passportEmail));
        } else {
            AuthHandler.validateCheck(String(password), String(phonenumber), String(email));
        }

        const updateData = {
            email: (!passportEmail) ? email : passportEmail,
            name,
            phonenumber,
            verify_email: !!passportEmail,
            password: (!passportEmail) ? sha256(password) : undefined,
            admin: false,
        };
        const result = await Users.findOne({ where: { email: updateData.email } });
        if (result) {
            throw new errorHandler.CustomError(errorHandler.STATUS_CODE.alreadyRegistered);
        }
        await Users.create(updateData);
        // local register
        if (!passportEmail) {
            const token = randomstring.generate();
            await EmailToken.create({
                email,
                token,
                send_count: 1,
            });
            // send email for verifying
            await EmailService.send(
                [email],
                constants.ADMIN_EMAIL,
                VERIFY_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
                VERIFY_TEMPLATE.subject,
            );
            const query = SCHEDULE_TEMPLATE.create
                .replace('{eventName}', `${email.replace('@', '_').replace('.', '_')}`)
                .replace('{days}', '2')
                .replace('{query}', `DELETE FROM Users WHERE (email = "${email}");`);
            await db.query(query);
        }
        // for resending token request
        if (req.session) {
            req.session.register = true;
            req.session.email = email;
        }
        res.send({ statusCode: errorHandler.STATUS_CODE.success });
    } catch (error) {
        if (error instanceof errorHandler.CustomError) {
            res.send(error.getData());
        } else {
            log.error(error);
            await Slack.send('error', JSON.stringify(error));
            res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
        }
    }
};