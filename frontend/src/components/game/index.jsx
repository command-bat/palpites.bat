import UserPalpite from "../userpalpite";

export default function Game({ gameID }) {
  const userID = 11;

  return (
    <div>
      <img
        src={"/placeholder/" + gameID.hometeam.src}
        alt={gameID.hometeam.name}
      />
      <img
        src={"/placeholder/" + gameID.visitingteam.src}
        alt={gameID.visitingteam.name}
      />
      {/* <p>{gameID}</p> */}

      <UserPalpite userID={userID} />
    </div>
  );
}
