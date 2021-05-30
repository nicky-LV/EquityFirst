import {Recommendations} from "../../../../../ts/types";
const people = [
  { name: 'Jane Cooper', title: 'Regional Paradigm Technician', role: 'Admin', email: 'jane.cooper@example.com' },
  { name: 'Cody Fisher', title: 'Product Directives Officer', role: 'Owner', email: 'cody.fisher@example.com' },
  // More people...
]

export default function RecommendationTable(props) {
  return (
    <div className="flex flex-col border border-gray-200 sm:rounded-lg">
      <div className="-my-2 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    Recommendation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {props.recommendations.map((data) => (
                  <tr key={data[0]} className={data[0] === Recommendations.HOLD && "bg-gray-100"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">{data[1]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-indigo-600 font-bold text-center">{data[0]}</td>
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
