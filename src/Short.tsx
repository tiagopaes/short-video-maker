import { Img, useCurrentFrame, useVideoConfig, Video } from 'remotion';
import video from './assets/neto-cotonete.mp4';
import logo from './assets/logo-white-200x200.png';

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
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
      >COTONETE BÃO É DA DIONSO E DIONSO!!!</div>
      <Video
        src={video}
        startFrom={390} // if video is 30fps, then it will start at 2s
        endAt={2130} // if video is 30fps, then it will end at 4s
        style={{width: 1080}}
      />
      
      <Img style={{marginTop: '100px'}} width="400" height="400" src={logo} />
      
    </div>
  );
}

//<iframe width="560" height="315" src="https://www.youtube.com/embed/kLdOKv1ktJs?start=13&amp;end=71" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
