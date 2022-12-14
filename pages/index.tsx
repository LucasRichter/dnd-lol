import { DDragonChampionListDataDTO } from 'kayn/typings/ddragon-dtos'
import { GetServerSideProps, NextPage } from 'next'
import React, { useCallback, useEffect, useState } from 'react'
import { getChampions } from '../services/dDragon'
import { DragDropContext, Droppable, Draggable, DropResult, resetServerContext } from 'react-beautiful-dnd';
import championsDate from '../assets/championsDate.json'
import ChampionCard from '../components/Lol/ChampionCard';
import ChampionTimeline from '../components/Lol/ChampionTimeline';
import NoSSR from 'react-no-ssr';
import Image from 'next/image';
import toDate from '../utils/compareDate';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DiGithubAlt } from 'react-icons/di'

export type JSONData = keyof typeof championsDate;

interface TimeLineDataProps extends DDragonChampionListDataDTO {
  isError?: boolean
}

interface LolProps {
  data: TimeLineDataProps[]
  t: any;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const Lol: NextPage<LolProps> = ({data = [], t}: LolProps) => {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [chances, setChances] = useState(3)
  const [maxStreak, setMaxStreak] = useState(0)
  const [characters, updateCharacters] = useState<TimeLineDataProps[]>([]);
  const [allChampions, setAllChampions] = useState<TimeLineDataProps[]>(data)
  const [randomChampion, setRandomChampion] = useState<TimeLineDataProps>()

  const getRandomChar = useCallback(
    () => {
      const newAllChampions = shuffle(allChampions)
      const randomChampion = newAllChampions.pop()
      setRandomChampion(randomChampion)
      setAllChampions([...newAllChampions])
    },
    [allChampions, setAllChampions, setRandomChampion],
  )
  

  const initChar = useCallback(
    () => {
      const newAllChampions = shuffle(allChampions)
      setAllChampions(newAllChampions)
      const randomChampion = newAllChampions.pop()
      console.log(randomChampion)
      if (randomChampion) updateCharacters([randomChampion])
      const firstChamp = newAllChampions.pop()
      console.log(firstChamp)
      if (firstChamp) setRandomChampion(firstChamp)
    },
    [allChampions, setAllChampions, setRandomChampion],
  )

  useEffect(() => {
    initChar()
  }, [])
  

  const handleOnDragEnd = useCallback(
    async ({ destination }: DropResult) => {
      if (!destination || !randomChampion) return;
      const { index, droppableId } = destination 
      if (droppableId !== 'champions') return
      const destinationIndex = index - 1
      const leftChamp = characters[destinationIndex - 1]
      const rightChamp = characters[destinationIndex === 0 && characters.length === 1 ? 0 : destinationIndex + 1]
      const leftDate = leftChamp && toDate(championsDate[leftChamp.name as JSONData]).getTime()
      const rightDate = rightChamp && toDate(championsDate[rightChamp.name as JSONData]).getTime()
      const randomChampDate = toDate(championsDate[randomChampion.name as JSONData]).getTime()
      let isCorrect = false

      if (!leftDate) {        
        isCorrect = randomChampDate < rightDate
      } else if (!rightDate) {
        isCorrect = randomChampDate > leftDate
      } else {
        isCorrect = randomChampDate > leftDate && randomChampDate < rightDate
      }

      
      if (isCorrect) {
        console.log('isCorrect')
        setScore(v => ++v)
        setStreak(v => ++v)
      } else {
        setStreak(v => {
          setMaxStreak(max => v > max ? v : max)
          return 0
        })
        setChances(v => --v)
      }

      
      characters.splice(destinationIndex, 0, {
        ...randomChampion,
        isError: isCorrect === false,
      });
      updateCharacters([...characters].sort((a, b) => toDate(championsDate[a.name as JSONData]).getTime() - toDate(championsDate[b.name as JSONData]).getTime()));
      const audio = new Audio(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champion-${isCorrect ? 'choose' : 'ban'}-vo/${randomChampion?.key}.ogg`)
      audio.volume = 0.5
      setRandomChampion(undefined)
      await audio.play()
      getRandomChar();
    },
    [characters, randomChampion]
  )
  const router = useRouter()
  const endGame = useCallback( () => {
    if (chances === 0) {
      router.push(`${maxStreak}/${score}`)
    }
  }, [score, maxStreak, router, chances])

  console.log(score, maxStreak)

  useEffect(endGame, [endGame])

  return (
    <>
    <Head>
      <title>LOL Timeline</title>
    </Head>
    <NoSSR>
      <div className='flex justify-around w-full text-center items-center'>
        <h1 className='text-3xl uppercase text-white italic text-center my-4'>
          Linha do tempo de champions
        </h1>
        <div className='flex gap-x-3'>
          <a href='https://github.com/LucasRichter/dnd-lol' target='_blank' rel="noreferrer">
            <DiGithubAlt size={48} color='white' />
          </a>
        </div>
      </div>
      <DragDropContext  onDragEnd={handleOnDragEnd}>
        <div className='w-full flex-col text-center justify-center'>
          <Droppable direction='horizontal' droppableId="randomChar">
            {(provided) => (
              <div
            className='w-full mb-2 mx-auto'
            {...provided.droppableProps}
                ref={provided.innerRef}
          >
            <div className='flex items-center gap-x-5 w-screen min-h-[612px]'>
                <Image
                  layout='fixed'
                  priority
                  alt={randomChampion?.name + ' Splash'}
                  width={1037}
                  onLoad={(e) => {
                    e.currentTarget.classList.toggle('animate-fade')
                  }}
                  height={612}
                  src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion?.name.replace(/\s/g, '')}_0.jpg`}
                />
                <div className='border border-dashed border-blue-100 min-w-[210px] min-h-[180px]'>
                  {randomChampion && <ChampionCard champion={randomChampion} />}
                </div>
              <div className='flex items-center gap-x-3'>
                <p className='text-white text-lg font-medium'>HP: </p>
                <div className='w-[180px] bg-green-300 h-4'>
                  <div className={` bg-green-500 h-full transition-all`}  style={{ width: `${Math.max(100 * chances / 3, 1)}%`}}/>
                </div>
              </div>
            </div>
          </div>
            )}
          </Droppable>          
          <Droppable direction='horizontal' droppableId="champions">
            {(provided) => ( 
              <div
                className='flex flex-col w-full gap-x-4'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div
                  className='flex gap-x-4 w-full p-4 overflow-x-auto relative'
                >
                  {characters.map(({isError, ...champion}, index) => {
                    return (
                      <ChampionTimeline isError={isError} champion={champion} index={index} key={champion.id + index} />
                      );
                    })}
                    <div className='w-full border-t-8 border-dotted absolute left-0 z-0 top-2/4' />
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </NoSSR>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () =>  {
  const data = getChampions()
  return {
    props: {
      data: Object.values((await data).data)
    },
  }
}

export default Lol
