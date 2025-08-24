import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
	const { isMobile, isTablet, breakpoint } = useResponsive();

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			usePlayerStore.setState({ isPlaying: false });
		};

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	if (isMobile) {
		return (
			<footer className='bg-zinc-900 border-t border-zinc-800'>
				{/* Mobile Progress Bar */}
				{currentSong && (
					<div className='px-4 py-1'>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full h-1'
							onValueChange={handleSeek}
						/>
					</div>
				)}

				{/* Mobile Main Controls */}
				<div className='flex items-center justify-between px-4 py-3'>
					{/* Current Song Info */}
					<div className='flex items-center gap-3 flex-1 min-w-0'>
						{currentSong ? (
							<>
								<img
									src={currentSong.imageUrl}
									alt={currentSong.title}
									className='w-12 h-12 object-cover rounded-md flex-shrink-0'
								/>
								<div className='flex-1 min-w-0'>
									<div className='font-medium text-white truncate text-sm'>
										{currentSong.title}
									</div>
									<div className='text-xs text-zinc-400 truncate'>
										{currentSong.artist}
									</div>
								</div>
							</>
						) : (
							<div className='flex-1 min-w-0'>
								<div className='text-zinc-400 text-sm'>No song playing</div>
							</div>
						)}
					</div>

					{/* Mobile Playback Controls */}
					<div className='flex items-center gap-2'>
						<Button
							size='icon'
							variant='ghost'
							className='text-zinc-400 hover:text-white h-8 w-8'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							className='bg-white hover:bg-white/80 text-black rounded-full h-10 w-10'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='text-zinc-400 hover:text-white h-8 w-8'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</footer>
		);
	}

	// Desktop & Tablet Layout
	return (
		<footer className={cn(
			'bg-zinc-900 border-t border-zinc-800',
			isTablet ? 'h-20 px-3' : 'h-24 px-4'
		)}>
			<div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
				{/* Currently Playing Song */}
				<div className={cn(
					'flex items-center gap-3 min-w-0',
					isTablet ? 'w-1/4' : 'w-[30%] gap-4'
				)}>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className={cn(
									'object-cover rounded-md flex-shrink-0',
									isTablet ? 'w-12 h-12' : 'w-14 h-14'
								)}
							/>
							<div className='flex-1 min-w-0'>
								<div className={cn(
									'font-medium text-white truncate hover:underline cursor-pointer',
									isTablet ? 'text-sm' : 'text-base'
								)}>
									{currentSong.title}
								</div>
								<div className={cn(
									'text-zinc-400 truncate hover:underline cursor-pointer',
									isTablet ? 'text-xs' : 'text-sm'
								)}>
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* Player Controls */}
				<div className={cn(
					'flex flex-col items-center gap-2 flex-1 max-w-full',
					isTablet ? 'max-w-[50%]' : 'max-w-[45%]'
				)}>
					{/* Control Buttons */}
					<div className={cn(
						'flex items-center',
						isTablet ? 'gap-4' : 'gap-6'
					)}>
						{!isTablet && (
							<Button
								size='icon'
								variant='ghost'
								className='hover:text-white text-zinc-400 transition-colors'
							>
								<Shuffle className='h-4 w-4' />
							</Button>
						)}

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400 transition-colors'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className={cn(
								isTablet ? 'h-5 w-5' : 'h-4 w-4'
							)} />
						</Button>

						<Button
							size='icon'
							className={cn(
								'bg-white hover:bg-white/80 text-black rounded-full transition-transform hover:scale-105',
								isTablet ? 'h-10 w-10' : 'h-8 w-8'
							)}
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? (
								<Pause className={cn(
									isTablet ? 'h-6 w-6' : 'h-5 w-5'
								)} />
							) : (
								<Play className={cn(
									isTablet ? 'h-6 w-6' : 'h-5 w-5'
								)} />
							)}
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400 transition-colors'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className={cn(
								isTablet ? 'h-5 w-5' : 'h-4 w-4'
							)} />
						</Button>

						{!isTablet && (
							<Button
								size='icon'
								variant='ghost'
								className='hover:text-white text-zinc-400 transition-colors'
							>
								<Repeat className='h-4 w-4' />
							</Button>
						)}
					</div>

					{/* Progress Bar */}
					<div className='flex items-center gap-2 w-full'>
						<div className={cn(
							'text-zinc-400 tabular-nums',
							isTablet ? 'text-xs' : 'text-xs'
						)}>{formatTime(currentTime)}</div>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full hover:cursor-grab active:cursor-grabbing'
							onValueChange={handleSeek}
						/>
						<div className={cn(
							'text-zinc-400 tabular-nums',
							isTablet ? 'text-xs' : 'text-xs'
						)}>{formatTime(duration)}</div>
					</div>
				</div>

				{/* Volume Controls */}
				<div className={cn(
					'flex items-center justify-end min-w-0',
					isTablet ? 'w-1/4 gap-2' : 'w-[30%] gap-4'
				)}>
					{!isTablet && (
						<>
							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
								<Mic2 className='h-4 w-4' />
							</Button>
							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
								<ListMusic className='h-4 w-4' />
							</Button>
							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
								<Laptop2 className='h-4 w-4' />
							</Button>
						</>
					)}

					<div className='flex items-center gap-2'>
						<Button 
							size='icon' 
							variant='ghost' 
							className='hover:text-white text-zinc-400 flex-shrink-0'
						>
							<Volume1 className='h-4 w-4' />
						</Button>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className={cn(
								'hover:cursor-grab active:cursor-grabbing',
								isTablet ? 'w-16' : 'w-24'
							)}
							onValueChange={(value) => {
								setVolume(value[0]);
								if (audioRef.current) {
									audioRef.current.volume = value[0] / 100;
								}
							}}
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};
