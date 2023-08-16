"use client";

import StyledComponentsRegistry from "./lib/Registries";
import styled from "styled-components";
import ButtonImplement from "@/app/features/ButtonImplement";
import {Skeleton} from "@/app/features/TestStyledComponent";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem /* 24px */;
`;

export default function Home(): React.JSX.Element {
  return (
    <StyledComponentsRegistry>
      <ButtonImplement />
      <Container>
        <Skeleton />
      </Container>
    </StyledComponentsRegistry>
  );
}
