'use client';

import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion';

interface AnimatedCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  from: number;
  to: number;
}

function AnimatedCounter(props: AnimatedCounterProps) {
  const { from, to, ...rest } = props;
  const ref = useRef(null);
  const inView = useInView(ref);
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));


  useEffect(() => {
    if (inView) {
      animate(count, to, { duration: 2 });
    }
  }, [count, inView, to]);

  return (
    <span {...rest}>
      <motion.span ref={ref}>{rounded}</motion.span>
    </span>
  );
}

export default AnimatedCounter;
