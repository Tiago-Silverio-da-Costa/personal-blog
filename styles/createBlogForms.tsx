"use client";
import styled from "styled-components"

export const Spin = styled.div`
	animation-name: spin;
	animation-duration: 2500ms;
	animation-iteration-count: infinite;
	animation-timing-function: linear;

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;

export const FormBtn = styled.button<{
  $isSubmitting?: boolean;
}>`
	background-color: var(--secondary);
	padding: 0.41rem 1.5rem;
	cursor: pointer;
	transition: all 0.2s;
	width: 100%;
	@media (min-width: 768px) {
		width: fit-content;
	}

	position: relative;

	& span {
	  color: var(--primary);
	  font-size: 0.875rem;
		transition: all 0.1s;
    font-weight: 700;
    line-height: 1.25rem;
	}

	${({ $isSubmitting }) =>
    $isSubmitting
      ? `
    cursor: default;
    & span {
      opacity: 0;
    }`
      : `
  &:hover {
    opacity: 0.75;
  }`}

	&>div {
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
	}
`;

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
  width: 100%;

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

export const LoginBtn = styled.button<{
  $isSubmitting?: boolean;
}>`
  background-color: var(--secondary);
  font-size: 0.9375rem;
  color: var(--primary);
  line-height: 1;
  padding: 0.875rem 1rem;
  position: relative;
  transition: all 0.2s;
  width: 100%;

  & span {
    transition: all 0.1s;
  }

  &:disabled {
    background-color: rgba(45, 164, 74, 0.8);
  }

  ${({ $isSubmitting }) =>
    $isSubmitting
      ? `
			cursor: default;
			& span {
				opacity: 0;
			}`
      : `
		&:hover {
			opacity: 0.75;
		}`}

  &>div {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;