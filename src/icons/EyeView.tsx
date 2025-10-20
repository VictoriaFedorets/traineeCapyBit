import React from "react";

interface EyeViewProps {
  size?: number;
  className?: string;
}

const EyeViewIcon: React.FC<EyeViewProps> = ({ className }) => {
  return (
    <span role="img" aria-label="eye" className={className}>
      👁️
    </span>
  );
};

export default EyeViewIcon;

// import React from "react";

// interface EyeViewProps {
//   size?: number;
//   className?: string;
// }

// const EyeViewIcon: React.FC<EyeViewProps> = ({ size = 20, className }) => {
//   return (
//     <img
//       src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f441.svg"
//       alt="eye"
//       width={size}
//       height={size}
//       className={className}
//       draggable={false}
//     />
//   );
// };

// export default EyeViewIcon;
