import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { fetchData } from '../../../../utils/fetchMethods';
import { flex } from '../../../../utils/styledComponentFunc';

import { MainStoreContext } from '../../MainStore';
import ChannelEntity from '../../../../types/channel';
import { ToggleStoreContext } from '../../ToggleStore';

const Container = styled.form`
  width: 90%;
  height: 70%;
  border-radius: 20px;
  margin: 30px 0px 0px 25px;
  ${flex('column', 'flex-start', 'flex-start')}
`;

const InputDiv = styled.div`
  width: 100%;
  height: 100%;
  ${flex('column', 'flex-start', 'flex-start')};
`;

const InputName = styled.span`
  color: #cbc4b9;
  font-size: 20px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 90%;
  border: none;
  outline: none;
  padding: 15px 10px;
  margin-top: 10px;
  border-radius: 10px;
`;

const InputErrorMessage = styled.span`
  padding: 5px 0px;
  color: red;
`;

const SubmitButton = styled.button<{ isButtonActive: boolean }>`
  width: 100px;
  height: 50px;
  background: none;

  padding: 15px 10px;

  border: 0;
  outline: 0;

  text-align: center;
  vertical-align: middle;

  border-radius: 10px;
  background-color: ${(props) => (props.isButtonActive ? '#26a9ca' : 'gray')};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.isButtonActive ? '#2dc2e6' : 'gray')};
    transition: all 0.3s;
  }
`;

type CreateModalForm = {
  name: string;
  description: string;
};

type RequestBody = {
  name: string;
  description: string;
  serverId: number;
};

function CreateChannelModal(): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateModalForm>();
  const { selectedServer, getServerChannelList, socket } = useContext(MainStoreContext);
  const { setIsModalOpen } = useContext(ToggleStoreContext);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const onSubmitCreateChannelModal = async (value: { name: string; description: string }) => {
    const { name, description } = value;
    const requestBody: RequestBody = {
      name: name.trim(),
      description: description.trim(),
      serverId: selectedServer.server.id,
    };
    const { data } = await fetchData<RequestBody, ChannelEntity>('POST', '/api/channels', requestBody);

    const createdChannel = data;
    getServerChannelList();
    socket.emit('joinChannel', { channelId: createdChannel.id });
    setIsModalOpen(false);
  };

  useEffect(() => {
    const { name, description } = watch();
    const isActive = name.trim().length > 2 && description.trim().length > 0;
    setIsButtonActive(isActive);
  }, [watch()]);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Container onSubmit={handleSubmit(onSubmitCreateChannelModal)}>
      <InputDiv>
        <InputName>이름</InputName>
        <Input
          {...register('name', {
            validate: (value) => value.trim().length > 2 || '"이름" 칸은 3글자 이상 입력되어야합니다!',
          })}
          placeholder="채널명을 입력해주세요"
        />
        {errors.name && <InputErrorMessage>{errors.name.message}</InputErrorMessage>}
      </InputDiv>
      <InputDiv>
        <InputName>설명</InputName>
        <Input
          {...register('description', {
            validate: (value) => value.trim().length > 0 || '"설명" 칸은 꼭 입력되어야합니다!',
          })}
          placeholder="채널 설명을 입력해주세요"
        />
        {errors.description && <InputErrorMessage>{errors.description.message}</InputErrorMessage>}
      </InputDiv>
      <SubmitButton type="submit" isButtonActive={isButtonActive}>
        생성
      </SubmitButton>
    </Container>
  );
}

export default CreateChannelModal;
