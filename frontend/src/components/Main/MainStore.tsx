import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { CamData, ChannelData, MyServerData } from '../../types/main';
import { MessageData } from '../../types/message';

export const MainStoreContext = createContext<React.ComponentState>(null);

type MainStoreProps = {
  children: React.ReactChild[] | React.ReactChild;
};

const socket = io('/message', {
  withCredentials: true,
});

function MainStore(props: MainStoreProps): JSX.Element {
  const { children } = props;
  const [selectedServer, setSelectedServer] = useState<MyServerData>();
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedMessageData, setSelectedMessageData] = useState<MessageData>();
  const [rightClickedChannelId, setRightClickedChannelId] = useState<string>('');
  const [rightClickedChannelName, setRightClickedChannelName] = useState<string>('');
  const [serverChannelList, setServerChannelList] = useState<ChannelData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContents, setModalContents] = useState<JSX.Element>(<></>);

  const [serverList, setServerList] = useState<MyServerData[]>([]);

  const [serverCamList, setServerCamList] = useState<CamData[]>([]);

  const getServerChannelList = async (): Promise<void> => {
    const response = await fetch(`/api/user/servers/${selectedServer?.server.id}/channels/joined/`);
    const list = await response.json();
    const channelList = list.data;
    if (channelList.length) {
      setSelectedChannel(channelList[0].id);
    } else {
      setSelectedChannel('');
    }
    setServerChannelList(channelList);
  };

  const getUserServerList = async (calledStatus: string | undefined): Promise<void> => {
    const response = await fetch(`/api/user/servers`);
    const list = await response.json();

    if (response.status === 200 && list.data.length !== 0) {
      setServerList(list.data);
      if (calledStatus === 'updated') {
        const updatedServerId = selectedServer?.server.id;
        setSelectedServer(list.data.filter((userServer: MyServerData) => userServer.server.id === updatedServerId)[0]);
      } else {
        const selectedServerIndex = calledStatus === 'created' ? list.data.length - 1 : 0;
        setSelectedServer(list.data[selectedServerIndex]);
      }
    }
  };

  const getServerCamList = async (): Promise<void> => {
    const response = await fetch(`/api/servers/${selectedServer?.server.id}/cam`);
    const list = await response.json();
    const camList = list.data;

    if (response.status === 200) {
      setServerCamList(camList);
    }
  };

  useEffect(() => {
    if (selectedServer) {
      getServerChannelList();
      getServerCamList();
    }
  }, [selectedServer]);

  return (
    <MainStoreContext.Provider
      value={{
        socket,
        isModalOpen,
        modalContents,
        selectedServer,
        selectedChannel,
        selectedMessageData,
        rightClickedChannelId,
        rightClickedChannelName,
        serverChannelList,
        serverList,
        serverCamList,
        setIsModalOpen,
        setModalContents,
        setSelectedServer,
        setSelectedChannel,
        setSelectedMessageData,
        setRightClickedChannelId,
        setRightClickedChannelName,
        setServerChannelList,
        getServerChannelList,
        setServerList,
        getUserServerList,
        getServerCamList,
      }}
    >
      {children}
    </MainStoreContext.Provider>
  );
}

export default MainStore;
