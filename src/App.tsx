import { ICard } from '@/core/types/Card'
import '@/styles/main.scss'
import { useEffect, useRef, useState } from 'react'
import { ALL_CARDS } from '@/core/data/cards'
import shuffle from 'lodash.shuffle'
import isEqual from 'lodash.isequal'
import Card from '@/components/Card'
import setImg from '@/assets/img/set.png'
import reloadImg from '@/assets/img/reload.svg'
import gsap from 'gsap'
import animationData from '@/assets/lottie/explosion.json'
import { Player } from '@lottiefiles/react-lottie-player'

const FILLINGS: ICard['filling'][] = ['SOLID', 'STRIPED', 'EMPTY']
const COLORS: ICard['color'][] = ['GREEN', 'PURPLE', 'RED']
const SHAPES: ICard['shape'][] = ['OVAL', 'LOZENGE', 'WAVE']

const App = () => {
  const [deck, setDeck] = useState<ICard[]>([])
  const [placedCards, setPlacedCards] = useState<ICard[]>([])
  const [selectedCards, setSelectedCards] = useState<ICard[]>([])
  const [doneSets, setDoneSets] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const pointsRef = useRef(null)
  const lottieRef = useRef<any>(null)

  const init = () => {
    setDeck([])
    setPlacedCards([])
    setDoneSets(0)
    setTimeout(() => {
      setDeck(() => {
        const shuffledCards = shuffle(ALL_CARDS)
        setPlacedCards(shuffledCards.splice(0, 3))
        return shuffledCards
      })
    }, 100)
  }

  useEffect(() => {
    init()
  }, [])

  const isThereASet = (cards: ICard[]) => {
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          if (getIsSet([cards[i], cards[j], cards[k]])) {
            return true
          }
        }
      }
    }

    return false
  }

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
    window.addEventListener('mousemove', (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    })

    return () => {
      window.removeEventListener('mousemove', () => {})
    }
  }, [])

  useEffect(() => {
    setCursorPos(mousePos)
  }, [doneSets])

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
          lottieRef.current?.play()
          gsap.fromTo(
            pointsRef.current,
            {
              scale: 1,
            },
            {
              scale: 1.1,
              duration: 0.2,
              repeat: 1,
              yoyo: true,
              ease: 'power2.out',
            }
          )
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
              key={index}
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
          className="--clickable"
          onClick={() => {
            init()
          }}
        >
          <img src={reloadImg} alt="Reload circle" />
        </button>
        <button className="--clickable" onClick={addThreeCardsToBoard}>
          <span>Add 3 cards</span>
        </button>
        <button className="points" ref={pointsRef}>
          <img src={setImg} />
          <span>{doneSets}</span>
        </button>
        <button className="points" ref={pointsRef}>
          <span>
            {isThereASet(placedCards) ? 'Seeet présent' : 'Aucun Seeet présent'}
          </span>
        </button>
      </header>
      <div
        className="cursor"
        style={{
          transform: `translate3d(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%), 0)`,
        }}
      >
        <Player
          ref={lottieRef}
          autoplay={false}
          loop={false}
          src={animationData}
          style={{ width: 200, height: 200 }}
        />
      </div>
    </div>
  )
}

export default App
