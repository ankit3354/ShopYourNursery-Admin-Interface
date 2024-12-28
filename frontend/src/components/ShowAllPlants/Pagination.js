import { jsx as _jsx } from "react/jsx-runtime";
import PageButton from "./PageButton";
export default function Pagination({ pages, activePage, handlePage }) {
    return (_jsx("div", { className: "flex justify-start items-center gap-x-2 my-10 ml-16", children: Array.from({ length: parseInt(pages) }).map((_, index) => (_jsx(PageButton, { onClick: () => handlePage(index + 1), num: index + 1, flag: activePage == index + 1 ? true : false }, index))) }));
}
