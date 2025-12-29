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
  FaTerminal,
  FaDev,
  FaCalendarDays,
  FaCaretDown,
  FaCirclePlay,
  FaAnglesLeft,
  FaAnglesRight,
  FaEquals,
  FaMagnifyingGlass,
  FaStar,
  FaPlus,
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
  circlePlay: FaCirclePlay,
  eyeOpen: FaEye,
  eyeClose: FaEyeSlash,
  lock: FaLock,
  terminal: FaTerminal,
  admin: FaDev,
  calendar: FaCalendarDays,
  down: FaCaretDown,
  arrowTwoLeft: FaAnglesLeft,
  arrowTwoRight: FaAnglesRight,
  equal: FaEquals,
  find: FaMagnifyingGlass,
  star: FaStar,
  plus: FaPlus,
};

export default function Icon({ icon = "home", className, ...props }) {
  const IconComponent = iconsMap[icon];

  if (!IconComponent) return null;

  return <IconComponent className={className} {...props} />;
}
