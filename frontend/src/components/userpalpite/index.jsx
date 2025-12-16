export default function UserPalpite({ userID }) {
  return (
    <div>
      <img src={`/palpite/${userID}.png`} alt="Palpite" />
      <img src={`/profile/${userID}.png`} alt="Foto de perfil" />
    </div>
  );
}
