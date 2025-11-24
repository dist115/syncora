export function Envelop(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 74 74"
      fill="none"
      {...props}
    >
      <path
        fill="#9570FF"
        d="M0 20C0 8.954 8.954 0 20 0h34c11.046 0 20 8.954 20 20v34c0 11.046-8.954 20-20 20H20C8.954 74 0 65.046 0 54V20Z"
      />
      <path
        fill="#BFA9FF"
        d="m16.049 32.096 20.06 7.686 20.06-7.686v12.29c0 5.522-4.477 10-10 10H26.05c-5.523 0-10-4.478-10-10v-12.29Z"
      />
      <path
        fill="#fff"
        d="M16.049 29.746a9.24 9.24 0 0 1 9.24-9.24h21.64a9.24 9.24 0 0 1 9.24 9.24l-20.06 7.7-20.06-7.7Z"
      />
    </svg>
  );
}
