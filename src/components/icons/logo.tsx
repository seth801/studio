import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="1em"
    height="1em"
    {...props}
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="hsl(var(--primary))"
      d="M188.4 46.6a97 97 0 0 0-120.8 0 8 8 0 1 0 8 14.8 81 81 0 0 1 104.8 0 8 8 0 1 0 8-14.8Z"
    />
    <path
      fill="hsl(var(--primary))"
      d="M128 24a8 8 0 0 0-8 8v16a8 8 0 0 0 16 0V32a8 8 0 0 0-8-8Z"
    />
    <path
      fill="hsl(var(--primary))"
      d="M149.2 165.2a8 8 0 0 0-8-4.8H116a8 8 0 0 0-4.8 14.8l20 20a8 8 0 0 0 11.2-11.2Z"
    />
    <path
      fill="hsl(var(--primary))"
      d="M192 72a8 8 0 0 0-8 8v16h-16a8 8 0 0 0 0 16h16v36a8 8 0 0 0 8 8h12a8 8 0 0 0 8-8v-68a8 8 0 0 0-8-8Z"
    />
    <path
      fill="hsl(var(--primary))"
      d="M96 96H80V80a8 8 0 0 0-16 0v16H48a8 8 0 0 0-8 8v12a8 8 0 0 0 8 8h52a8 8 0 0 0 8-8V80a8 8 0 0 0-8-8H88a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h8a8 8 0 0 0 0-16Z"
    />
    <path
      fill="hsl(var(--primary) / .5)"
      stroke="hsl(var(--primary))"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m162.4 195.2 20-36a8 8 0 0 0-13.6-8l-20 36a8 8 0 1 0 13.6 8Z"
    />
  </svg>
);

    