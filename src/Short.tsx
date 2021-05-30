import { Img, useVideoConfig, Video } from 'remotion';
import logo from './assets/logo-white-200x200.png';

export const Short: React.FC<{ videoFilePath: string; text: string }> = ({ videoFilePath, text }) => {
  const videoConfig = useVideoConfig();

  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#171717',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',
      width: videoConfig.width,
      height: videoConfig.height,
      margin: 0,
      padding: 0
    }}>
      <div
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 'bold',
          margin: '300px 30px 130px',
          color: '#fff',
          fontSize: '60px',
          textAlign: 'center'
        }}
      >{text}</div>
      <Video
        src={require(videoFilePath)}
        startFrom={0}
        endAt={videoConfig.durationInFrames}
        style={{ width: videoConfig.width }}
      />

      <Img style={{ marginTop: '100px' }} width="400" height="400" src={logo} />

    </div>
  );
}
