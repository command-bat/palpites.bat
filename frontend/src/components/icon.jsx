"use client";
import {
  FaHouse,
  FaSquareCheck,
  FaUserGroup,
  FaRegClock,
  FaChartSimple,
  FaUser,
  FaMoon,
  FaSun,
  FaBars,
  FaBarsStaggered,
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa6";

const iconsMap = {
  home: FaHouse,
  palpites: FaSquareCheck,
  friends: FaUserGroup,
  amigos: FaUserGroup,
  historico: FaRegClock,
  comparador: FaChartSimple,
  perfil: FaUser,
  moon: FaMoon,
  sun: FaSun,
  menu: FaBars,
  menuOpen: FaBarsStaggered,
  circleCheck: FaCircleCheck,
  circleX: FaCircleXmark,
  circleClock: FaClock,
  eyeOpen: FaEye,
  eyeClose: FaEyeSlash,
  lock: FaLock,
};

export default function Icon({ icon = "home", className, ...props }) {
  const IconComponent = iconsMap[icon];

  if (!IconComponent) return null;

  return <IconComponent className={className} {...props} />;
}
