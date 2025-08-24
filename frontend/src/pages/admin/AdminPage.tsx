import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();
	const { isMobile, isTablet } = useResponsive();
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-red-500 mb-2'>Unauthorized</h1>
					<p className='text-zinc-400'>You don't have permission to access this page.</p>
				</div>
			</div>
		);
	}

	return (
		<div className={cn(
			'min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100',
			isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'
		)}>
			{/* Header */}
			<Header />

			{/* Dashboard Stats */}
			<DashboardStats />

			{/* Tabs Section */}
			<Tabs defaultValue='songs' className={cn(
				'space-y-4',
				isMobile ? 'space-y-3' : 'space-y-6'
			)}>
				{/* Responsive Tabs List */}
				<TabsList className={cn(
					'p-1 bg-zinc-800/50 w-full',
					isMobile ? 'grid grid-cols-2 h-10' : 'flex justify-start'
				)}>
					<TabsTrigger 
						value='songs' 
						className={cn(
							'data-[state=active]:bg-zinc-700 transition-colors',
							isMobile ? 'text-xs' : 'text-sm'
						)}
					>
						<Music className={cn(
							'size-4 flex-shrink-0',
							isMobile ? 'mr-1' : 'mr-2'
						)} />
						{!isMobile && <span>Songs</span>}
						{isMobile && <span className='truncate'>Songs</span>}
					</TabsTrigger>
					<TabsTrigger 
						value='albums' 
						className={cn(
							'data-[state=active]:bg-zinc-700 transition-colors',
							isMobile ? 'text-xs' : 'text-sm'
						)}
					>
						<Album className={cn(
							'size-4 flex-shrink-0',
							isMobile ? 'mr-1' : 'mr-2'
						)} />
						{!isMobile && <span>Albums</span>}
						{isMobile && <span className='truncate'>Albums</span>}
					</TabsTrigger>
				</TabsList>

				{/* Tab Contents */}
				<TabsContent value='songs' className='mt-4'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums' className='mt-4'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default AdminPage;
