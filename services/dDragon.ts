import { Kayn, KaynDDragonRequest, REGIONS } from "kayn";
import { DDragonChampionListDTO } from "kayn/typings/ddragon-dtos";

const kayn = Kayn('RGAPI-323c22f9-0ff0-4331-a3d6-a3f7c5a8e4ff')({
  region: REGIONS.BRAZIL
})

export function getChampions(): KaynDDragonRequest<DDragonChampionListDTO> {
  return kayn.DDragon.Champion.list()
}
