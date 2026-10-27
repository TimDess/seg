import Image from "next/image";

export default function Logo() {
  return (
    <Image
      className="seg-logo"
      src="/images/seg-logo.png"
      width={2172}
      height={724}
      alt="SEG — Sadeq Électricité Générale"
      unoptimized
    />
  );
}
