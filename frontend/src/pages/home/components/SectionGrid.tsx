import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};
const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	const { isMobile, isTablet, breakpoint } = useResponsive();
	
	if (isLoading) return <SectionGridSkeleton />;

	// Responsive column configuration
	const getGridCols = () => {
		if (isMobile) return 'grid-cols-2'; // 2 columns on mobile
		if (isTablet) return 'grid-cols-3'; // 3 columns on tablet
		if (breakpoint.xl) return 'grid-cols-6'; // 6 columns on extra large screens
		return 'grid-cols-4'; // 4 columns on desktop
	};

	return (
		<div className={cn(
			'mb-6',
			isMobile ? 'mb-4' : 'mb-8'
		)}>
			{/* Section Header */}
			<div className={cn(
				'flex items-center justify-between',
				isMobile ? 'mb-3' : 'mb-4'
			)}>
				<h2 className={cn(
					'font-bold text-white',
					isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
				)}>{title}</h2>
				{!isMobile && (
					<Button 
						variant='link' 
						className={cn(
							'text-zinc-400 hover:text-white p-0 h-auto transition-colors',
							isTablet ? 'text-xs' : 'text-sm'
						)}
					>
						Show all
					</Button>
				)}
			</div>

			{/* Songs Grid */}
			<div className={cn(
				'grid gap-3',
				getGridCols(),
				isMobile ? 'gap-2' : isTablet ? 'gap-3' : 'gap-4'
			)}>
				{songs.map((song) => (
					<div
						key={song._id}
						className={cn(
							'bg-zinc-800/40 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer',
							isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
						)}
					>
						{/* Song Image */}
						<div className={cn(
							'relative',
							isMobile ? 'mb-2' : 'mb-4'
						)}>
							<div className='aspect-square rounded-md shadow-lg overflow-hidden bg-zinc-900'>
								<img
									src={song.imageUrl}
									alt={song.title}
									className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
									loading="lazy"
								/>
							</div>
							<PlayButton song={song} />
						</div>
						
						{/* Song Info */}
						<div className='space-y-1'>
							<h3 className={cn(
								'font-medium text-white truncate',
								isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base'
							)}>
								{song.title}
							</h3>
							<p className={cn(
								'text-zinc-400 truncate',
								isMobile ? 'text-xs' : 'text-sm'
							)}>
								{song.artist}
							</p>
						</div>
					</div>
				))}
			</div>
			
			{/* Mobile Show All Button */}
			{isMobile && (
				<div className='flex justify-center mt-4'>
					<Button 
						variant='outline' 
						size='sm'
						className='text-zinc-400 hover:text-white border-zinc-600 hover:border-zinc-400'
					>
						Show all
					</Button>
				</div>
			)}
		</div>
	);
};
export default SectionGrid;
