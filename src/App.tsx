import { ICard } from '@/core/types/Card'
import '@/styles/main.scss'
import { useEffect, useState } from 'react'
import { ALL_CARDS } from '@/core/data/cards'
import shuffle from 'lodash.shuffle'
import isEqual from 'lodash.isequal'
import Card from '@/components/Card'

const FILLINGS: ICard['filling'][] = ['SOLID', 'STRIPED', 'EMPTY']
const COLORS: ICard['color'][] = ['GREEN', 'PURPLE', 'RED']
const SHAPES: ICard['shape'][] = ['OVAL', 'LOZENGE', 'WAVE']

const App = () => {
  const [deck, setDeck] = useState<ICard[]>([])
  const [placedCards, setPlacedCards] = useState<ICard[]>([])
  const [selectedCards, setSelectedCards] = useState<ICard[]>([])
  const [doneSets, setDoneSets] = useState(0)

  useEffect(() => {
    setDeck(shuffle(ALL_CARDS))
  }, [])

  const getGridStyling = (length: number) => {
    if (length <= 3) {
      return {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(1, 1fr)',
      }
    } else if (length <= 6) {
      return {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
      }
    } else if (length <= 9) {
      return {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
      }
    } else if (length <= 12) {
      return {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
      }
    } else if (length <= 15) {
      return {
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
      }
    } else {
      return {
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
      }
    }
  }

  const handleCardClick = (card: ICard) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card))
    } else {
      if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, card])
      }
    }
  }

  const addThreeCardsToBoard = () => {
    if (deck.length > 0) {
      setPlacedCards([...placedCards, ...deck.splice(0, 3)])
    }
  }

  const getIsSet = (cards: ICard[]) => {
    const supposedLastCard = {
      filling:
        cards[0].filling === cards[1].filling
          ? cards[0].filling
          : FILLINGS.find(
              (filling) =>
                ![cards[0].filling, cards[1].filling].includes(filling)
            ),
      color:
        cards[0].color === cards[1].color
          ? cards[0].color
          : COLORS.find(
              (color) => ![cards[0].color, cards[1].color].includes(color)
            ),
      shape:
        cards[0].shape === cards[1].shape
          ? cards[0].shape
          : SHAPES.find(
              (shape) => ![cards[0].shape, cards[1].shape].includes(shape)
            ),
      size:
        cards[0].size === cards[1].size
          ? cards[0].size
          : [1, 2, 3].find(
              (size) =>
                ![cards[0].size, cards[1].size].includes(size as ICard['size'])
            ),
    }

    return isEqual(supposedLastCard, cards[2])
  }

  useEffect(() => {
    if (selectedCards.length === 3) {
      const isSet = getIsSet(selectedCards)

      if (isSet) {
        setTimeout(() => {
          setPlacedCards(
            placedCards.filter((card) => !selectedCards.includes(card))
          )
          setDoneSets(isSet ? doneSets + 1 : doneSets)
          setSelectedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          setSelectedCards([])
        }, 300)
      }
    }
  }, [selectedCards, placedCards, doneSets])

  return (
    <div className="wrapper">
      <main>
        <div
          className="board"
          style={{ ...getGridStyling(placedCards.length) }}
        >
          {placedCards.map((card, index) => (
            <Card
              key={`${card.filling}-${card.shape}-${card.color}-${index}`}
              card={card}
              onClick={() => handleCardClick(card)}
              isSelected={selectedCards.includes(card)}
              delay={
                placedCards.length - index < 3
                  ? (placedCards.length + index) % 3
                  : 0
              }
            />
          ))}
        </div>
      </main>
      <header>
        <button
          className="add-cards --clickable"
          onClick={addThreeCardsToBoard}
        >
          <span>Add 3 cards</span>
        </button>
        <button className="points">
          <span>Set: {doneSets}</span>
        </button>
      </header>
    </div>
  )
}

export default App
