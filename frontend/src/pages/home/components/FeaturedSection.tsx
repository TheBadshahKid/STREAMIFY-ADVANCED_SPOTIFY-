import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const FeaturedSection = () => {
	const { isLoading, featuredSongs, error } = useMusicStore();
	const { isMobile, isTablet, breakpoint } = useResponsive();

	if (isLoading) return <FeaturedGridSkeleton />;

	if (error) return (
		<p className={cn(
			'text-red-500 mb-4',
			isMobile ? 'text-base' : 'text-lg'
		)}>{error}</p>
	);

	// Responsive column configuration
	const getGridCols = () => {
		if (isMobile) return 'grid-cols-1';
		if (isTablet) return 'grid-cols-2';
		if (breakpoint.xl) return 'grid-cols-4';
		return 'grid-cols-3';
	};

	return (
		<div className={cn(
			'grid gap-3 mb-6',
			getGridCols(),
			isMobile ? 'gap-2 mb-4' : isTablet ? 'gap-3 mb-6' : 'gap-4 mb-8'
		)}>
			{featuredSongs.slice(0, isMobile ? 4 : isTablet ? 6 : 6).map((song) => (
				<div
					key={song._id}
					className={cn(
						'flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative',
						isMobile ? 'min-h-[60px]' : 'min-h-[80px]'
					)}
				>
					{/* Song Image */}
					<img
						src={song.imageUrl}
						alt={song.title}
						className={cn(
							'object-cover flex-shrink-0',
							isMobile ? 'w-14 h-14' : isTablet ? 'w-16 h-16' : 'w-20 h-20'
						)}
						loading="lazy"
					/>
					
					{/* Song Info */}
					<div className={cn(
						'flex-1 min-w-0',
						isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
					)}>
						<p className={cn(
							'font-medium truncate text-white',
							isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-base'
						)}>
							{song.title}
						</p>
						<p className={cn(
							'text-zinc-400 truncate',
							isMobile ? 'text-xs' : 'text-sm'
						)}>
							{song.artist}
						</p>
					</div>
					
					{/* Play Button */}
					<div className={cn(
						'flex-shrink-0',
						isMobile ? 'pr-2' : 'pr-3'
					)}>
						<PlayButton song={song} />
					</div>
				</div>
			))}
		</div>
	);
};
export default FeaturedSection;
