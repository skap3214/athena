import React, { ReactNode } from "react";

const Message = ({
  role,
  children,
}: {
  role: "ai" | "human";
  children: ReactNode;
}) => {
  return (
    <>
      {role === "human" ? (
        <div className="max-w-[70%] w-fit p-2 border border-neutral-400 rounded-md ml-auto text-right">
          {children}
        </div>
      ) : (
        <div className="w-fit p-2 max-w-[70%] rounded-md text-black bg-neutral-300">
          {children}
        </div>
      )}
    </>
  );
};

export default Message;
