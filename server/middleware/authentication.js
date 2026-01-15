import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {    
	try {
		if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];  
			const payload = jwt.verify(token, process.env.JWT_SECRET);  
                      
            if (!payload) {
                res.send({ status: false, data: "שגיאת אימות" });
                return;
            } 
            
            req.user = payload;
            next();
		} else {
            res.send({ status: false, data: "שגיאת אימות" });
        }
	} catch (error) {
		res.send({ status: false, data: "פג תוקף החיבור, נא להתחבר מחדש" });
	}
};
export default authentication;
