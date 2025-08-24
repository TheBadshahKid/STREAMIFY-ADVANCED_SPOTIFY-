import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	console.log("🔐 ProtectRoute middleware - Auth check:", {
		auth: req.auth,
		userId: req.auth?.userId,
		sessionId: req.auth?.sessionId,
		headers: {
			authorization: req.headers.authorization ? 'present' : 'missing',
			cookie: req.headers.cookie ? 'present' : 'missing'
		},
		url: req.url,
		method: req.method
	});

	if (!req.auth.userId) {
		console.error("❌ Authentication failed - No userId found");
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	console.log("✅ User authenticated:", req.auth.userId);
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		console.log("🔑 RequireAdmin middleware - Admin check:", {
			userId: req.auth.userId,
			adminEmail: process.env.ADMIN_EMAIL
		});

		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const userEmail = currentUser.primaryEmailAddress?.emailAddress;
		const isAdmin = process.env.ADMIN_EMAIL === userEmail;

		console.log("📄 Admin verification:", {
			userEmail,
			adminEmail: process.env.ADMIN_EMAIL,
			isAdmin
		});

		if (!isAdmin) {
			console.error("❌ Admin access denied - User is not admin");
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		console.log("✅ Admin access granted");
		next();
	} catch (error) {
		console.error("❌ RequireAdmin error:", error);
		next(error);
	}
};
