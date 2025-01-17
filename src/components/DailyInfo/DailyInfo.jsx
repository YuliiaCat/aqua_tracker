import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";

import sprite from "../../img/sprite.svg";
import {
  selectWaterInfoDay,
  setEditingRecord,
} from "../../redux/water/dailyInfoSlice";
import { closeModal, openModal } from "../../redux/modal";
import {
  fetchWaterRecords,
  updateWaterRecord,
  apiWaterDay,
} from "../../redux/water/dailyInfoThunk";
import EditModal from "../EditModal/EditModal";
import DeleteWaterModal from "../DeleteWaterModal/DeleteWaterModal";
import { Scrollbar, Mousewheel } from "swiper/modules";
import {
  selectCurrentSelectedDate,
  selectCurrentSelectedFullDate,
} from "../../redux/date.js";
import WaterForm from "../WaterForm/WaterForm.jsx";
import WaterModal from "../WaterModal/WaterModal.jsx";

import "swiper/css/scrollbar";
import "swiper/css";
import styles from "./DailyInfo.module.css";

const DailyInfo = () => {
  const dispatch = useDispatch();
  const date = useSelector(selectCurrentSelectedDate);
  const fullDate = useSelector(selectCurrentSelectedFullDate);
  const waterInfoDay = useSelector(selectWaterInfoDay);
  const [idForDelete, setIdForDelete] = useState("");
  const [infoEdit, setInfoEdit] = useState({
    id: null,
    amount: null,
    date: null,
  });

  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const modalType = useSelector((state) => state.modal.modalType);

  const handleClose = () => dispatch(closeModal());

  useEffect(() => {
    dispatch(fetchWaterRecords());
  }, [dispatch]);

  const handleAddWater = () => {
    const now = new Date();

    const defaultTime = `${new Date(now).getHours()}:${new Date(
      now
    ).getMinutes()}`;

    dispatch(openModal("edit"));
    dispatch(
      setEditingRecord({
        id: null,
        amount: 250,
        time: defaultTime,
      })
    );
  };

  const openDeleteModal = (id) => {
    dispatch(openModal("delete"));
    setIdForDelete(id);
  };

  const openEditModal = (id, amount, date) => {
    setInfoEdit({ id, amount, date });
    dispatch(openModal("WaterForm"));
  };

  const confirmUpdateWater = (id, amount, time) => {
    dispatch(updateWaterRecord({ id, updatedRecord: { amount, time } }));
  };

  useEffect(() => {
    dispatch(apiWaterDay(fullDate));
  }, [dispatch, fullDate]);

  return (
    <div className={`${styles.dailyInfo}`}>
      <div className={styles.dailyHeader}>
        <h3 className={styles.DailyInfoTitle}>{date}</h3>
        <div className={styles.addWaterWrap}>
          <button className={styles.addWaterBtn} onClick={handleAddWater}>
            <svg className={styles.iconAddWater} width={30} height={30}>
              <use href={`${sprite}#icon-add`} />
            </svg>
          </button>
          <p className={styles.addWaterText}>Add water</p>
        </div>
      </div>
      <div className={styles.cardsContainer}>
        {waterInfoDay.length > 0 && (
          <Swiper
            modules={[Mousewheel, Scrollbar]}
            slidesPerView={2.1}
            scrollbar={{ draggable: true }}
            style={{ paddingBottom: "24px", zIndex: 0 }}
            spaceBetween={8}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            mousewheel={true}
          >
            {waterInfoDay.map((record) => (
              <SwiperSlide key={record._id} className={styles.card}>
                <div className={styles.cardContent}>
                  <svg className={styles.glassIcon} width={38} height={38}>
                    <use href={`${sprite}#icon-glass`} />
                  </svg>
                  <div className={styles.contentTextWrap}>
                    <span className={styles.waterAmount}>
                      {record.amount >= 1000
                        ? `${(record.amount / 1000)
                            .toFixed(1)
                            .replace(".", ",")} L`
                        : `${record.amount} ml`}
                    </span>
                    <span className={styles.time}>
                      {`${new Date(record.date)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${new Date(record.date)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                    </span>
                  </div>
                  <div className={styles.btnWrap}>
                    <button
                      className={styles.editBtn}
                      onClick={() =>
                        openEditModal(record._id, record.amount, record.date)
                      }
                    >
                      <svg className={styles.iconEdit} width={14} height={14}>
                        <use href={`${sprite}#icon-edit`} />
                      </svg>
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => openDeleteModal(record._id)}
                    >
                      <svg className={styles.iconTrash} width={14} height={14}>
                        <use href={`${sprite}#icon-trash`} />
                      </svg>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {isModalOpen && modalType === "delete" && (
        <DeleteWaterModal id={idForDelete} />
      )}

      {isModalOpen && modalType === "edit" && (
        <EditModal onConfirm={confirmUpdateWater} />
      )}

      {isModalOpen && modalType === "WaterForm" && (
        <WaterModal onCloseModal={handleClose}>
          <WaterForm infoEdit={infoEdit} />
        </WaterModal>
      )}
    </div>
  );
};

export default DailyInfo;
