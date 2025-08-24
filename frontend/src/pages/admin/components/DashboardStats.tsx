import { useMusicStore } from "@/stores/useMusicStore";
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const DashboardStats = () => {
	const { stats } = useMusicStore();
	const { isMobile, isTablet } = useResponsive();

	const statsData = [
		{
			icon: ListMusic,
			label: "Total Songs",
			value: stats.totalSongs.toString(),
			bgColor: "bg-emerald-500/10",
			iconColor: "text-emerald-500",
		},
		{
			icon: Library,
			label: "Total Albums",
			value: stats.totalAlbums.toString(),
			bgColor: "bg-violet-500/10",
			iconColor: "text-violet-500",
		},
		{
			icon: Users2,
			label: "Total Artists",
			value: stats.totalArtists.toString(),
			bgColor: "bg-orange-500/10",
			iconColor: "text-orange-500",
		},
		{
			icon: PlayCircle,
			label: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			bgColor: "bg-sky-500/10",
			iconColor: "text-sky-500",
		},
	];

	return (
		<div className={cn(
			'grid gap-4 mb-6',
			isMobile 
				? 'grid-cols-2 gap-3 mb-4' 
				: isTablet 
					? 'grid-cols-2 lg:grid-cols-4 mb-6'
					: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8'
		)}>
			{statsData.map((stat) => (
				<StatsCard
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					value={stat.value}
					bgColor={stat.bgColor}
					iconColor={stat.iconColor}
				/>
			))}
		</div>
	);
};
export default DashboardStats;
