export function TBBgPattern(props: React.SVGAttributes<{}>) {
  return (
    <svg viewBox="0 0 993 496" {...props}>
      <path
        stroke="url(#a-bg-pattern-vector)"
        strokeOpacity={0.5}
        d="M97.066 0 92.14 488.072M544.371 4.132l-4.925 488.071M324.158 2.098l-4.925 488.071M769.169 6.207l-4.925 488.072M207.17 1.017l-4.925 488.072M656.77 5.169l-4.925 488.072M434.262 3.114l-4.925 488.072M881.568 7.246l-4.925 488.072M.136 400.786l988.654 9.131M2.242 192.033l988.654 9.131M1.171 297.88l988.655 9.131M3.308 86.186l988.654 9.13"
      />
      <defs>
        <radialGradient
          id="a-bg-pattern-vector"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(90.082 124.373 371.498) scale(247.659 495.693)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={1} stopColor="#FFC34C" stopOpacity={0.18} />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  );
}
