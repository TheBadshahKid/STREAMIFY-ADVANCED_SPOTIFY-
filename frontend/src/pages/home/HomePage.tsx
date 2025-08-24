import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();
	const { isMobile, isTablet } = useResponsive();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className={cn(
				'h-full',
				isMobile ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-180px)]'
			)}>
				<div className={cn(
					'pb-6',
					isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6'
				)}>
					{/* Greeting */}
					<h1 className={cn(
						'font-bold mb-6 text-white',
						isMobile ? 'text-xl mb-4' : isTablet ? 'text-2xl mb-5' : 'text-3xl mb-6'
					)}>Good afternoon</h1>
					
					{/* Featured Section */}
					<FeaturedSection />

					{/* Music Sections */}
					<div className={cn(
						'space-y-6',
						isMobile ? 'space-y-4 mt-6' : isTablet ? 'space-y-6 mt-8' : 'space-y-8 mt-8'
					)}>
						<SectionGrid 
							title='Made For You' 
							songs={madeForYouSongs} 
							isLoading={isLoading} 
						/>
						<SectionGrid 
							title='Trending' 
							songs={trendingSongs} 
							isLoading={isLoading} 
						/>
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
