const { db } = require("../connect");
const jwt = require('jsonwebtoken');

exports.getUser = (req, res) => {
    const userId = req.params.userId;
    
    // find from all user that return user that match with id
    const q = 'SELECT * FROM users WHERE id = ?';

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);

        const { password, ...info} = data[0];
        return res.status(200).json(info)
    });
}


exports.updateUser = (req, res) => {
    const token = req.cookies.accessToken;

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can update own prfile
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');

        const q = 
            "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `coverPic` = ?, `profilePic` = ? WHERE id = ?";

        db.query(
            q, 
            [
                req.body.name,
                req.body.city,
                req.body.website,
                req.body.coverPic,
                req.body.profilePic,
                userInfo.id,
            ],
            (err, data) => {
                if (err) return res.status(500).json(err);

                // some row is change
                if (data.affectedRows > 0) return res.status(200).json("Updated!");

                return res.status(403).json("You can update only your post!");
            }
        )        
    })
}