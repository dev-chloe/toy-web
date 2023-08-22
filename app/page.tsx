"use client";

import StyledComponentsRegistry from "./lib/Registries";
import ButtonImplement from "@/app/features/ButtonImplement";

export default function Home(): React.JSX.Element {
  return (
    <StyledComponentsRegistry>
      <ButtonImplement />
    </StyledComponentsRegistry>
  );
}
