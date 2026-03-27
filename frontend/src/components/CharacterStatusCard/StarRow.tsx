const StarRow = ({ count, max = 5 }: { count: number; max?: number }) => {
  return (
    <div className="star-row">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 10 10"
          width="12"
          height="12"
          className={`star-row__star ${i < count ? "star-row__star--active" : ""}`}
        >
          <polygon
            points="5,1 6.2,3.8 9.5,4 7,6.2 7.8,9.5 5,7.8 2.2,9.5 3,6.2 0.5,4 3.8,3.8"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRow;
