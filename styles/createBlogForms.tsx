"use client";
import styled from "styled-components"

export const FormFieldError = styled.div`
	color: var(--err);
	font-size: 0.75rem;
	margin-top: 0.3125rem;
	width: 100%;
`;

export const FormFieldGrp = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;
  transition: all 0.2s;
`;

export const FormFieldWrapper = styled.div<{
  $error?: boolean
}>`
  width: 100%

  &:first-child {
    margin-top: 0;
  }

 option {
  color: var(--primary);
 }

  & input,
  & input:focus,
  & input:focus-visible,
  & textarea,
  & textarea:focus,
  & textarea:focus-visible,
  & select,
  & select:focus,
  & select:focus-visible {
    appearance: none;
    background-color: transparent;
    border: 1px solid var(--border-color);
    font-size: 0.875rem;
    letter-spacing: -0.05em;
    line-height: 1.25rem;
    outline: none;
    padding: 0.75rem;
    resize: none;
    outline: none;
    width: 100%
  }

  ${({ $error }) =>
    $error &&
    `
    & input,
    & input:focus,
    & input:focus-visible,
    & textarea,
    & textarea:focus,
    & textarea:focus-visible,
    & select,
    & select:focus,
    & select:focus-visible,
    {
      border-color: var(--err);
      & ::placeholder {
        color: var(--err);
      }
    }
  `}
`;