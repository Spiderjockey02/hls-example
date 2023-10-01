import Link from 'next/link';

interface Props {
  id?: number
  views?: number
  title?: string
  channel?: {
    id: number
    name: string

  }
}

export default function VideoContainer({ id = 0, views = Math.round(Math.random() * 1000), title = 'Best channel to learn stuff tut', channel = { id: 1, name: 'Ben Forey' } }: Props) {
	return (
		<div className="vid-list">
			<Link href={`/watch?id=${id}`}>
				<div className="thumbnail-container">
					<img className="thumbnail" src="/imgs/thumbnail1.png" />
					<p className="time-overlay">23:23</p>
				</div>
				<div className="flex-div">
					<img src="/imgs/Jack.png" />
					<div className="vid-info">
						<Link href={`/watch?id=${id}`}><h3>{title}</h3></Link>
						<Link href={`/channel/${channel.id}`}><p>{channel.name}</p></Link>
						<p>{views} views &bull; 2 days</p>
					</div>
				</div>
			</Link>
		</div>
	);
}