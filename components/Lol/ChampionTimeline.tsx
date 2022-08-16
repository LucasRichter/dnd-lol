import React, { ReactElement } from 'react';
import { DDragonChampionListDataDTO } from 'kayn/typings/ddragon-dtos';
import championsDate from '../../assets/championsDate.json'
import { Draggable } from 'react-beautiful-dnd';
import ChampionThumb from './ChampionThumb';
import { JSONData } from '../../pages';

const ChampionTimeline = ({ champion, index, isError }: {champion: DDragonChampionListDataDTO, index: number, isError?: boolean}): ReactElement => {
  const { name, key, image } = champion
  const flexDirection = index % 2 ? 'flex-col' : 'flex-col-reverse'

  return (
    <Draggable isDragDisabled key={key} draggableId={key} index={index+1}>
      {(provided) => (
        <div
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
          className='z-10'
        >
          <div className={`flex rounded-2xl min-w-[200px] p-3 items-center justify-center flex-col ${isError ? 'bg-red-500' : 'bg-green-500'}` }>
            <div
              className={`text-center flex flex-col justify-center items-center ${flexDirection}`}
            >
              
              <div
                className='rounded-md mx-auto bg-black h-14 w-4 my-2'
              />  
              <p className='mx-auto text-white'>
                  {championsDate[name as JSONData]}
              </p>
            </div>            
            <div>
              <ChampionThumb championName={image?.full} />
              <h3 className='uppercase text-xl'>
                {name}
              </h3>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default ChampionTimeline
