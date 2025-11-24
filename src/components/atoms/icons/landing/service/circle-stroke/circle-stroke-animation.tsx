import { Box } from '@/components/atoms/layout';

const circles = [
  {
    id: 1,
    radius: 228.5,
    svgProps: {
      className:
        'absolute top-0 left-0 opacity-30 w-full h-auto animate-rotation-anticlockwise',
    },
  },
  {
    id: 2,
    radius: 204.5,
    svgProps: {
      className:
        'absolute top-0 left-0 opacity-30 w-full h-auto animate-rotation-clockwise',
    },
  },
  {
    id: 3,
    radius: 175.5,
    svgProps: {
      className:
        'absolute top-0 left-0 opacity-30 w-full h-auto animate-rotation-anticlockwise',
    },
  },
  {
    id: 4,
    radius: 149.5,
    svgProps: {
      className:
        'absolute top-0 left-0 opacity-30 w-full h-auto animate-rotation-clockwise',
    },
  },
  {
    id: 5,
    radius: 127.5,
    svgProps: {
      className:
        'absolute top-0 left-0 opacity-30 w-full h-auto animate-rotation-anticlockwise',
    },
  },
  {
    id: 6,
    radius: 106.5,
    svgProps: {
      className:
        'absolute top-0 left-0 opacity-50 w-full h-auto animate-rotation-clockwise',
    },
  },
];

export function CircleStrokeAnimation() {
  return (
    <Box className="w-full h-full relative">
      {circles.map((circle) => (
        <Stroke
          key={circle.id}
          radius={circle.radius}
          svgProps={circle.svgProps}
        />
      ))}
      <Bubbles className="w-full h-auto animate-rotation-clockwise absolute top-0 left-0 " />
    </Box>
  );
}

function Stroke({
  radius,
  svgProps,
}: {
  radius: number;
  svgProps?: React.SVGAttributes<{}>;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 480"
      fill="none"
      {...(svgProps || {})}
    >
      <circle
        cx={240}
        cy={240}
        r={radius}
        stroke="#3AAED5"
        strokeDasharray="41 30 109 55"
        strokeLinecap="round"
        strokeMiterlimit={16}
        strokeWidth={3}
      />
    </svg>
  );
}

function Bubbles(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 480"
      fill="none"
      {...props}
    >
      <path
        fill="#3AAED5"
        d="M47.481 123.352a7.48 7.48 0 1 0 0-14.96 7.48 7.48 0 1 0 0 14.96ZM238.595 17.96a7.481 7.481 0 1 0-7.481-7.48 7.48 7.48 0 0 0 7.481 7.48Z"
      />
      <path
        fill="#3D85FD"
        d="M90.34 103.193a2.841 2.841 0 1 1-5.682 0 2.841 2.841 0 0 1 5.683 0Zm322.363-16.351a2.846 2.846 0 0 1-1.756 2.64 2.854 2.854 0 0 1-3.893-2.077 2.856 2.856 0 0 1 1.219-2.928 2.852 2.852 0 0 1 1.588-.477 2.842 2.842 0 0 1 2.842 2.842ZM144.627 34.699a2.842 2.842 0 1 0 .001-5.685 2.842 2.842 0 0 0-.001 5.685Z"
      />
      <path
        fill="#FFB44F"
        d="M51.036 165.038a2.842 2.842 0 1 0 0-5.684 2.842 2.842 0 0 0 0 5.684Zm381.949 24.474a2.841 2.841 0 1 0 .001-5.683 2.841 2.841 0 0 0-.001 5.683Zm40.347 32.451a5.23 5.23 0 0 1-3.232 4.835 5.23 5.23 0 0 1-5.705-1.134 5.237 5.237 0 0 1-1.135-5.704 5.228 5.228 0 0 1 4.837-3.231 5.231 5.231 0 0 1 5.235 5.234ZM314.657 48.048a6.196 6.196 0 0 1-10.584 4.379 6.192 6.192 0 0 1-1.338-6.757 6.204 6.204 0 0 1 10.112-2.003 6.176 6.176 0 0 1 1.81 4.381Z"
      />
      <path
        fill="#3AAED5"
        d="M445.85 335.846a7.481 7.481 0 1 0 7.481 7.48c0-4.131-3.35-7.48-7.481-7.48ZM242.736 460.237a7.481 7.481 0 1 0 7.481 7.48 7.48 7.48 0 0 0-7.481-7.48Z"
      />
      <path
        fill="#3D85FD"
        d="M386.99 332.004a2.846 2.846 0 0 1 1.755-2.625 2.84 2.84 0 0 1 3.713 3.712 2.838 2.838 0 0 1-4.635.922 2.84 2.84 0 0 1-.833-2.009ZM78.685 369.918a2.848 2.848 0 0 1 1.756-2.641 2.856 2.856 0 0 1 3.892 2.078 2.85 2.85 0 0 1-2.806 3.405 2.843 2.843 0 0 1-2.842-2.842Zm265.019 43.58a2.843 2.843 0 1 0 0 5.686 2.843 2.843 0 0 0 0-5.686Z"
      />
      <path
        fill="#FFB44F"
        d="M437.295 289.159a2.843 2.843 0 1 0 .002 5.686 2.843 2.843 0 0 0-.002-5.686ZM37.346 264.685a2.842 2.842 0 1 0-.001 5.683 2.842 2.842 0 0 0 0-5.683ZM6 232.235a5.23 5.23 0 0 1 3.232-4.836 5.237 5.237 0 0 1 7.138 3.814A5.236 5.236 0 1 1 6 232.235Zm167.675 170.914a6.194 6.194 0 0 1 7.41-6.077 6.196 6.196 0 0 1-1.222 12.274 6.198 6.198 0 0 1-4.379-1.816 6.177 6.177 0 0 1-1.809-4.381Z"
      />
    </svg>
  );
}
