import Shape from '@/components/Shape'
import { ICard } from '@/core/types/Card'
import { useSortable } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { FC } from 'react'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  card: ICard
  onClick: () => void
  isSelected?: boolean
  delay?: number
}

const Card: FC<Props> = ({ card, onClick, isSelected, delay = 0 }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${card.color}-${card.shape}-${card.filling}-${card.size}`,
    data: {
      type: 'Card',
      card,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        className={clsx(
          'card',
          `--color-${card.color.toLowerCase()}`,
          `--filling-${card.filling.toLowerCase()}`,
          isSelected && '--selected',
          '--low-opacity'
        )}
        ref={setNodeRef}
        onClick={onClick}
        {...attributes}
        {...listeners}
      >
        <div className="card__shapes">
          {[...Array(card.size)].map((_, i) => (
            <Shape key={i} shape={card.shape} filling={card.filling} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'card',
        `--color-${card.color.toLowerCase()}`,
        `--filling-${card.filling.toLowerCase()}`,
        isSelected && '--selected'
      )}
      ref={setNodeRef}
      onClick={onClick}
      style={{
        animationDelay: `${delay * 350}ms`,
        ...style,
      }}
      {...attributes}
      {...listeners}
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
