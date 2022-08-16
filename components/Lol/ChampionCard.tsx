import { DDragonChampionListDataDTO } from 'kayn/typings/ddragon-dtos';
import React, { ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ChampionThumb from './ChampionThumb';

interface ChampionCardProps {
  champion: DDragonChampionListDataDTO;
}

const ChampionCard = ({ champion }: ChampionCardProps): ReactElement => {
  return (
      <Draggable key={champion.id} draggableId={champion.id} index={0}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps} 
            {...provided.dragHandleProps}
          >
            <div className='flex flex-col m-4 items-center rounded-2xl justify-center bg-white'>
              <div className='pt-2'>
                <ChampionThumb championName={champion?.image.full} />
              </div>

              <h3 className='text-xl uppercase font-bold'>
                {champion.name}
              </h3>

              <div className='p-4 rounded-b-2xl w-full bg-slate-300'>
                <p>{champion.title}</p>
              </div>
            </div>
          </div>
        )}
      </Draggable>
  )
}

export default ChampionCard
