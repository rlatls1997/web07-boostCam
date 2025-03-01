import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { MainStoreContext } from '../../MainStore';
import { ChannelListData } from '../../../../types/main';
import { fetchData } from '../../../../utils/fetchMethods';
import { JoinChannelRequest } from '../../../../types/join-channel-request';
import { customScroll, flex } from '../../../../utils/styledComponentFunc';
import { ToggleStoreContext } from '../../ToggleStore';

const Container = styled.div`
  width: 90%;
  height: 70%;
  margin-left: 25px;
  margin-bottom: 25px;
  ${flex('column', 'flex-start', 'center')}

  color: #e5e0d8;

  flex: 4;

  overflow-y: auto;
  ${customScroll()};
`;

const ModalChannelListItem = styled.div`
  width: 90%;
  padding: 15px 10px;
  margin: 3px 0px 0px 0px;
  ${flex('row', 'flex-start', 'center')}
  font-size: 18px;

  border-top: 1px solid #e5e0d8;

  &:last-child {
    border-bottom: 1px solid #e5e0d8;
  }

  &:hover {
    button {
      visibility: visible;
    }
    background-color: #282929;
  }

  button {
    visibility: hidden;
  }
`;

const ItemText = styled.div`
  flex: 4;
  ${flex('column', 'space-around', 'flex-start')};
`;

const ItemTitle = styled.span`
  font-size: 20px;
  font-weight: 600;
`;

const ItemDescription = styled.span`
  text-align: center;
  font-weight: 400;
  color: #6e6d69;
`;

const ItemButton = styled.button`
  border: none;
  border-radius: 5px;
  flex: 0.5;
  padding: 4px 12px 4px;
  text-align: center;
  background-color: #236b56;
  cursor: pointer;
`;

function JoinChannelModal(): JSX.Element {
  const { selectedServer, getServerChannelList, socket } = useContext(MainStoreContext);
  const { setIsModalOpen } = useContext(ToggleStoreContext);
  const [channelList, setChannelList] = useState<ChannelListData[]>([]);

  const getNotJoinedChannelList = async () => {
    const { data } = await fetchData<null, ChannelListData[]>(
      'GET',
      `/api/user/servers/${selectedServer?.server.id}/channels/notjoined/`,
    );
    setChannelList(data);
  };

  const onClickChannelListButton = async (id: number) => {
    const resquestBody = {
      channelId: id,
    };

    await fetchData<JoinChannelRequest, null>(
      'POST',
      `/api/user/servers/${selectedServer.server.id}/channels`,
      resquestBody,
    );

    getServerChannelList();
    socket.emit('joinChannel', { channelId: id });
    setIsModalOpen(false);
  };

  useEffect(() => {
    getNotJoinedChannelList();
  }, []);

  const notJoinedChannelList = channelList.map((val) => (
    <ModalChannelListItem key={val.id}>
      <ItemText>
        <ItemTitle>{val.name}</ItemTitle>
        <ItemDescription>{val.description}</ItemDescription>
      </ItemText>
      <ItemButton onClick={() => onClickChannelListButton(val.id)}>참여</ItemButton>
    </ModalChannelListItem>
  ));

  return <Container>{notJoinedChannelList}</Container>;
}

export default JoinChannelModal;
