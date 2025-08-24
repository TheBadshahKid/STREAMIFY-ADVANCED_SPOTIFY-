import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const { isMobile, isTablet, breakpoint } = useResponsive();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else {
			playAlbum(currentAlbum?.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;
		playAlbum(currentAlbum?.songs, index);
	};

	if (isMobile) {
		// Mobile Layout
		return (
			<div className='h-full'>
				<ScrollArea className='h-full'>
					<div className='relative min-h-full'>
						{/* Mobile Background Gradient */}
						<div className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none' />
						
						<div className='relative z-10 p-4 pb-6'>
							{/* Mobile Album Header */}
							<div className='flex flex-col items-center text-center mb-6'>
								<img
									src={currentAlbum?.imageUrl}
									alt={currentAlbum?.title}
									className='w-48 h-48 shadow-xl rounded mb-4'
								/>
								<p className='text-xs font-medium text-zinc-300 mb-1'>Album</p>
								<h1 className='text-2xl font-bold text-white mb-2'>{currentAlbum?.title}</h1>
								<div className='flex flex-col items-center gap-1 text-sm text-zinc-400'>
									<span className='font-medium text-white'>{currentAlbum?.artist}</span>
									<span>{currentAlbum?.releaseYear} • {currentAlbum?.songs.length} songs</span>
								</div>
							</div>

							{/* Mobile Play Button */}
							<div className='flex justify-center mb-6'>
								<Button
									onClick={handlePlayAlbum}
									size='icon'
									className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all'
								>
									{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
										<Pause className='h-7 w-7 text-black' />
									) : (
										<Play className='h-7 w-7 text-black ml-1' />
									)}
								</Button>
							</div>

							{/* Mobile Songs List */}
							<div className='space-y-2'>
								{currentAlbum?.songs.map((song, index) => {
									const isCurrentSong = currentSong?._id === song._id;
									return (
										<div
											key={song._id}
											onClick={() => handlePlaySong(index)}
											className='flex items-center gap-3 p-3 bg-black/20 rounded-md hover:bg-black/40 transition-colors cursor-pointer'
										>
											<div className='flex items-center justify-center w-8 h-8 flex-shrink-0'>
												{isCurrentSong && isPlaying ? (
													<div className='text-green-500 text-sm'>♫</div>
												) : (
													<span className='text-zinc-400 text-sm'>{index + 1}</span>
												)}
											</div>
											<img src={song.imageUrl} alt={song.title} className='w-10 h-10 rounded flex-shrink-0' />
											<div className='flex-1 min-w-0'>
												<div className='font-medium text-white truncate text-sm'>{song.title}</div>
												<div className='text-zinc-400 truncate text-xs'>{song.artist}</div>
											</div>
											<div className='text-zinc-400 text-xs flex-shrink-0'>
												{formatDuration(song.duration)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</ScrollArea>
			</div>
		);
	}

	// Desktop & Tablet Layout
	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				<div className='relative min-h-full'>
					{/* Background Gradient */}
					<div className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none' />

					{/* Content */}
					<div className='relative z-10'>
						{/* Album Header */}
						<div className={cn(
							'flex gap-6 pb-8',
							isTablet ? 'p-4 flex-col items-center text-center' : 'p-6'
						)}>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className={cn(
									'shadow-xl rounded flex-shrink-0',
									isTablet ? 'w-52 h-52' : 'w-60 h-60'
								)}
							/>
							<div className={cn(
								'flex flex-col justify-end',
								isTablet && 'items-center'
							)}>
								<p className={cn(
									'font-medium text-zinc-300',
									isTablet ? 'text-sm mb-2' : 'text-sm'
								)}>Album</p>
								<h1 className={cn(
									'font-bold text-white my-4',
									isTablet ? 'text-4xl my-3' : 'text-6xl'
								)}>
									{currentAlbum?.title}
								</h1>
								<div className={cn(
									'flex items-center gap-2 text-sm text-zinc-100',
									isTablet ? 'flex-col gap-1 text-center' : 'flex-row'
								)}>
									<span className='font-medium text-white'>{currentAlbum?.artist}</span>
									{!isTablet && <span>•</span>}
									<span>{currentAlbum?.songs.length} songs</span>
									{!isTablet && <span>•</span>}
									<span>{currentAlbum?.releaseYear}</span>
								</div>
							</div>
						</div>

						{/* Play Button */}
						<div className={cn(
							'pb-4 flex items-center gap-6',
							isTablet ? 'px-4 justify-center' : 'px-6'
						)}>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className={cn(
									'rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all',
									isTablet ? 'w-12 h-12' : 'w-14 h-14'
								)}
							>
								{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className={cn(
										'text-black',
										isTablet ? 'h-6 w-6' : 'h-7 w-7'
									)} />
								) : (
									<Play className={cn(
										'text-black ml-1',
										isTablet ? 'h-6 w-6' : 'h-7 w-7'
									)} />
								)}
							</Button>
						</div>

						{/* Songs Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
							{/* Table Header - Desktop Only */}
							{!isTablet && (
								<div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
									<div>#</div>
									<div>Title</div>
									<div>Released Date</div>
									<div><Clock className='h-4 w-4' /></div>
								</div>
							)}

							{/* Songs List */}
							<div className={cn(
								isTablet ? 'px-4' : 'px-6'
							)}>
								<div className='space-y-2 py-4'>
									{currentAlbum?.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										
										if (isTablet) {
											// Tablet Card Layout
											return (
												<div
													key={song._id}
													onClick={() => handlePlaySong(index)}
													className='flex items-center gap-3 p-3 hover:bg-white/5 rounded-md cursor-pointer transition-colors'
												>
													<div className='flex items-center justify-center w-8 h-8 text-sm text-zinc-400 flex-shrink-0'>
														{isCurrentSong && isPlaying ? (
															<div className='text-green-500'>♫</div>
														) : (
															<span>{index + 1}</span>
														)}
													</div>
													<img src={song.imageUrl} alt={song.title} className='w-10 h-10 rounded flex-shrink-0' />
													<div className='flex-1 min-w-0'>
														<div className='font-medium text-white truncate'>{song.title}</div>
														<div className='text-sm text-zinc-400 truncate'>{song.artist}</div>
													</div>
													<div className='text-sm text-zinc-400 flex-shrink-0'>
														{formatDuration(song.duration)}
													</div>
												</div>
											);
										}
										
										// Desktop Table Layout
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer'
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-green-500'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{!isCurrentSong && (
														<Play className='h-4 w-4 hidden group-hover:block' />
													)}
												</div>
												<div className='flex items-center gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10 rounded' />
													<div>
														<div className='font-medium text-white'>{song.title}</div>
														<div className='text-zinc-400'>{song.artist}</div>
													</div>
												</div>
												<div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
												<div className='flex items-center'>{formatDuration(song.duration)}</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
export default AlbumPage;
