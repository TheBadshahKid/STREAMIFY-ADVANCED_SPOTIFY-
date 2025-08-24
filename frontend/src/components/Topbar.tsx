import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useResponsive } from "@/hooks/useResponsive";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	const { isMobile, isTablet } = useResponsive();
	console.log({ isAdmin });

	return (
		<div className={cn(
			'flex items-center justify-between sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10',
			isMobile ? 'px-3 py-2' : 'px-4 py-4'
		)}>
			{/* Logo and Brand */}
			<div className='flex gap-2 items-center min-w-0 flex-shrink-0'>
				<img 
					src='/streamify.jpeg' 
					className={cn(
						'flex-shrink-0',
						isMobile ? 'size-6' : 'size-8'
					)} 
					alt='Streamify logo' 
				/>
				<span className={cn(
					'font-semibold text-white truncate',
					isMobile ? 'text-sm' : 'text-base'
				)}>Streamify</span>
			</div>

			{/* Actions */}
			<div className={cn(
				'flex items-center',
				isMobile ? 'gap-2' : 'gap-4'
			)}>
				{/* Admin Dashboard Link */}
				{isAdmin && (
					<Link 
						to={"/admin"} 
						className={cn(
							buttonVariants({ 
								variant: "outline",
								size: isMobile ? "sm" : "default"
							}),
							'flex-shrink-0'
						)}
					>
						{isMobile ? (
							<LayoutDashboardIcon className='size-4' />
						) : (
							<>
								<LayoutDashboardIcon className='size-4 mr-2' />
								{!isTablet && <span>Admin Dashboard</span>}
								{isTablet && <span>Admin</span>}
							</>
						)}
					</Link>
				)}

				{/* Sign In Buttons */}
				<SignedOut>
					<div className='flex-shrink-0'>
						<SignInOAuthButtons />
					</div>
				</SignedOut>

				{/* User Button */}
				<div className='flex-shrink-0'>
					<UserButton 
						appearance={{
							elements: {
								avatarBox: cn(
									isMobile ? 'w-8 h-8' : 'w-9 h-9'
								)
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
};
export default Topbar;
