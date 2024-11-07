export const EventCard = (props: { data: { year: number; event: string } }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        flexDirection: "column",
      }}
    >
      <p
        className="year"
        style={{
          fontSize: "25px",
          lineHeight: "30px",
          fontFamily: "Bebas Neue",
          color: "#3877EE",
          margin: "0px",
        }}
      >
        {props.data.year}
      </p>
      <p
        className="event"
        style={{
          fontSize: "20px",
          lineHeight: "30px",
          fontFamily: "PT Sans",
          color: "#42567A",
          margin: "0px",
          whiteSpace: "normal",
        }}
      >
        {props.data.event}
      </p>
    </div>
  );
};
