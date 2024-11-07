import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { StaticData } from "../../staticData/historicalEvents";
import { getMinMaxYears } from "../../utils/getMinMax";
import { sortDataByYears } from "../../utils/sortDataByYears";
import { Swiper, SwiperSlide } from "swiper/react";
import "./indesx.scss";

import { Pagination, Navigation } from "swiper/modules";
import { EventCard } from "../../components/EventCard";

export const HistoricalDatesComponent = (props: { data: StaticData[] }) => {
  const [activeBtn, setActiveButton] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<any>(null);

  const sortedData = useMemo(() => {
    const selectedField = props.data[activeBtn];
    return sortDataByYears(selectedField);
  }, [props.data, activeBtn]);

  const handleSlideChange = useCallback((swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const onNext = useCallback(() => {
    if (swiperRef.current && activeIndex < sortedData.length - 1) {
      swiperRef.current.slideNext();
    }
  }, [activeIndex, sortedData, swiperRef]);

  const onPrev = useCallback(() => {
    if (swiperRef.current && activeIndex > 0) {
      swiperRef.current.slidePrev();
    }
  }, [activeIndex, swiperRef]);

  const minMaxYears = useMemo(() => {
    return getMinMaxYears(props.data[activeBtn]);
  }, [props.data, activeBtn]);

  return (
    <div className="mobile-screen">
      <div className="header">
        <p>Исторические даты</p>
      </div>

      <div className="years">
        <span style={{ color: "#3877EE" }}>{minMaxYears.min}</span>
        <span style={{ color: "#EF5DA8" }}>{minMaxYears.max}</span>
      </div>
      <div className="field">{props.data[activeBtn].field}</div>
      <div className="divider" />
      <div className="swiper-mobile">
        <Swiper
          className="swipe-container"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          slidesPerView={"auto"}
          spaceBetween={-40}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Pagination, Navigation]}
          style={{ width: "100%", height: "100%" }}
        >
          <div className="swipe-btns">
            <div className="dataCount">
              <span>{`0${activeIndex + 1}/0${props.data.length}`}</span>
              <div className="btns">
                <button
                  className="arrBtn"
                  style={{
                    opacity: isBeginning || sortedData.length < 3 ? 0.5 : 1,
                  }}
                  onClick={onPrev}
                  disabled={isBeginning || sortedData.length < 3 ? true : false}
                >
                  <span>{`<`}</span>
                </button>
                <button
                  className="arrBtn"
                  style={{
                    opacity: isEnd || sortedData.length <= 4 ? 0.5 : 1,
                  }}
                  disabled={isEnd || sortedData.length <= 4 ? true : false}
                  onClick={onNext}
                >
                  <span>{`>`}</span>
                </button>
              </div>
            </div>
          </div>
          {sortedData.map((eventData, index) => (
            <SwiperSlide
              key={index}
              className="sliddde"
              style={{ width: "85%" }}
            >
              <div
                style={{
                  width: "65%",
                  opacity: index === activeIndex ? 1 : 0.5,
                }}
              >
                <EventCard data={eventData} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HistoricalDatesComponent;
