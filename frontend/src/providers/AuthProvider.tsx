import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	console.log("🔑 Updating API token:", token ? 'Token present' : 'No token');
	if (token) {
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		console.log("✅ Authorization header set");
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
		console.log("❌ Authorization header removed");
	}
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId, isLoaded, isSignedIn } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	// Set up axios interceptor for automatic token attachment
	useEffect(() => {
		const requestInterceptor = axiosInstance.interceptors.request.use(
			async (config) => {
				console.log("🚀 Making request to:", config.url);
				try {
					if (isSignedIn) {
						const token = await getToken();
						if (token) {
							config.headers.Authorization = `Bearer ${token}`;
							console.log("✅ Fresh token attached to request");
						} else {
							console.log("⚠️ No token available for signed-in user");
						}
					} else {
						console.log("⚠️ User not signed in");
					}
				} catch (error) {
					console.error("❌ Error getting token for request:", error);
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Cleanup interceptor
		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
		};
	}, [getToken, isSignedIn]);

	useEffect(() => {
		const initAuth = async () => {
			console.log("🚀 Initializing auth...", {
				isLoaded,
				isSignedIn,
				userId
			});

			if (!isLoaded) {
				console.log("⏳ Clerk not loaded yet, waiting...");
				return;
			}

			try {
				if (isSignedIn) {
					const token = await getToken();
					console.log("🎫 Token retrieved:", token ? 'Success' : 'Failed');
					updateApiToken(token);
					if (token) {
						await checkAdminStatus();
						// init socket
						if (userId) initSocket(userId);
					}
				} else {
					console.log("⚠️ User not signed in");
					updateApiToken(null);
				}
			} catch (error: any) {
				updateApiToken(null);
				console.error("❌ Error in auth provider:", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket, isLoaded, isSignedIn]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
