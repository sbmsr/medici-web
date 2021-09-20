const galleries = [
  {
    id: 1,
    name: 'Blue Period1',
    earnings: '$100.00',
    sales: 12,
    views: 2000,
    date: Date.parse('2021-09-20 18:04:02.16207+00'),
  },
  {
    id: 2,
    name: 'Blue Period 2',
    earnings: '$100.00',
    sales: 12,
    views: 2000,
    date: Date.parse('2021-09-20 18:04:02.16207+00'),
  },
]

export default function Table(): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Earnings
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sales
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Views
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Posted
                  </th>
                </tr>
              </thead>
              <tbody>
                {galleries.map((gallery, idx) => (
                  <tr
                    key={gallery.name}
                    className={
                      idx % 2 === 0
                        ? 'bg-white hover:bg-gray-100 cursor-pointer'
                        : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                    }
                    onClick={() => alert(`clicked ${gallery.name}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {gallery.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gallery.earnings}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gallery.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gallery.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gallery.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
