import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";
import { HiArrowDown, HiOutlineDotsVertical } from "react-icons/hi";
import ethLogo from "../assets/eth.png";
import uniswapLogo from "../assets/favicon.ico";
import { TransactionContext } from "../context/TransactionContext";

const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `hidden lg:flex-1 lg:flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.8rem] font-semibold cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#172A42] border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center text-[#4F90EA]`,
};

const Header = () => {
  const [selectedNav, setSelectedNav] = useState("swap");
  const [username, setUsername] = useState();
  const { connectWallet, currentAccount, walletBalance } =
    useContext(TransactionContext);

  useEffect(() => {
    setUsername(
      `${currentAccount?.slice(0, 6)}...${currentAccount?.slice(-4)}`
    );
  }, [currentAccount]);

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <Image
          src={uniswapLogo}
          width={40}
          height={40}
          className="rounded-2xl"
        />
      </div>
      <div className={style.nav}>
        <div className={style.navItemsContainer}>
          <div
            className={`${style.navItem} ${
              selectedNav === "swap" && style.activeNavItem
            }`}
            onClick={() => setSelectedNav("swap")}
          >
            Pay
          </div>

          <a
            href="https://docs.uniswap.org/#/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={style.navItem}>
              Charts <FiArrowUpRight />
            </div>
          </a>
        </div>
      </div>
      <div className={style.buttonsContainer}>
        <div className={`${style.button} ${style.buttonPadding}`}>
          <div className={style.buttonIconContainer}>
            <Image src={ethLogo} width={20} height={20} />
          </div>
          <p>Ethereum</p>
          <div className={style.buttonIconContainer}>
            <AiOutlineDown />
          </div>
        </div>

        {currentAccount ? (
          <div className={`${style.button} ${style.buttonPadding}`}>
            <div className={`${style.buttonAccent} ${style.buttonPadding}`}>
              {username}
            </div>
          </div>
        ) : (
          <div
            onClick={() => connectWallet()}
            className={`${style.button} ${style.buttonPadding}`}
          >
            <div className={`${style.buttonAccent} ${style.buttonPadding}`}>
              Connect Wallet
            </div>
          </div>
        )}

        <div className={`${style.button} ${style.buttonPadding}`}>
          <div className={`${style.buttonAccent} ${style.buttonPadding}`}>
            {currentAccount && walletBalance ? walletBalance.slice(0, 5) : 0.0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
