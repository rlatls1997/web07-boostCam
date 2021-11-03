import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

type LocalUserScreenProps = {
  stream: MediaStream | undefined;
  localStatus: { audio: boolean; video: boolean };
};

const Container = styled.div`
  margin-top: 10px;
  &:last-child {
    margin-bottom: 10px;
  }
`;

const Video = styled.video`
  height: auto;
  width: 100%;
`;

function LocalUserScreen(props: LocalUserScreenProps): JSX.Element {
  const { stream, localStatus } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream?.active) {
      return;
    }
    video.srcObject = stream;
  });

  return (
    <Container>
      <div>{`video ${localStatus.video} audio ${localStatus.audio}`}</div>
      <Video ref={videoRef} playsInline autoPlay muted>
        <track kind="captions" />
      </Video>
    </Container>
  );
}

export default LocalUserScreen;
