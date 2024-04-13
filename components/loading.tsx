import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <>
      <Image
        draggable={false}
        src="/loader.svg"
        alt="loader"
        className="dark:block hidden"
        height={150}
        width={150}
      />
      <Image
        draggable={false}
        src="/loader-dark.svg"
        alt="loader"
        className="dark:hidden"
        height={150}
        width={150}
      />
    </>
  );
};

export default Loading;
