import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";

const StyledLogo = styled.div`
  height: 9.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
`;

const Img = styled.img`
  height: 20rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? "/logo-dark.png" : "/logo-light.png";
  const navigate = useNavigate();

  return (
    <StyledLogo onClick={() => navigate("/")}>
      <Img src={src} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
