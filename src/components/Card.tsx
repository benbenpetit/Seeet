import Shape from '@/components/Shape'
import { ICard } from '@/core/types/Card'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  card: ICard
  onClick: () => void
  isSelected?: boolean
  delay?: number
}

const Card: FC<Props> = ({ card, onClick, isSelected, delay = 0 }) => {
  return (
    <div
      className={clsx(
        'card',
        `--color-${card.color.toLowerCase()}`,
        `--filling-${card.filling.toLowerCase()}`,
        isSelected && '--selected'
      )}
      onClick={onClick}
      style={{ animationDelay: `${delay * 350}ms` }}
    >
      <div className="card__shapes">
        {[...Array(card.size)].map((_, i) => (
          <Shape key={i} shape={card.shape} filling={card.filling} />
        ))}
      </div>
    </div>
  )
}

export default Card
