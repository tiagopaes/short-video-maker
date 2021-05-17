import { Composition } from 'remotion';
import { Short } from './Short';
import data from './assets/data.json';


export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Short"
				component={Short}
				durationInFrames={data.durationInFrames}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					videoFileName: 'neto-cotonete.mp4',
					text: 'COTONETE BÃO É DA DIONSO E DIONSO',
				}}
			/>
		</>
	);
};
