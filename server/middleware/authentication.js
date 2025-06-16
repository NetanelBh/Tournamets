import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
	try {
		if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];    
			const decode = jwt.verify(token, process.env.JWT_SECRET);            
            if (decode) {
                req.user = decode;
                next();
            } else {
                res.send({ status: false, data: "שגיאת אימות" });
            }
		} else {
            res.send({ status: false, data: "שגיאת אימות" });
        }
	} catch (error) {
		res.send({ status: false, data: "נא להתחבר" });
	}
};
export default authentication;
