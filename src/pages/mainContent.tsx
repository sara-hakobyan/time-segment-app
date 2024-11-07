import { useCallback, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./styles.scss";
import { StaticData } from "../staticData/historicalEvents";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { sortDataByYears } from "../utils/sortDataByYears";
import { getMinMaxYears } from "../utils/getMinMax";
import { EventCard } from "../components/EventCard";

export function MainContent(props: { data: StaticData[] }) {
  const circleRef = useRef(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeBtn, setActiveButton] = useState(props.data.length - 1);
  const [currentRotation, setCurrentRotation] = useState(0);
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true); // Track if swiper is at the first slide
  const [isEnd, setIsEnd] = useState(false); // T
  const [isLoadigNext, setIsLoadingNext] = useState(false);

  const sortedData = useMemo(() => {
    const selectedField = props.data[activeBtn];
    return sortDataByYears(selectedField);
  }, [props.data, activeBtn]);

  const minMaxYears = useMemo(() => {
    return getMinMaxYears(props.data[activeBtn]);
  }, [props.data, activeBtn]);

  const rotationPerButton = useMemo(() => {
    return 360 / props.data.length;
  }, [props.data]);

  const rotateHandler = useCallback(
    (index: number) => {
      if (index === activeBtn) return;
      setIsLoadingNext(true);

      const targetRotation =
        currentRotation + (activeBtn - index) * rotationPerButton;

      gsap.to(circleRef.current, {
        rotation: targetRotation,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentRotation(targetRotation);
          setActiveButton(index);
          setIsLoadingNext(false);
        },
      });
    },
    [activeBtn, rotationPerButton, circleRef]
  );

  const handleNextClick = useCallback(() => {
    if (activeBtn === props.data.length - 1) {
      return;
    }
    rotateHandler(activeBtn + 1);
  }, [activeBtn, props.data, rotateHandler]);

  const handlePreviousClick = useCallback(() => {
    if (activeBtn === 0) {
      return;
    }
    rotateHandler(activeBtn - 1);
  }, [activeBtn, rotateHandler]);

  const handleSlideChange = useCallback(() => {
    const swiperInstance = swiperRef.current;
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  }, [swiperRef]);

  const onNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, [swiperRef]);

  const onPrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, [swiperRef]);

  return (
    <div className="mainContent">
      <div className="container">
        <div className="horizontal-line"></div>
        <div className="vertical-line"></div>
        <div className="header">
          <p>Исторические даты</p>
        </div>
        <div className="time-segment-container">
          <div className="circle-wrapper">
            <div ref={circleRef} className="central-circle">
              {props.data.map((data, index) => (
                <div key={index} className="btn-container">
                  <div className={` ${activeBtn === index ? "relative" : ""}`}>
                    <button
                      key={index}
                      ref={(el) => (buttonRefs.current[index] = el)}
                      className={`circle-button ${
                        activeBtn === index ? "active-btn" : ""
                      }`}
                      onClick={() => rotateHandler(index)}
                      style={{
                        transform: `translate(-50%, -50%) rotate(${
                          (360 / props.data.length) * index - 270
                        }deg) translate(0, -265px)`,
                      }}
                    >
                      <span
                        className="button-text"
                        style={{
                          transform: `rotate(${
                            360 -
                            ((360 / props.data.length) * index -
                              270 +
                              currentRotation)
                          }deg)`,
                        }}
                      >
                        {index + 1}
                        <span
                          className="field"
                          style={{
                            opacity:
                              !isLoadigNext && activeBtn === index ? 1 : 0,
                          }}
                        >
                          {props.data[index].field}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="years-wrapper">
              <span className="min-year" style={{ color: "#9DBEFD" }}>
                {minMaxYears.min}
              </span>
              <span className="max-year" style={{ color: "#FF5AEA" }}>
                {minMaxYears.max}
              </span>
            </div>
          </div>
          <div className="rotateBtn-container">
            <div className="btn-wrapper">
              <button
                className="rotateBtn"
                onClick={handlePreviousClick}
                disabled={activeBtn === 0 ? true : false}
              >
                <span>{`<`}</span>
              </button>
            </div>
            <div className="btn-wrapper">
              <button
                className="rotateBtn"
                onClick={handleNextClick}
                disabled={activeBtn === props.data.length - 1 ? true : false}
              >
                {" "}
                <span>{`>`}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="swipperContainer">
          {!isLoadigNext ? (
            <div className="swipe-wrap">
              <button
                className="swipe-btn"
                onClick={onPrev}
                style={{
                  visibility:
                    isBeginning || sortedData.length < 3 ? "hidden" : "visible",
                }}
              >
                <span>{`<`}</span>
              </button>
              <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={handleSlideChange}
                spaceBetween={80}
                slidesPerView={sortedData.length > 4 ? 4 : sortedData.length}
                navigation={false}
                modules={[Navigation]}
              >
                {sortedData.map((eventData, index) => (
                  <SwiperSlide key={index} className="swiperSlide">
                    <EventCard data={eventData} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                className="swipe-btn"
                onClick={onNext}
                style={{
                  visibility:
                    isEnd || sortedData.length <= 4 ? "hidden" : "visible",
                }}
              >
                <span>{`>`}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
