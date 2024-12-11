//11-12-2024
const crypto=require("crypto");

exports.senderror = (res, error, statusCode = 401) => {

    res.status(statusCode).json({ error });
};
//11-12-2024(5:26pm)
exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {

        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);

            const buffString = buff.toString("hex");
            console.log(buffString);
            resolve(buffString);
        });
});


};
