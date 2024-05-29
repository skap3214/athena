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
        <div className="w-full text-right p-2 rounded-md justify-end items-end">
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
