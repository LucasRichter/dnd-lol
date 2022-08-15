import { DDragonChampionListDataDTO } from 'kayn/typings/ddragon-dtos'
import { GetServerSideProps, NextPage } from 'next'
import React, { useCallback, useEffect, useState } from 'react'
import { getChampions } from '../services/dDragon'
import { DragDropContext, Droppable, Draggable, DropResult, resetServerContext } from 'react-beautiful-dnd';
import championsDate from '../assets/championsDate.json'
import ChampionCard from '../components/Lol/ChampionCard';
import ChampionTimeline from '../components/Lol/ChampionTimeline';
import NoSSR from 'react-no-ssr';
import Head from 'next/head';
import Image from 'next/image';

interface LolProps {
  data: DDragonChampionListDataDTO[]
  t: any;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const Lol: NextPage<LolProps> = ({data = [], t}: LolProps) => {
  const [chances, setChances] = useState(3)
  const [characters, updateCharacters] = useState<DDragonChampionListDataDTO[]>([]);
  const [allChampions, setAllChampions] = useState<DDragonChampionListDataDTO[]>(data)
  const [randomChampion, setRandomChampion] = useState<DDragonChampionListDataDTO>()

  const getRandomChar = useCallback(
    () => {
      const newAllChampions = shuffle(allChampions)
      const randomChampion = newAllChampions.pop()
      setRandomChampion(newAllChampions.pop())
      setAllChampions([...newAllChampions])
    },
    [allChampions, setAllChampions, setRandomChampion],
  )
  

  const initChar = useCallback(
    () => {
      const newAllChampions = shuffle(allChampions)
      setAllChampions(newAllChampions)
      updateCharacters([newAllChampions.pop()])
    },
    [allChampions, setAllChampions, setRandomChampion],
  )

  useEffect(() => {
    getRandomChar()
    initChar()
  }, [])
  

  const handleOnDragEnd = useCallback(
    async ({ destination }: DropResult) => {
      if (!destination || !randomChampion) return;
      const { index: destinationIndex } = destination 
      const items = Array.from(characters);
      const leftChamp = items[destinationIndex - 1]
      const rightChamp = items[items.length > 1 ? destinationIndex + 1 : 0]
      const leftDate = leftChamp && new Date(championsDate[leftChamp.name] as string).getTime()
      const rightDate = rightChamp && new Date(championsDate[rightChamp.name] as string).getTime()
      const randomChampDate = new Date(championsDate[randomChampion.name] as string).getTime()
      let isCorrect = false

      if (!leftDate) {
        isCorrect = randomChampDate < rightDate
      } else if (!rightDate) {
        isCorrect = randomChampDate > leftDate
      } else {
        isCorrect =randomChampDate > leftDate &&randomChampDate < rightDate
      }

      // if (!isCorrect) {
      //   setChances(v => v - 1)
      // }

      const audio = new Audio(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champion-${isCorrect ? 'choose' : 'ban'}-vo/${randomChampion?.key}.ogg`)
      await audio.play()

      items.splice(destinationIndex, 0, {
        ...randomChampion,
        isError: !isCorrect,
      });

      updateCharacters(items.sort((a, b) => new Date(championsDate[a.name] as string).getTime() - new Date(championsDate[b.name] as string).getTime()));
      getRandomChar();
    },
    [characters, randomChampion]
  )

  return (
    <NoSSR>
      <h1 className='text-3xl uppercase text-center my-12'>
        Linha do tempo de champions
      </h1>
      <DragDropContext  onDragEnd={handleOnDragEnd}>
        <div className='w-full flex-col text-center justify-center'>
          <div>
            {Array(chances).fill(<div />)}
          </div>
          <Droppable direction='horizontal' droppableId="champions">
            {(provided) => ( 
              <div
                className='flex flex-col justify-center w-full gap-y-3'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div
                  className='w-full mb-2 mx-auto'
                >
                  {randomChampion && (
                    <div className='flex items-center gap-x-5'>
                      <Image
                        layout='fixed'
                        priority
                        className='animate-fade'
                        alt={randomChampion.name + ' Splash'}
                        width={1037}
                        height={612}
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion.name.replace(/\s/g, '')}_0.jpg`}
                      />
                      <ChampionCard champion={randomChampion} />
                    </div>
                  )}
                </div>
                <div
                  className='bg-red-600 flex justify-center gap-x-4 items-center w-full p-4 overflow-x-auto'
                >
                  {characters.map(({isError, ...champion}, index) => {
                    return (
                      <ChampionTimeline isError={isError} champion={champion} index={index} key={champion.id + index} />
                    );
                  })}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </NoSSR>
    
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
