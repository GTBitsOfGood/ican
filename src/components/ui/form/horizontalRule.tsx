import { ReactNode } from "react";

interface HorizontalRuleProps {
  children: ReactNode;
  ruleClassName: string;
  textClassName: string;
}

export default function HorizontalRule({
  children,
  ruleClassName,
  textClassName,
}: HorizontalRuleProps) {
  return (
    <div className="relative flex py-6 items-center">
      <div className={`flex-grow border-t ${ruleClassName}`}></div>
      <span className={`flex-shrink mx-8 uppercase ${textClassName}`}>
        {children}
      </span>
      <div className={`flex-grow border-t ${ruleClassName}`}></div>
    </div>
  );
}
