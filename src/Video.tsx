import { getInputProps, Composition } from 'remotion';
import { Short } from './Short';

const inputProps = getInputProps();

export const RemotionVideo: React.FC = () => {
	let duration = inputProps?.durationInFrames ?? 20;
	const cta = inputProps?.cta && inputProps?.cta != 'none' ? inputProps.cta : null;
	if (cta) {
		duration += 150;
	} 

	return (
		<>
			<Composition
				id="Short"
				component={Short}
				durationInFrames={duration}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					videoFileName: 'neto-cotonete.mp4',
					text: 'COTONETE BÃO É DA DIONSO E DIONSO',
					cta: null
				}}
			/>
		</>
	);
};
