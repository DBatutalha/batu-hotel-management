/* eslint-disable no-unused-vars */
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import { useLogout } from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";
import Modal from "../../ui/Modal";
// import ConfirmDelete from "../../ui/ConfirmDelete"; // Eski import
import styled from "styled-components";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

const StyledLogoutConfirm = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const Title = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Text = styled.p`
  color: var(--color-grey-600);
  margin-bottom: 1.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
`;

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <Modal>
      <Modal.Open opensWindowName="logout">
        <ButtonIcon disabled={isLoading}>
          {!isLoading ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
        </ButtonIcon>
      </Modal.Open>

      <Modal.Window name="logout">
        {/* Eski ConfirmDelete kullanımı:
        <ConfirmDelete
          resourceName="oturumu"
          disabled={isLoading}
          onConfirm={() => logout()}
          confirmText="Çıkış yap"
          cancelText="İptal"
        />
        */}
        <StyledLogoutConfirm>
          <Title>Çıkış Yap</Title>
          <Text>Oturumu kapatmak istediğinizden emin misiniz?</Text>
          <ButtonGroup>
            <ButtonText
              onClick={() =>
                document.querySelector("[data-modal-close]")?.click()
              }
            >
              İptal
            </ButtonText>
            <Button
              variation="danger"
              onClick={() => logout()}
              disabled={isLoading}
            >
              {isLoading ? <SpinnerMini /> : "Çıkış Yap"}
            </Button>
          </ButtonGroup>
        </StyledLogoutConfirm>
      </Modal.Window>
    </Modal>
  );
}

export default Logout;
