interface Props {
	comment: string
	likes: number
	dislikes: number
	commentor: {
		id: number
		name: string
	}
}

export default function CommentContainer({ comment = 'wow very cool video', likes = Math.round(Math.random() * 1000), dislikes = Math.round(Math.random() * 1000), commentor = { id: 0, name: 'Ben Forey' } }: Props) {
	return (
		<div className="old-comment">
			<img src="/imgs/Jack.png" />
			<div>
				<h3>{commentor.name}<span>2 Days ago</span></h3>
				<p>{comment}</p>
				<div className="comment-action">
					<img src="/imgs/like.png" />
					<span>{likes}</span>
					<img src="/imgs/dislike.png" />
					<span>{dislikes}</span>
					<span>REPLY</span>
					<a href="">All replies</a>
				</div>
			</div>
		</div>
	);
}