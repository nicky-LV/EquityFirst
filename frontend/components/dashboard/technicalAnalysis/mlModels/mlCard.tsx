export default function MlCard() {
  return (
    <div className="bg-gray-800 px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg">
      <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <h3 className="text-lg leading-6 font-bold text-white">Machine Learning Models</h3>
          <p className="mt-1 text-sm text-white">
            Unlock data-driven insights and predictions from pre-made machine learning models.
          </p>
        </div>
        <div className="ml-4 mt-4 flex-shrink-0">
          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}
