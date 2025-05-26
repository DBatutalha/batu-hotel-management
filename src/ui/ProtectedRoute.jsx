import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import PropTypes from "prop-types"; // PropTypes'ı import et
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // 1. authenticated user yükle
  const { isLoading, isAuthenticated } = useUser();

  // 2. authenticated user yoksa login page redirect
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );

  // 3. spinner göster
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. user varsa app'i renderla
  if (isAuthenticated) return children;
}

// children prop'unun türünü belirt
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children'ın tipi node zorunlu olduğunu belirtttim
};

export default ProtectedRoute;
