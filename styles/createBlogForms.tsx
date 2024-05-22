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

export const FormFieldGrp = styled.div<{
  $password?: boolean;
}>`
  color: #ddd;
  display: flex;
  padding: 0.75rem;
  transition: all 0.2s;

  ${({ $password }) =>
    $password &&
    `
    & input,
    & input:focus,
    & input:focus-visible {
      letter-spacing: .01rem;
    }
`}
`;

export const FormFieldWrapper = styled.div<{
  $error?: boolean
}>`
width: 100%;
margin: 1rem 0;
border: 0.5px solid var(--secondary);

& input,
& input:focus,
& input:focus-visible {
  color: var(--secondary);
  background: transparent;
   border: none;
   font-size: 0.875rem;
   letter-spacing: 0.01em;
   line-height: 1.5;
   outline: none;
   width: 100%;
 }

 & input:read-only {
   opacity: 0.8;
 }

 // hasError
 ${({ $error }) =>
    $error &&
    `
   & ${FormFieldGrp},
   &:focus-within ${FormFieldGrp} {
     border-color: var(--err)!important;
   }
   & input::placeholder {
     color: var(--err);
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