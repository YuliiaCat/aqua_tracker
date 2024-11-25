import clsx from "clsx";
import css from "./UserBar.module.css";
import sprite from "../../img/sprite.svg";

const UserBar = ({ userName }) => {
  return (
    <button className={css.btnUserBar} type="button">
      <p className={css.nameUserBar}>{userName}</p>
      <img
        className={css.photoUser}
        src="https://imgcdn.stablediffusionweb.com/2024/3/31/a07c234b-ab97-4ad4-96b1-e1e88ec45e45.jpg"
        alt="user's photo"
      />
      <svg className={css.iconArrowDown}>
        <use href={`${sprite}#icon-chevron-down`}></use>
      </svg>

      <svg className={clsx(css.iconArrowUp, "visually-hidden")}>
        <use href={`${sprite}#icon-chevron-up`}></use>
      </svg>
    </button>
  );
};

export default UserBar;
