export default function ProductTable({ 
  products, 
  onEdit, 
  onRemove, 
  onManageSizes 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Images</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Details</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Sizes</th>
            <th className="p-2 text-left">Edit</th>
            <th className="p-2 text-left">Remove</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{product.id}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">
                <div className="flex gap-1">
                  {product.img?.slice(0, 2).map((img, idx) => (
                    <img
                      key={idx}
                      src={`./backend${img}`}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  ))}
                </div>
              </td>
              <td className="p-2">${product.price}</td>
              <td className="p-2 max-w-xs truncate">{product.detail}</td>
              <td className="p-2">{product.type}</td>
              <td className="p-2">
                <button
                  onClick={() => onManageSizes(product)}
                  className="px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                >
                  Sizes
                </button>
              </td>
              <td className="p-2">
                <button
                  onClick={() => onEdit(product)}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
              </td>
              <td className="p-2">
                <button
                  onClick={() => onRemove(product.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}