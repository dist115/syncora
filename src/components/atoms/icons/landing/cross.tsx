export function Cross(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        fill="#FECDD3"
        fillRule="evenodd"
        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"
        clipRule="evenodd"
      />
      <path
        fill="#E11D48"
        d="m8.535 7.995 2.36-2.36a.375.375 0 0 0-.53-.53l-2.36 2.36-2.36-2.36a.375.375 0 0 0-.53.53l2.36 2.36-2.36 2.36a.375.375 0 1 0 .53.53l2.36-2.36 2.36 2.36a.375.375 0 0 0 .53-.53l-2.36-2.36Z"
      />
    </svg>
  );
}
