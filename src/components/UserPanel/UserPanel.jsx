import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";

import { selectUser } from "../../redux/auth/selectors.js";
import LogOutModal from "../LogOutModal/LogOutModal.jsx";
import UserSettingsModal from "../UserSettingsModal/UserSettingsModal.jsx";
import UserBar from "../UserBar/UserBar.jsx";
import { openModal, selectIsOpenModal } from "../../redux/modal.js";
import UserBarPopover from "../UserBarPopover/UserBarPopover.jsx";

import css from "./UserPanel.module.css";

const UserPanel = () => {
  const dispatch = useDispatch();

  const modalType = useSelector((state) => state.modal.modalType);

  const userBarRef = useRef(null);

  const [showIconArrow, setShowIconArrow] = useState(true);
  const [isOpenUserBarPopover, setIsOpenUserBarPopover] = useState(false);

  const user = useSelector(selectUser);

  const newUser = user.data.user || user.data;

  const isOpenModal = useSelector(selectIsOpenModal);

  const toggleUserBarPopover = () => {
    setIsOpenUserBarPopover((prevState) => !prevState);
    setShowIconArrow((prevState) => !prevState);
  };

  const openModalWindow = (modalType) => {
    switch (modalType) {
      case "userSettings":
        dispatch(openModal("userSettings"));
        break;
      case "logOut":
        dispatch(openModal("logOut"));
        break;
      default:
        break;
    }
  };

  const closeModalWindow = () => {
    setIsOpenUserBarPopover(false);
    setShowIconArrow(true);
  };

  return (
    <>
      <div className={css.wrapperUserPanel}>
        <div>
          <p className={css.titleUserPanel}>
            Hello
            <span className={css.nameAcceptWeight}>, {newUser.name}!</span>
          </p>
        </div>

        <div ref={userBarRef} className={css.wrapperUserBar}>
          <UserBar
            openModal={openModalWindow}
            toggleUserBarPopover={toggleUserBarPopover}
            showIconArrow={showIconArrow}
          />
          {isOpenUserBarPopover && (
            <UserBarPopover
              userBarRef={userBarRef}
              openModal={openModalWindow}
              closeUserBarPopover={() => closeModalWindow("userBarPopover")}
            />
          )}
        </div>
      </div>
      {isOpenModal && modalType === "userSettings" && <UserSettingsModal />}

      {isOpenModal && modalType === "logOut" && <LogOutModal />}
    </>
  );
};

export default UserPanel;
