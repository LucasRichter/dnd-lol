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
            className='min-w-[200px] p-3 rounded-2xl bg-slate-500'
          >
            <div className='flex flex-col items-center justify-center'>
              <ChampionThumb championName={champion?.image.full} />

              <div>
                <h3 className='text-2xl uppercase'>
                  {champion.name}
                </h3>
              </div>
            </div>
          </div>
        )}
      </Draggable>
  )
}

export default ChampionCard
