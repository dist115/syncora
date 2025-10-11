export function Tick(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        fill="#BBF7D0"
        fillRule="evenodd"
        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"
        clipRule="evenodd"
      />
      <path
        fill="#15803D"
        d="M7.331 10.667a.469.469 0 0 1-.33-.135L4.8 8.362l.661-.651 1.87 1.843 3.741-3.687.661.652-4.07 4.013a.469.469 0 0 1-.332.135Z"
      />
    </svg>
  );
}
