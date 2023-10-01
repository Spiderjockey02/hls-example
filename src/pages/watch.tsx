import Header from '../components/navbars/header';
import SideBar from '../components/navbars/SideBar';
import SideVideoContainer from '../components/Containers/sideVideoList';
import CommentContainer from '../components/Containers/CommentContainer';
import VideoPlayer from '../components/VideoPlayer';
import { useState } from 'react';

interface Props {
    id: string
}
export default function Watch({ id = 'output' }: Props) {
	const [small, setSmall] = useState(false);
	return (
		<>
			<Header setIsSmallSidebar={setSmall} isSmallSidebar={small} />
			<SideBar isSmallSidebar={small} />

			<div className={`container ${small ? 'large-container' : ''}`}>
				<div className="row">
					<div className="play-video">
						<VideoPlayer id={id}/>
						<div className="tags">
							<a href="">#Coding</a><a href="">#Coding</a><a href="">#Coding</a><a href="">#Coding</a><a href="">#Coding</a><a href="">#Coding</a><a href="">#Coding</a><a href="">#Coding</a>
						</div>
						<h3>YOUTUBE TITLE</h3>
						<div className="play-video-info">
							<p>12234 Views &bull; 2 Days ago</p>
							<div>
								<a><img src="/imgs/like.png" />125</a>
								<a><img src="/imgs/dislike.png" />125</a>
								<a><img src="/imgs/share.png" />Share</a>
								<a><img src="/imgs/save.png" />Save</a>
							</div>
						</div>
						<hr />
						<div className="publisher">
							<img src="/imgs/Jack.png" />
							<div>
								<p>Publisher</p>
								<span>500k Subscribers</span>
							</div>
							<button type="button">Subscribe</button>
						</div>
						<div className="vid-description">
							<p>Channel description</p>
							<p>Subscribe and stuff</p>
							<hr />
							<h4>134 Comments</h4>
							<div className="add-comment">
								<img src="/imgs/Jack.png" />
								<input type="text" placeholder="Write your comment"/>
							</div>
							<CommentContainer />
							<CommentContainer />
							<CommentContainer />
							<CommentContainer />
						</div>
					</div>
					<div className="right-sidebar">
						<SideVideoContainer />
						<SideVideoContainer />
						<SideVideoContainer />
						<SideVideoContainer />
					</div>
				</div>
			</div>
		</>
	);
}
