const {
    OAuth2Client
} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');

exports.google = async function(req, res) {
    const ticket = await client.verifyIdToken({
        idToken: req.body.it
    });
    const payload = ticket.getPayload();
    const userid = payload['sub']; //21자리의 Google 회원 id 번호
    console.log(ticket);
    //         connection.execute('SELECT `TOKEN` FROM `innoboost_user` WHERE `ID`= ?', [userid], (err, results) => {
    //             if (err) throw err;
    //             let token = '';
    //             if (results.length > 0) {
    //                 console.log('DB에 있는 유저', results);
    //                 token = updateToken(payload);
    //             } else {
    //                 console.log('DB에 없는 유저');
    //                 //새로 유저를 만들면 jwt 토큰값을 받아온다.
    //                 token = insertUserIntoDB(payload);
    //             }
    //             res.send({
    //                 token
    //             });
    //         });
    //     }
    //     verify().then(() => {}).catch(console.error);
};

const updateToken = (payload) => {
    const {
        sub,
        name,
        email
    } = payload;
    console.log(`id: ${sub}\n name:${name}\n, email:${email}`);
    const token = jwt.sign({
            id: sub,
            name,
            email
        },
        JWT_SECRET
    );

    connection.execute('UPDATE `innoboost_user` SET `TOKEN`= ? WHERE (`ID`= ?)', [token, sub], (err, results) => {
        console.log(results)
    });
    return token;
}

const insertUserIntoDB = (payload) => {
    const {
        sub,
        name,
        email
    } = payload;
    console.log(`id: ${sub}\n name:${name}\n, email:${email}`);
    const token = jwt.sign({
            id: sub,
            name,
            email
        },
        JWT_SECRET
    );

    connection.execute(
        'INSERT INTO `innoboost_user` (ID, EMAIL, NAME, TOKEN) VALUES (?, ?, ?, ?)', [sub, email, name, token],
        (err, results, fields) => {
            if (err) {
                console.log('fail');
                throw err;
            }

        }
    );
    return token;
};