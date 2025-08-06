import { Link } from "react-router-dom";

function SearchResults({ data, setQuery }) {
  return (
    <div className="absolute z-50 w-full max-h-[400px] overflow-scroll bg-white border border-t-0 outline-none ring-2 ring-gold/50 border-gold rounded-lg rounded-t-none">
      <div>
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gold">
            {data.map((product, i) => (
              <li key={i}>
                <Link
                  to={`/collections/${product?.id}`}
                  key={product.id}
                  className="cursor-pointer flex py-6 px-4 hover:bg-gold/10 transition-colors"
                  onClick={() => setQuery("")}
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + product?.images[0]}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col items-start relative">
                    <div>
                      <div className="flex justify-between text-base text-ellipsis font-medium text-black">
                        <h3>{product.name}</h3>
                      </div>
                    </div>
                    <p className="text-base font-medium absolute bottom-2">
                      <span>₹</span>
                      {product.sellingPrice}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
