import type { SVGProps } from 'react';

export function AetherLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M50 10 L15 40 L15 70 L50 90 L85 70 L85 40 L50 10Z"
        stroke="hsl(var(--primary))"
        strokeWidth="8"
        fill="transparent"
      />
      <path
        d="M50 10 L50 50"
        stroke="hsl(var(--accent))"
        strokeWidth="6"
      />
       <path
        d="M15 40 L50 50 L85 40"
        stroke="hsl(var(--accent))"
        strokeWidth="6"
      />
      <circle cx="50" cy="50" r="8" fill="hsl(var(--accent))" />
    </svg>
  );
}
