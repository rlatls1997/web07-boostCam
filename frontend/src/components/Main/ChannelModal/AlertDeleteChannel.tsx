import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { MainStoreContext } from '../MainStore';
import fetchData from '../../../utils/fetchMethods';
import { BoostCamMainIcons } from '../../../utils/SvgIcons';

const { Close } = BoostCamMainIcons;

const Container = styled.div`
  width: 50%;
  min-width: 400px;
  height: 25%;
  min-height: 250px;

  background-color: #222322;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 20px;

  z-index: 3;
`;

const ModalInnerBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  flex: 1;
`;

const ModalTitle = styled.span`
  margin-left: 25px;
  padding: 10px 5px;

  color: #cbc4b9;
  font-size: 32px;
  font-weight: 600;
`;

const ModalDescription = styled.div`
  width: 100%;
  flex: 1;
  margin-left: 25px;
  padding: 10px 5px;

  color: #cbc4b9;
  font-size: 18px;
  display: flex;
  flex-direction: column;
`;

const DescriptionSpan = styled.span`
  padding: 10px 5px;
`;

const HighlightDescriptionSpan = styled.span`
  color: red;
`;

const ModalCloseButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: center;
  align-items: center;

  cursor: pointer;
  margin-right: 25px;
`;

const ModalButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const SubmitButton = styled.button`
  width: 100px;
  height: 50px;
  background: none;

  padding: 15px 10px;

  border: 0;
  outline: 0;

  text-align: center;
  vertical-align: middle;

  border-radius: 10px;
  background-color: #26a9ca;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #54c8e6;
    transition: all 0.3s;
  }
`;

const CancelButton = styled.button`
  width: 100px;
  height: 50px;
  background: none;

  padding: 15px 10px;

  border: 0;
  outline: 0;

  text-align: center;
  vertical-align: middle;

  border-radius: 10px;
  background-color: gray;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #d4d0d0;
    transition: all 0.3s;
  }
`;

const CloseIcon = styled(Close)`
  width: 20px;
  height: 20px;
  fill: #a69c96;
`;

function AlertDeleteChannel(): JSX.Element {
  const { rightClickedChannelId, rightClickedChannelName, setIsModalOpen, setIsAlertModalOpen, getServerChannelList } =
    useContext(MainStoreContext);
  const [selectedChannelName, setSelectedChannelName] = useState<string>('');

  const onClickSubmitButton = async () => {
    await fetchData<null, null>('DELETE', `/api/channel/${rightClickedChannelId}`);
    getServerChannelList();
    setIsAlertModalOpen(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setSelectedChannelName(rightClickedChannelName);
  }, []);

  return (
    <Container>
      <ModalInnerBox>
        <ModalHeader>
          <ModalTitle>채널 삭제</ModalTitle>
          <ModalCloseButton onClick={() => setIsAlertModalOpen(false)}>
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>
        <ModalDescription>
          <DescriptionSpan>
            정말
            <HighlightDescriptionSpan> {selectedChannelName}</HighlightDescriptionSpan> 을 삭제하시겠습니까?
          </DescriptionSpan>
          <DescriptionSpan>삭제된 채널의 데이터는 복구할 수 없습니다.</DescriptionSpan>
        </ModalDescription>
        <ModalButtonContainer>
          <SubmitButton onClick={onClickSubmitButton}>확인</SubmitButton>
          <CancelButton onClick={() => setIsAlertModalOpen(false)}>취소</CancelButton>
        </ModalButtonContainer>
      </ModalInnerBox>
    </Container>
  );
}

export default AlertDeleteChannel;
