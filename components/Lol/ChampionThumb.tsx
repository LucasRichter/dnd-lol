import React, { ReactElement } from "react"
import Image from "next/image"

interface ChampionThumbProps {
  championName: string
}

const ChampionThumb = ({ championName }: ChampionThumbProps): ReactElement => {
  return (
    <Image
      className="w-12 h-12 rounded-full"
      alt={championName}
      width={48}
      height={48}
      layout='fixed'
      src={`https://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${championName}`}
    />
  )
}

export default ChampionThumb