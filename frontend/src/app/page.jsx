import Game from "@/components/game";

export default function Home() {
  const gameID = {
    hometeam: { name: "santos", src: "santos.png" },
    visitingteam: { name: "flamengo", src: "flamengo.png" },
  };

  return <>{/* <Game gameID={gameID} /> */}</>;
}
