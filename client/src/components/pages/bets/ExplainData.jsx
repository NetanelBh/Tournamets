const ExplainData = ({data}) => {
  return (
    data.map((item, index) => (
      <p key={index} className="text-body">{index + 1}) {item}</p>
    ))
  )
}

export default ExplainData