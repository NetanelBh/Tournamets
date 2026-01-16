import jwt from "jsonwebtoken";
import Session from "../models/session.js";

// 20 minutes
const INACTIVITY_LIMIT = 1000 * 60 * 20;

const authentication = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({ code: "NO_TOKEN" });
		}

		const token = authHeader.split(" ")[1];
		const payload = jwt.verify(token, process.env.JWT_SECRET);
        
		const session = await Session.findById(payload.sessionId);
		if (!session || session.revoked) {
			return res.status(401).json({ code: "SESSION_INVALID" });
		}

		const now = Date.now();

		// ⏰ inactivity check
		if (now - session.lastActivityAt.getTime() > INACTIVITY_LIMIT) {
			session.revoked = true;
			await session.save();
			return res.status(401).json({ code: "SESSION_EXPIRED" });
        }

		// ✅ update activity when the user still send requests
		session.lastActivityAt = new Date();
		await session.save();

		req.user = payload.id;
		req.sessionId = payload.sessionId;

		next();
	} catch (error) {
		return res.status(401).json({ code: "INVALID_TOKEN" });
	}
};

export default authentication;
