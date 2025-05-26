/* eslint-disable react/prop-types */
import styled from "styled-components";
import { forwardRef } from "react";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const Select = forwardRef(function Select(
  { options, value, onChange, children, ...props },
  ref
) {
  return (
    <StyledSelect ref={ref} value={value} onChange={onChange} {...props}>
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </StyledSelect>
  );
});

export default Select;
