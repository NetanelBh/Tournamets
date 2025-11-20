const TableRow = ({user, index, columns}) => {
  return (
    <tr className="border-b dark:border-neutral-500">
      {columns.map((col, i) => (
        <td
          key={i}
          className={col.className}
        >
          {col.key === "rank" ? index + 1 : user[col.key]}
        </td>
      ))}
    </tr>
  )
}

export default TableRow