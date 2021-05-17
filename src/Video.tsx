import {Composition} from 'remotion';
import {Short} from './Short';

export const RemotionVideo: React.FC = () => {
	return (
		<>
		{/* <link href='https://fonts.googleapis.com/css?family=Nunito' rel='stylesheet'></link> */}
			<Composition
				id="Short"
				component={Short}
				durationInFrames={1740}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					youtubeUrl: 'https://www.youtube.com/embed/kLdOKv1ktJs?start=13&amp;end=71'
				}}
			/>
		</>
	);
};
