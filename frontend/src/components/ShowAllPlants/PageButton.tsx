export default function PageButton({ num, flag, onClick }: any) {
    return (
      <button
        onClick={onClick}
        className={` border-[2px] rounded-[3.125rem] inline-flex justify-center items-center p-3 font-Poppins font-medium ${
          flag ? "border-[#88B06F] bg-[#DDF2D0]" : "border-[#E8E8E8] bg-[#FFFFFF]"
        }`}
      >
        {num}
      </button>
    );
  }
  