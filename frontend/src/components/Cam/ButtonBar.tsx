import React, { useContext } from 'react';
import styled from 'styled-components';

import { ReactComponent as MicIcon } from '../../assets/icons/mic.svg';
import { ReactComponent as VideoIcon } from '../../assets/icons/video.svg';
import { ReactComponent as IdentificationIcon } from '../../assets/icons/identification.svg';
import { ReactComponent as ChatIcon } from '../../assets/icons/chat.svg';
import { ReactComponent as PresenstationIcon } from '../../assets/icons/presentation.svg';
import { ReactComponent as UsersIcon } from '../../assets/icons/users.svg';
import { ReactComponent as BackgroundIcon } from '../../assets/icons/background.svg';
import { ReactComponent as ExitIcon } from '../../assets/icons/exit.svg';
import { CamStoreContext } from './CamStore';
import Status from '../../types/cam';

const Container = styled.div`
  width: 98vw;
  height: 8vh;
  margin-top: 5px;
  background-color: #c4c4c4;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  border-radius: 10px;
`;

const Button = styled.div`
  min-width: 9vw;
  height: 7vh;
  background-color: #a4a4a4;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  border-radius: 10px;

  &:hover {
    background-color: #f3f1f1;
    transition: all 0.5s;
  }

  svg {
    min-width: 6vh;
    height: 6vh;
  }
`;

type ButtonBarProps = {
  handleTab: { handleUserListTabActive: () => void; handleChattingTabActive: () => void };
};

function ButtonBar(props: ButtonBarProps): JSX.Element {
  const { handleTab } = props;
  const { handleUserListTabActive, handleChattingTabActive } = handleTab;
  const { localStream, setLocalStatus, localStatus } = useContext(CamStoreContext);

  const onClickVideoToggleButton = () => {
    if (!localStatus.stream) {
      return;
    }
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    setLocalStatus((prev: Status) => ({
      ...prev,
      video: localStream.getVideoTracks()[0].enabled,
    }));
  };

  const onClickMicToggleButton = () => {
    if (!localStatus.stream) {
      return;
    }
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    setLocalStatus((prev: Status) => ({
      ...prev,
      audio: localStream.getAudioTracks()[0].enabled,
    }));
  };

  return (
    <Container>
      <Button onClick={onClickMicToggleButton}>
        <MicIcon />
        <span>마이크</span>
      </Button>
      <Button onClick={onClickVideoToggleButton}>
        <VideoIcon />
        <span>비디오</span>
      </Button>
      <Button>
        <IdentificationIcon />
        <span>닉네임</span>
      </Button>
      <Button>
        <BackgroundIcon />
        <span>가상 배경</span>
      </Button>
      <Button>
        <PresenstationIcon />
        <span>화면 공유</span>
      </Button>
      <Button onClick={handleUserListTabActive}>
        <UsersIcon />
        <span>사용자 목록</span>
      </Button>
      <Button onClick={handleChattingTabActive}>
        <ChatIcon />
        <span>채팅</span>
      </Button>
      <Button>
        <ExitIcon />
        <span>나가기</span>
      </Button>
    </Container>
  );
}

export default ButtonBar;
