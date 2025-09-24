interface PaginationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  page?: number;
  maxPage?: number;
}

export function Pagination(props: PaginationProps) {
  console.log("page:", props.page);
  console.log("maxPage:", props.maxPage);

  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={props.onPrevious}
        disabled={!(props.page && props.page > 1)}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <h3 className="mx-4 text-white font-bold py-2 px-4 rounded">
        Page {props.page} / {props.maxPage}
      </h3>
      <button
        onClick={props.onNext}
        disabled={props.maxPage === props.page ? true : false}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        Next
      </button>
    </div>
  );
}
