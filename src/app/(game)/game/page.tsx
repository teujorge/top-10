import { Game } from "./game";
import { redirect } from "next/navigation";
import { GameProvider } from "./hooks/useGame";

type Props = {
  params: {};
  searchParams: Record<string, string | undefined>;
};

export default function GamePage(props: Props) {
  const ai = Boolean(props.searchParams.ai);
  const category = props.searchParams.category;

  if (!category) redirect("/categories");

  return (
    <GameProvider>
      <Game ai={ai} category={category} />
    </GameProvider>
  );
}
