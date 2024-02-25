"use client";
import Link from "next/link";
import styled from "styled-components"

export const TPaginationWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  font-size: 0.8125rem;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
`;

export const TPaginationItem = styled(Link)`
  align-items: center;
  border: 1px solid var(--border-color);
  color: var(--secondary);
  display: flex;
  justify-content: center;
  height: 2rem;
  line-height: 1;
  transition: all 0.2s;
  width: 2rem;

  @media (min-width: 768px) {
    font-size: 0.875rem;
    height: 2.25rem;
    width: 2.25rem;
  }

  &:hover {
    border-color: var(--border-hover);
  }
`;

export const TPaginationDisabledItem = styled(TPaginationItem).attrs({
  as: "div",
  href: "#",
})`
  border: 1px solid var(--border-hover);
  color: var(--secondary);
  font-weight: 700;
`;
