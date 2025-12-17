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
} from "react-icons/fa6";

export default function icon({ icon = "house", ...className }) {
  const icons = {
    home: <FaHouse {...(className ? (className = { className }) : "")} />,
    palpites: (
      <FaSquareCheck {...(className ? (className = { className }) : "")} />
    ),
    friends: (
      <FaUserGroup {...(className ? (className = { className }) : "")} />
    ),
    amigos: <FaUserGroup {...(className ? (className = { className }) : "")} />,
    historico: (
      <FaRegClock {...(className ? (className = { className }) : "")} />
    ),
    comparador: (
      <FaChartSimple {...(className ? (className = { className }) : "")} />
    ),
    perfil: <FaUser {...(className ? (className = { className }) : "")} />,
    moon: <FaMoon {...(className ? (className = { className }) : "")} />,
    sun: <FaSun {...(className ? (className = { className }) : "")} />,
    menu: <FaBars {...(className ? (className = { className }) : "")} />,
    menuOpen: (
      <FaBarsStaggered {...(className ? (className = { className }) : "")} />
    ),
  };

  return (
    <>
      {icons[icon]}
      {/* {console.log(icon)} */}
    </>
  );
}
