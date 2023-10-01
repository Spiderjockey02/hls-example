import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent, MouseEvent, FormEvent } from 'react';
import FullscreenIcon from '@mui/icons-material/FullscreenSharp';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import HLS from 'hls.js';

interface Props {
	id: string
}

export default function VideoPlayer({ id }: Props) {
	const [quality, setQuality] = useState('720');

	const video = useRef<HTMLVideoElement>(null);
	const videoContainer = useRef<HTMLDivElement>(null);
	const videoControls = useRef<HTMLDivElement>(null);
	const duration = useRef<HTMLTimeElement>(null);
	const seek = useRef<HTMLInputElement>(null);
	const timeElapsed = useRef<HTMLTimeElement>(null);
	const progressBar = useRef<HTMLDivElement>(null);
	const playbackAnimation = useRef<HTMLDivElement>(null);
	const seekTooltip = useRef<HTMLDivElement>(null);
	const buffer = useRef<HTMLProgressElement>(null);
	const volume = useRef<HTMLInputElement>(null);
	const fullscreenBtn = useRef<HTMLButtonElement>(null);
	const pipButton = useRef<HTMLButtonElement>(null);
	const settingsTab = useRef<HTMLDivElement>(null);
	const playbackText = useRef<HTMLLabelElement>(null);


	// Icons
	const fullscreenBtns = useRef<Array<SVGUseElement>>([]);
	const playBtnIcons = useRef<Array<SVGUseElement>>([]);
	const volumnBtnIcons = useRef<Array<SVGUseElement>>([]);
	const playIcons = useRef<Array<SVGUseElement>>([]);

	useEffect(() => {
		const curVideo = video.current as HTMLVideoElement;
		const path = `/uploads/${id}-${quality}.m3u8`;
		if (HLS.isSupported()) {
			const hls = new HLS({ startPosition: curVideo.currentTime });
			hls.loadSource(path);
			hls.attachMedia(curVideo);
		} else if (curVideo.canPlayType('application/vnd.apple.mpegurl')) {
			curVideo.src = path;
			curVideo.currentTime = curVideo.currentTime;
		}
	}, [quality, id]);

	function formatTime(timeInSeconds: number) {
		const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
		return {
			minutes: result.substr(3, 2),
			seconds: result.substr(6, 2),
		};
	}

	function initVideo() {
		const videoDuration = (video.current as HTMLVideoElement).duration;
		seek.current?.setAttribute('max', `${videoDuration}`);
		const time = formatTime(videoDuration);
		(duration.current as HTMLTimeElement).innerText = `${time.minutes}:${time.seconds}`;
		(duration.current as HTMLTimeElement).setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
	}

	function skipAhead(event: FormEvent<HTMLInputElement>, pressed = false) {
		const skipTo = (pressed) ? event : (event.target.dataset.seek ?? event.target.value);
		(seek.current as HTMLInputElement).value = skipTo;
		(video.current as HTMLVideoElement).currentTime = skipTo;
	}

	function clickedVideo() {
		togglePlay();

		// Animate
		(playbackAnimation.current as HTMLDivElement).animate(
			[
				{ opacity: 1, transform: 'scale(1)' },
				{ opacity: 0, transform: 'scale(1.3)' },
			],
			{ duration: 500 },
		);
	}

	function timeUpdate() {
		const time = formatTime((video.current as HTMLVideoElement).currentTime);
		(timeElapsed.current as HTMLTimeElement).innerText = `${time.minutes}:${time.seconds}`;
		(timeElapsed.current as HTMLTimeElement).setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);

		(seek.current as HTMLInputElement).value = `${(video.current as HTMLVideoElement).currentTime}`;
		(progressBar.current as HTMLDivElement).style.width = `${((video.current as HTMLVideoElement).currentTime / (video.current as HTMLVideoElement).duration * 100) + 0.4}%`;
	}

	function updateSeekTooltip(event: MouseEvent<HTMLDivElement>) {
		const skipTo = (event.offsetX / (event.target as HTMLDivElement).clientWidth) * Number((event.target as HTMLDivElement).getAttribute('max'));
		(seek.current as HTMLInputElement).setAttribute('data-seek', `${skipTo}`);
		const t = formatTime(skipTo);
		(seekTooltip.current as HTMLDivElement).textContent = `${t.minutes}:${t.seconds}`;
		const rect = (video.current as HTMLVideoElement).getBoundingClientRect();
		(seekTooltip.current as HTMLDivElement).style.left = `${event.pageX - rect.left}px`;
	}

	function togglePlay() {
		// Show controls
		toggleVideoControls();

		// Toggle play/pause state
		if (video.current == null) return;
		playBtnIcons.current.forEach((icon) => icon.classList.toggle('hidden'));
		playIcons.current.forEach((icon) => icon.classList.toggle('hidden'));
		if (video.current.paused || video.current.ended) {
			video.current.play();
		} else {
			video.current.pause();
		}
	}

	function updateVolumeIcon() {
		const vid = (video.current as HTMLVideoElement);
		const volumeIcons = volumnBtnIcons.current;
		volumeIcons.forEach((icon) => icon.classList.add('hidden'));
		// volumeButton.setAttribute('data-title', 'Mute (m)');

		if (vid.muted || vid.volume === 0) {
			volumeIcons[0].classList.remove('hidden');
			// volumeButton.setAttribute('data-title', 'Unmute (m)');
		} else if (vid.volume > 0 && vid.volume <= 0.5) {
			volumeIcons[1].classList.remove('hidden');
		} else {
			volumeIcons[2].classList.remove('hidden');
		}
		(volume.current as HTMLInputElement).value = `${vid.volume}`;
	}

	function toggleMute() {
		const vid = (video.current as HTMLVideoElement);
		const vol = (volume.current as HTMLInputElement);
		vid.muted = !vid.muted;
		if (vid.muted) {
			vol.setAttribute('data-volume', vol.value);
			vol.value = `${0}`;
		} else {
			vol.value = `${vol.dataset.volume}`;
		}
	}

	function updateProgress() {
		const vid = (video.current as HTMLVideoElement);
		if (vid.buffered.length == 0) return;
		const bufferedEnd = vid.buffered.end(vid.buffered.length - 1);
		const durationTime = vid.duration;
		console.log(`[DEBUG] Time renderd: ${bufferedEnd} out of ${durationTime}`);
		if (durationTime > 0) (buffer.current as HTMLProgressElement).value = (bufferedEnd / durationTime) * 100;
	}

	function toggleFullScreen() {
		const container = (videoContainer.current as HTMLDivElement);
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
		updateFullscreenButton(!document.fullscreenElement);
	}

	async function togglePip() {
		const vid = (video.current as HTMLVideoElement);
		try {
			if (vid !== document.pictureInPictureElement) {
				(pipButton.current as HTMLButtonElement).disabled = true;
				await vid.requestPictureInPicture();
			} else {
				await document.exitPictureInPicture();
			}
		} catch (error) {
			console.error(error);
		} finally {
			(pipButton.current as HTMLButtonElement).disabled = false;
		}
	}

	function updateFullscreenButton(toggle: boolean) {
		fullscreenBtns.current.forEach((icon) => icon.classList.toggle('hidden'));
		if (toggle) {
			(video.current as HTMLVideoElement).style.maxHeight = '100%';
			fullscreenBtn.current?.setAttribute('data-title', 'Exit full screen (f)');
		} else {
			(video.current as HTMLVideoElement).style.maxHeight = '800px';
			fullscreenBtn.current?.setAttribute('data-title', 'Full screen (f)');
		}
	}

	function handleKeyPress(e: KeyboardEvent<HTMLDivElement>) {
		e.preventDefault();
		switch(e.keyCode) {
			// IF user presses the space bar or k
			case 75:
			case 32:
				return togglePlay();
				// Press m to toggle mute
			case 77:
				return toggleMute();
				// Press p to toggle picture in pitcure mode
			case 80:
				return togglePip();
				// Press s to toggle settings tab
			case 83:
				// // TODO:
				return console.log('show settings');
				// Press f to toggle full screen
			case 70:
				return toggleFullScreen();
		}
	}

	function toggleSettings() {
		settingsTab.current?.classList.toggle('hidden');
	}

	function updatePlaybackSpeed(e: ChangeEvent<HTMLInputElement>) {
		const speed = e.target.value;
		const curVideo = video.current as HTMLVideoElement;
		const label = playbackText.current as HTMLLabelElement;
		curVideo.playbackRate = Number(speed);
		label.textContent = `Playback speed: ${speed}x`;
	}

	function toggleVideoControls() {
		const controls = videoControls.current as HTMLDivElement;

		// Show video controls
		if (controls.classList.contains('hidden')) {
			controls.classList.remove('hidden');

			setTimeout(() => {
				controls.classList.add('hidden');
			}, 5000);
		}
	}

	return (
		<>
			<div className="video-container" tabIndex={0} id="video-container" ref={videoContainer} onKeyDown={handleKeyPress}>
				<div className="playback-animation" id="playback-animation" ref={playbackAnimation}>
					<svg className="svg playback-icons">
						<use href="#pause" ref={i => playIcons.current[0] = i}></use>
						<use className="hidden" href="#play-icon" ref={i => playIcons.current[1] = i}></use>
					</svg>
				</div>
				<video className="video" id="my-video" preload="metadata" ref={video}
					onLoadedMetadata={() => initVideo()} onTimeUpdate={() => timeUpdate()} onClick={() => clickedVideo()} onProgress={() => updateProgress()} onVolumeChange={() => updateVolumeIcon()} onMouseEnter={() => toggleVideoControls()}>
					<source src={`/output-${quality}.m3u8`} type="application/vnd.apple.mpegurl" />
				</video>
				<div className="video-controls hidden" id="video-controls" ref={videoControls}>
					<div className="video-progress">
						<div className="progress-bar" id="seek-bar" ref={progressBar}></div>
						<input className="input-range seek" id="seek" ref={seek} defaultValue="0" min="0" type="range" step="0.01" onInput={(e) => skipAhead(e)}/>
						<progress className="progress-bar" id="buffer" defaultValue="0" max="100" ref={buffer}></progress>
						<div className="seek-tooltip" id="seek-tooltip" ref={seekTooltip} onMouseMove={(e) => updateSeekTooltip(e)}>00:00</div>
					</div>
					<div className="bottom-controls">
						<div className="left-controls">
							<button className="button" data-title="Play (k)" id="play" onClick={() => togglePlay()}>
								<svg className="svg playback-icons">
									<use href="#play-icon" ref={i => playBtnIcons.current[0] = i}></use>
									<use className="hidden" href="#pause" ref={i => playBtnIcons.current[1] = i}></use>
								</svg>
							</button>
							<div className="volume-controls" id="volume-controls">
								<button className="button volume-button" data-title="Mute (m)" id="volume-button" onClick={() => toggleMute()}>
									<svg className="svg">
										<use className="hidden" href="#volume-mute" ref={i => volumnBtnIcons.current[0] = i}></use>
										<use className="hidden" href="#volume-low" ref={i => volumnBtnIcons.current[1] = i}></use>
										<use href="#volume-high" ref={i => volumnBtnIcons.current[2] = i}></use>
									</svg>
								</button>
								<input className="volume" id="volume" defaultValue="1" data-mute="0.5" type="range" max="1" min="0" step="0.05" ref={volume} onInput={(i) => (video.current as HTMLVideoElement).volume = Number(i.currentTarget.value)}/>
							</div>
							<div className="time">
								<time id="time-elapsed" ref={timeElapsed}>00:00</time>
								<span> / </span>
								<time id="duration" ref={duration}>00:00</time>
							</div>
						</div>
						<div className="right-controls">
							<button className="button pip-button" data-title="PIP (p)" id="pip-button" ref={pipButton} onClick={() => togglePip()}>
								<svg className="svg">
									<use href="#pip"></use>
								</svg>
							</button>
							<button data-title="Settings (s)" className="button settings-button" id="settings-button" onClick={() => toggleSettings()}>
								<SettingsSharpIcon fontSize='medium'/>
							</button>
							<button data-title="Full screen (f)" className="button fullscreen-button" id="fullscreen-button" ref={fullscreenBtn} onClick={() => toggleFullScreen()}>
								<FullscreenIcon fontSize='medium' ref={i => fullscreenBtns.current[0] = i}/>
							</button>
						</div>
					</div>
					<div className="settings-popup hidden" ref={settingsTab}>
						<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
							<p>Quality</p>
							<select onChange={(e) => setQuality(e.target.value)} defaultValue={quality}>
								<option value="480">480p</option>
								<option value="720">720p</option>
							</select>
						</div>
						<div>
							<label htmlFor="formControlRange" id="textInput" ref={playbackText}>Playback speed: 1.0x</label>
							<input type="range" className="input-range form-control-range" id="formControlRange" defaultValue="1" max="2" step="0.50" onChange={(e) => updatePlaybackSpeed(e)}/>
						</div>
					</div>
				</div>
			</div>
			<svg className="svg" style={{ display: 'none' }}>
				<defs>
					<symbol id="pause" viewBox="0 0 24 24">
						<path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
					</symbol>
					<symbol id="play-icon" viewBox="0 0 24 24">
						<path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
					</symbol>
					<symbol id="volume-high" viewBox="0 0 24 24">
						<path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
					</symbol>
					<symbol id="volume-low" viewBox="0 0 24 24">
						<path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
					</symbol>
					<symbol id="volume-mute" viewBox="0 0 24 24">
						<path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
					</symbol>
					<symbol id="fullscreen" viewBox="0 0 24 24">
						<path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path>
					</symbol>
					<symbol id="fullscreen-exit" viewBox="0 0 24 24">
						<path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
					</symbol>
					<symbol id="pip" viewBox="0 0 24 24">
						<path d="M21 19.031v-14.063h-18v14.063h18zM23.016 18.984q0 0.797-0.609 1.406t-1.406 0.609h-18q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h18q0.797 0 1.406 0.586t0.609 1.383v14.016zM18.984 11.016v6h-7.969v-6h7.969z"></path>
					</symbol>
					<symbol id="gear" viewBox="0 0 24 24">
						<path d="M24 13.616v-3.232l-2.869-1.02c-.198-.687-.472-1.342-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307c-.613-.339-1.269-.613-1.955-.811l-1.021-2.869h-3.232l-1.021 2.869c-.686.198-1.342.471-1.955.811l-2.751-1.308-2.285 2.285 1.308 2.752c-.339.613-.614 1.268-.811 1.955l-2.869 1.02v3.232l2.869 1.02c.197.687.472 1.342.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308c.613.339 1.269.613 1.955.811l1.021 2.869h3.232l1.021-2.869c.687-.198 1.342-.472 1.955-.811l2.751 1.308 2.285-2.286-1.308-2.751c.339-.613.613-1.268.811-1.955l2.869-1.02zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
					</symbol>
				</defs>
			</svg>
		</>
	);
}
