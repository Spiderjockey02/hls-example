import Header from '../components/navbars/header';
import SideBar from '../components/navbars/SideBar';
import VideoContainer from '../components/Containers/VideoGridContainer';
import { useState } from 'react';

export default function Home() {
	const [isSmallSidebar, setIsSmallSidebar] = useState(false);

	return (
		<>
			<Header setIsSmallSidebar={setIsSmallSidebar} isSmallSidebar={isSmallSidebar} />
			<SideBar isSmallSidebar={isSmallSidebar} />

			<div className={`container ${isSmallSidebar ? 'large-container' : ''}`}>
				<div className="banner">
					<img src="/imgs/banner.png" alt="banner" />
				</div>

				<div className="list-container">
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
					<VideoContainer />
				</div>
			</div>
		</>
	);
}
