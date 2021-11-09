import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 40px;
  margin-top: 15px;
  width: 100%;
  height: 50%;
`;

const InputDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &:last-child {
    margin-top: 15px;
  }
`;

const InputTag = styled.span`
  width: 100%;
`;

const LoginInput = styled.input`
  width: 80%;
  border: none;
  outline: none;
  padding: 8px 10px;
  margin-top: 10px;

  border-radius: 10px;
`;

const SubmitButton = styled.button`
  width: 85%;
  margin-top: 15px;
  height: 35px;
  background-color: #4ddddf;

  border: 0;
  outline: 0;

  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  box-shadow: 5px 3px 3px #7c7b7b;
  transition: all 0.3s;

  &:hover {
    background-color: #26f5f8;
    transition: all 0.3s;
  }

  a {
    text-decoration: none;
  }
`;

function LocalLogin(): JSX.Element {
  const navigate = useNavigate();
  const onSumbitLoginForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { currentTarget } = e;
    const formData: FormData = new FormData(currentTarget);

    formData.forEach((val) => {
      console.log(val);
    });
    navigate('/rooms');
  };

  return (
    <Container onSubmit={onSumbitLoginForm}>
      <InputDiv>
        <InputTag>아이디</InputTag>
        <LoginInput name="id" placeholder="아이디를 입력해주세요" />
      </InputDiv>
      <InputDiv>
        <InputTag>비밀번호</InputTag>
        <LoginInput name="password" type="password" placeholder="비밀번호를 입력해주세요" />
      </InputDiv>
      <SubmitButton type="submit">로그인</SubmitButton>
    </Container>
  );
}

export default LocalLogin;
