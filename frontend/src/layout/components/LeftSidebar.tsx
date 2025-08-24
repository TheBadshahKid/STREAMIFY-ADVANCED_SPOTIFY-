import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { isMobile, isTablet, breakpoint } = useResponsive();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	console.log({ albums });

	return (
		<div className={cn(
			'h-full flex flex-col gap-2',
			isMobile ? 'px-2 py-1' : 'p-0'
		)}>
			{/* Navigation menu */}
			<div className={cn(
				'rounded-lg bg-zinc-900',
				isMobile ? 'p-2' : 'p-4'
			)}>
				<div className={cn(
					'space-y-1',
					isMobile ? 'flex flex-col items-center space-y-2' : 'space-y-2'
				)}>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: cn(
									"text-white hover:bg-zinc-800 transition-colors",
									isMobile ? "w-8 h-8 p-0 justify-center" : "w-full justify-start"
								),
							}),
							'group relative'
						)}
						title={isMobile ? "Home" : ""}
					>
						<HomeIcon className={cn(
							'size-5 flex-shrink-0',
							isMobile ? '' : 'mr-2'
						)} />
						{!isMobile && <span>Home</span>}
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: cn(
										"text-white hover:bg-zinc-800 transition-colors",
										isMobile ? "w-8 h-8 p-0 justify-center" : "w-full justify-start"
									),
								}),
								'group relative'
							)}
							title={isMobile ? "Messages" : ""}
						>
							<MessageCircle className={cn(
								'size-5 flex-shrink-0',
								isMobile ? '' : 'mr-2'
							)} />
							{!isMobile && <span>Messages</span>}
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			{!isMobile && (
				<div className='flex-1 rounded-lg bg-zinc-900 p-4 min-h-0'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center text-white'>
							<Library className='size-5 mr-2 flex-shrink-0' />
							<span className={cn(
								'font-medium',
								isTablet ? 'text-sm' : 'text-base'
							)}>Playlists</span>
						</div>
					</div>

					<ScrollArea className='h-full max-h-[calc(100vh-280px)]'>
						<div className='space-y-1'>
							{isLoading ? (
								<PlaylistSkeleton />
							) : (
								albums.map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer transition-colors'
									>
										<img
											src={album.imageUrl}
											alt={`${album.title} cover`}
											className={cn(
												'rounded-md flex-shrink-0 object-cover',
												isTablet ? 'size-10' : 'size-12'
											)}
										/>

										<div className='flex-1 min-w-0'>
											<p className={cn(
												'font-medium truncate text-white',
												isTablet ? 'text-sm' : 'text-base'
											)}>{album.title}</p>
											<p className={cn(
												'text-zinc-400 truncate',
												isTablet ? 'text-xs' : 'text-sm'
											)}>Album • {album.artist}</p>
										</div>
									</Link>
								))
							)}
						</div>
					</ScrollArea>
				</div>
			)}
			
			{/* Mobile Library - Simplified */}
			{isMobile && (
				<div className='flex-1 rounded-lg bg-zinc-900 p-2 min-h-0'>
					<div className='flex items-center justify-center mb-2'>
						<Library className='size-5 text-white' title="Library" />
					</div>
					
					<ScrollArea className='h-full max-h-[calc(100vh-200px)]'>
						<div className='space-y-1 flex flex-col items-center'>
							{isLoading ? (
								<div className='animate-pulse space-y-1'>
									{[...Array(3)].map((_, i) => (
										<div key={i} className='w-10 h-10 bg-zinc-700 rounded-md' />
									))}
								</div>
							) : (
								albums.slice(0, 6).map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='p-1 hover:bg-zinc-800 rounded-md cursor-pointer transition-colors'
										title={`${album.title} by ${album.artist}`}
									>
										<img
											src={album.imageUrl}
											alt={`${album.title} cover`}
											className='size-10 rounded-md object-cover'
										/>
									</Link>
								))
							)}
						</div>
					</ScrollArea>
				</div>
			)}
		</div>
	);
};
export default LeftSidebar;
