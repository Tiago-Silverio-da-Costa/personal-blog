"use client";
import Link from "next/link";
import styled from "styled-components";

export const TActionsItem = styled.button<{
  $active?: boolean;
}>`
  align-items: center;
  display: flex;
  gap: 0.375rem;
  letter-spacing: 0.02em;
  opacity: 0.9;
  transition: all 0.1s;

  &:hover {
    opacity: 1;
  }

  ${({ $active }) =>
    $active &&
    `
		opacity: 1;
  `}
`;

export const TActionsDropdown = styled.div`
  background-color: var(--primary);
  color: var(--secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  max-width: 80vw;
  padding: 0.4375rem 0;
  position: absolute;
  right: 0;
  top: 100%;
  width: max-content;
  z-index: 20;
`;


export const TActionsItemWrapper = styled.div`
  position: relative;
  letter-spacing: 0.03em;

  ${TActionsDropdown} {
    left: 0;

    @media (min-width: 768px) {
      left: auto;
      right: 0;
    }
  }
`;

export const TActionsDropdownItem = styled(Link)`
  align-items: center;
  display: flex;
  font-size: 0.8125rem;
  font-weight: 400;
  gap: 0.5rem;
  padding: 0.5rem 0.8125rem 0.375rem;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background-color: var(--border-hover);
  }
`;