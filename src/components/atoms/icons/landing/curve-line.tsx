export function CurveLine(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 925 54"
      fill="none"
      {...props}
    >
      <path
        stroke="#434A54"
        strokeDasharray="6 6"
        strokeOpacity={0.5}
        strokeWidth={2}
        d="M924.002 40.443C899.058 51.679 815.818 62.515 682.406 15.97c-166.765-58.182-215.09 78.717-413.94 22.912C137.511 2.13 98.636-11.457.75 36.302"
      />
    </svg>
  );
}
