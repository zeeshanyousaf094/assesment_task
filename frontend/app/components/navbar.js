import Image from "next/image";
import Link from "next/link";
import Logo from "./blockchain.png";

export default function Navbar() {
  return (
    <nav>
      <Image
        src={Logo}
        alt="Jin Helpdesk Logo"
        width={70}
        quality={100}
        placeholder="blur"
      />
      <Link href="/">
        <h1>Next Blockchain</h1>
      </Link>
      <Link href="/hourly">Hourly Prices</Link>
      <Link href="/swaprate">Get Swap Rate</Link>
      <Link href="/alerts">Add Alerts</Link>
    </nav>
  );
}
