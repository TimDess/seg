import Image from "next/image";

export default function Logo() {
  return (
    <Image
      className="seg-logo"
      src="/images/seg-logo.svg"
      width={2508}
      height={782}
      alt="SEG — Sadeq Électricité Générale"
      unoptimized
    />
  );
}
