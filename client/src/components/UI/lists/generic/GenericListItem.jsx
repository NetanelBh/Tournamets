import styles from './GenericListItem.module.css';
const GenericListItem = ({item, index}) => {
  console.log(index);
  const classes = `${styles.list_item} border-gray-200 border rounded-lg mt-3 mb-1 shadow`;
  
    return (
    <li className={classes} style={{animationDelay: `${index * 0.2}s` }}>
        <div className=" px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
                <img src={item.symbol} alt="tournament symbol" style={{width: "90px", height: "70px"}}/>
                <p className="mt-1 max-w-2xl text-lg text-gray-800 font-medium">{item.name}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Status: <span className="text-green-600">Active</span></p>
                <button className="px-4 w-fill bg-gray-700 hover:bg-gray-600 active:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-colors">כניסה</button>
            </div>
        </div>
    </li>
  )
}

export default GenericListItem