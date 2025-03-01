import React, { useState } from 'react';
import styled from 'styled-components';
import { flex } from '../../../../utils/styledComponentFunc';

import { BoostCamMainIcons } from '../../../../utils/svgIcons';
import Dropdown from '../../../core/Dropdown';
import DropdownMenu from '../../../core/DropdownMenu';
import CreateCamModal from '../Modal/CreateCamModal';

const { Plus, ListArrow } = BoostCamMainIcons;

const Container = styled.div`
  width: 90%;
  height: 30px;

  margin-left: 15px;
  color: #a69c96;
  font-size: 17px;
  ${flex('row', 'flex-start', 'center')}
  &:hover {
    cursor: pointer;
  }
`;

const CamListHeaderSpan = styled.span`
  margin-left: 5px;
`;

const CamListHeaderButton = styled.div<{ isButtonVisible: boolean }>`
  margin-left: 70px;
  margin-top: 3px;
  visibility: ${(props) => (props.isButtonVisible ? 'visible' : 'hidden')};
  ${flex('column', 'center', 'center')}
`;

const ListArrowIcon = styled(ListArrow)<{ $isListOpen: boolean }>`
  width: 20px;
  height: 20px;
  fill: #a69c96;
  transition: all ease-out 0.3s;
  ${(props) => (props.$isListOpen ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);')}
`;

const PlusIcon = styled(Plus)`
  width: 20px;
  height: 20px;
  fill: #a69c96;
`;

type CamListHeaderProps = {
  isListOpen: boolean;
  setIsListOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CamListHeader(props: CamListHeaderProps): JSX.Element {
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isDropdownActivated, setIsDropdownActivated] = useState<boolean>(false);
  const { isListOpen, setIsListOpen } = props;

  const onClickCamAddButton = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    setIsDropdownActivated(!isDropdownActivated);
  };

  return (
    <Container
      onMouseEnter={() => setIsButtonVisible(true)}
      onMouseLeave={() => setIsButtonVisible(false)}
      onClick={() => setIsListOpen(!isListOpen)}
    >
      <ListArrowIcon $isListOpen={isListOpen} />
      <CamListHeaderSpan>Cam</CamListHeaderSpan>
      <CamListHeaderButton isButtonVisible={isButtonVisible}>
        <PlusIcon onClick={onClickCamAddButton} />
        <Dropdown isDropdownActivated={isDropdownActivated} setIsDropdownActivated={setIsDropdownActivated}>
          <DropdownMenu
            name="Cam 생성"
            setIsDropdownActivated={setIsDropdownActivated}
            modalContents={{
              contents: <CreateCamModal />,
              title: 'Cam 생성',
              description: '생성할 Cam의 이름을 작성해주세요',
              height: '40%',
              minHeight: '350px',
            }}
          />
        </Dropdown>
      </CamListHeaderButton>
    </Container>
  );
}

export default CamListHeader;
