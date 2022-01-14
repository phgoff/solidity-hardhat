type HeaderProps = {
  connect: () => void;
  user: string;
};

const Header = ({ connect, user }: HeaderProps) => {
  return (
    <div className="flex flex-row justify-between w-full shadow-md">
      <div>
        <h1>Logo</h1>
      </div>
      <div className="m-2 sm:block">
        {user}
        <button
          className="bg-indigo-400  text-white rounded font-semibold"
          onClick={connect}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default Header;
