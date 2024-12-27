import PageButton from "./PageButton";

export default function Pagination({ pages, activePage, handlePage }: any) {
  return (
    <div className="flex justify-start items-center gap-x-2 my-10 ml-16">
      {Array.from({ length: parseInt(pages) }).map((_, index) => (
        <PageButton
          key={index}
          onClick={() => handlePage(index + 1)}
          num={index + 1}
          flag={activePage == index + 1 ? true : false}
        />
      ))}
    </div>
  );
}
