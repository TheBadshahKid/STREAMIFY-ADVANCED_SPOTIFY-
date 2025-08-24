import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useResponsive } from "@/hooks/useResponsive";

const MainLayout = () => {
	const { isMobile, isTablet, breakpoint } = useResponsive();

	return (
		<div className='h-screen bg-black text-white flex flex-col overflow-hidden'>
			{isMobile ? (
				// Mobile Layout - Stack vertically
				<>
					<AudioPlayer />
					<div className='flex flex-1 min-h-0'>
						{/* Mobile sidebar - hidden by default, can be toggled */}
						<div className='w-16 flex-shrink-0'>
							<LeftSidebar />
						</div>
						{/* Main content */}
						<div className='flex-1 min-w-0'>
							<Outlet />
						</div>
					</div>
					<PlaybackControls />
				</>
			) : (
				// Desktop Layout - Resizable panels
				<>
					<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
						<AudioPlayer />
						{/* left sidebar */}
						<ResizablePanel 
							defaultSize={isTablet ? 25 : 20} 
							minSize={isTablet ? 20 : 15} 
							maxSize={35}
							className='min-w-0'
						>
							<LeftSidebar />
						</ResizablePanel>

						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors hover:bg-zinc-700' />

						{/* Main content */}
						<ResizablePanel 
							defaultSize={isTablet ? 75 : breakpoint.xl ? 50 : 60}
							minSize={30}
							className='min-w-0'
						>
							<Outlet />
						</ResizablePanel>

						{breakpoint.lg && (
							<>
								<ResizableHandle className='w-2 bg-black rounded-lg transition-colors hover:bg-zinc-700' />

								{/* right sidebar */}
								<ResizablePanel 
									defaultSize={breakpoint.xl ? 30 : 20} 
									minSize={0} 
									maxSize={35} 
									collapsedSize={0}
									className='min-w-0'
								>
									<FriendsActivity />
								</ResizablePanel>
							</>
						)}
					</ResizablePanelGroup>

					<PlaybackControls />
				</>
			)}
		</div>
	);
};
export default MainLayout;
