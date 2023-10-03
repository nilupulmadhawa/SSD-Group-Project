import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    //CHECK EXISTING USER
    const q = "SELECT * FROM users WHERE email = '" + req.body.email + "' OR username = '" + req.body.username + "'";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!");

        //Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES ('" + req.body.username + "','" + req.body.email + "','" + hash + "')";

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    });
};

export const login = (req, res) => {
    //CHECK USER

    const q = "SELECT * FROM users WHERE username = '" + req.body.username + "'";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        //Check password
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );

        if (!isPasswordCorrect)
            return res.status(400).json("Wrong username or password!");

        const token = jwt.sign({ id: data[0].id }, "jwtkey");
        const { password, ...other } = data[0];

        res
            .cookie("access_token", token)
            .status(200)
            .json(other);
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token").status(200).json("User has been logged out.")
};
