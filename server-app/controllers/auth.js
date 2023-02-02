const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require("../connect");

exports.register = (req, res) => {
    // CHECK YSER IF EXIST
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q, [req.body.username], (err, data) => {

        const a = [
            req.body.username, 
            req.body.email,
            req.body.password, 
            req.body.name
        ];

        console.log(a);

        if (err) return res.status(500).json(err);

        if (data.length) return res.status(409).json('User already exists!');

        // CREATE A NEW USER
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = 'INSERT INTO users (username, email, password, name) VALUE(?, ?, ?, ?)';

        const values = [
            req.body.username, 
            req.body.email,
            hashedPassword, 
            req.body.name
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json('User has been created.');
        })
    })
}

exports.login = (req, res) => {

    // CHECK USER IS EXISTS
    const q = 'SELECT * FROM users WHERE username = ?';
    console.log(req.body.username, req.body.password);

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) return res.status(404).json('User not found!');

        // find the user password in db and compare it with get password
        // index 0 is first user that match
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json('Wrong password or username');

        // create token with if and secretKey (not use this)
        const token = jwt.sign({ id: data[0].id }, 'liveSocial');

        const { password, ...others } = data[0];

        // send all data this user accept password
        // but all data is set in token that can access by cookie
        // {
        //     httpOnly: true
        // }
        res.cookie('accessToken', token).status(200).json(others)
    })
}



exports.logout = (req, res) => {
    res.clearCookie('accessToken', {
        secrure: true,
        sameSite: 'none'
    }).status(200).json('User has been logged out')

}
