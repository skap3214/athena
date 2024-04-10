import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <>
      <Image
        src="/loader"
        alt="loader"
        className="dark:block hidden"
        height={150}
        width={150}
      />
      <Image
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
