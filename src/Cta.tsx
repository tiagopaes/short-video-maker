import { useVideoConfig, Video } from 'remotion';

export const Cta: React.FC<{ videoFileName: string; }> = ({ videoFileName }) => {
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
      <Video
        src={require(`./assets/ctas/${videoFileName}`)}
        style={{ width: videoConfig.width }}
      />
    </div>
  );
}
