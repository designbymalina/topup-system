type CardProps = {
  title: string
  value: string
}

function Card({ title, value }: CardProps) {
  return (
    <section>
      <h3>{title}</h3>
      <p>{value}</p>
    </section>
  )
}

export default Card
