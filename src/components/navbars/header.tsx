import Image from 'next/image';
import Link from 'next/link';

interface Props {
  setIsSmallSidebar: (isSmallSidebar: boolean) => void;
  isSmallSidebar: boolean;
}

export default function Header({ setIsSmallSidebar, isSmallSidebar }: Props) {
	return (
		<nav className="flex-div">
			<div className="nav-left flex-div">
				<Image className="menu-icon" src="/imgs/menu.png" width={22} height={22} alt="menu" onClick={() => setIsSmallSidebar(!isSmallSidebar)}/>
				<Link href="/">
					<Image className="logo" src="/imgs/logo.png" width={130} height={30} alt="logo" />
				</Link>
			</div>
			<div className="nav-middle flex-div">
				<div className="search-box flex-div">
					<input type="text" placeholder="Search" />
					<Image src="/imgs/search.png" width={15} height={15} alt="search" />
				</div>
				<Image className="mic-icon" src="/imgs/voice-search.png" width={16} height={22} alt="voice search" />
			</div>
			<div className="nav-right flex-div">
				<Image src="/imgs/upload.png" width={25} height={25} alt="menu" />
				<Image src="/imgs/more.png" width={25} height={25} alt="menu" />
				<Image src="/imgs/notification.png" width={25} height={25} alt="menu" />
				<Image className="user-icon" src="/imgs/Jack.png" width={35} height={35} alt="menu" />
			</div>
		</nav>
	);
}
