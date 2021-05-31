import { getInputProps, Composition } from 'remotion';
import { Short } from './Short';

const inputProps = getInputProps();

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Short"
				component={Short}
				durationInFrames={inputProps?.durationInFrames ?? 20}
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
