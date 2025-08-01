import React, { ReactNode } from "react";
import "../../../assets/styles/header/fixed-header.css";
type Props = {
  title?: string;
  children?: ReactNode;
};

const FixedHeader: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="fixed-header-wrapper">
      <h3>{title || children}</h3>
    </div>
  );
};

export default FixedHeader;
