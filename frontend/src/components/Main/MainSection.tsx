import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import RoomListSection from './RoomListSection';
import ContentsSection from './ContentsSection/ContentsSection';
import MainHeader from './MainHeader';
import { MessageData } from '../../types/message';
import fetchData from '../../utils/fetchMethods';
import { MainStoreContext } from './MainStore';

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const MainBody = styled.div`
  width: 100%;
  flex: 1;
  background-color: #222323;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

function MainSection(): JSX.Element {
  const { selectedChannel, socket } = useContext(MainStoreContext);
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const getMessageList = async () => {
    const { data } = await fetchData<null, MessageData[]>('GET', `/api/messages?channelId=${selectedChannel}`);

    if (data) {
      data.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
      setMessageList(data);
    }
  };

  useEffect(() => {
    socket.emit('joinChannels');
  }, []);

  useEffect(() => {
    const receiveMessageHandler = (message: MessageData) => {
      if (selectedChannel === message.channelId) setMessageList((list) => [...list, message]);
    };

    socket.on('receiveMessage', receiveMessageHandler);
    if (selectedChannel) {
      getMessageList();
    }
    return () => {
      socket.off('receiveMessage', receiveMessageHandler);
    };
  }, [selectedChannel]);

  return (
    <Container>
      <MainHeader />
      <MainBody>
        <RoomListSection />
        <ContentsSection messageList={messageList} />
      </MainBody>
    </Container>
  );
}

export default MainSection;
