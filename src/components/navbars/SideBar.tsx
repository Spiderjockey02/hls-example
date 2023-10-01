import Image from 'next/image';
import Link from 'next/link';

interface Props {
  isSmallSidebar: boolean
}

export default function SideBar({ isSmallSidebar }: Props) {
	return (
		<div className={`sidebar ${isSmallSidebar ? 'small-sidebar' : ''}`}>
			<div className="shortcut-links">
				<Link href="/">
					<Image src="/imgs/home.png" width={20} height={20} alt="home" />
					<p>Home</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/explore.png" width={20} height={20} alt="home" />
					<p>Explore</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/subscription.png" width={20} height={20} alt="home" />
					<p>Subscription</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/library.png" width={20} height={20} alt="home" />
					<p>Library</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/history.png" width={20} height={20} alt="home" />
					<p>History</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/playlist.png" width={20} height={20} alt="home" />
					<p>Playlist</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/messages.png" width={20} height={20} alt="home" />
					<p>Messages</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/show-more.png" width={20} height={20} alt="home" />
					<p>Show more</p>
				</Link>
				<hr />
			</div>
			<div className="subscribed-list">
				<h3>SUBSCRIBED</h3>
				<Link href="/">
					<Image src="/imgs/Jack.png" width={25} height={25} alt="home" />
					<p>First Second</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/simon.png" width={25} height={25} alt="home" />
					<p>First Second</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/tom.png" width={25} height={25} alt="home" />
					<p>First Second</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/megan.png" width={25} height={25} alt="home" />
					<p>First Second</p>
				</Link>
				<Link href="/">
					<Image src="/imgs/cameron.png" width={25} height={25} alt="home" />
					<p>First Second</p>
				</Link>
			</div>
		</div>
	);
}