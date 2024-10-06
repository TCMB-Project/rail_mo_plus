import { Vector3, Vector2, Direction } from "@minecraft/server"

const { North , South, East, West , Up, Down} = Direction;

type ExitDirection = {
  direction: Direction,
  ascending?: Direction
}

export const rail_direction:{
  East: ExitDirection
  West: ExitDirection
  North: ExitDirection
  South: ExitDirection
}[] = [
  //rail_direction=0 north_south
  {
    North: { direction: South },
    South: { direction: North },
    East:  { direction: South },
    West:  { direction: South }
  },
  //rail_direction=1 east_west
  {
    North: { direction: East },
    South: { direction: East },
    East:  { direction: West },
    West:  { direction: East }
  },
  //rail_direction=2 ascending_east
  {
    North: { direction: West },
    South: { direction: West },
    East:  { direction: West, ascending: Down },
    West:  { direction: East, ascending: Up }
  },
  //rail_direction=3 ascending_west
  {
    North: { direction: East },
    South: { direction: East },
    East:  { direction: West, ascending: Up },
    West:  { direction: East, ascending: Down }
  },
  //rail_direction=4 ascending_North
  {
    North: { direction: South, ascending: Down },
    South: { direction: North, ascending: Up },
    East:  { direction: South },
    West:  { direction: South }
  },
  //rail_direction=5 ascending_south
  {
    North: { direction: South, ascending: Up },
    South: { direction: North, ascending: Down },
    East:  { direction: South },
    West:  { direction: South }
  },
  //rail_direction=6 south_east
  {
    North: { direction: South },
    South: { direction: East },
    East:  { direction: South },
    West:  { direction: East }
  },
  //rail_direction=7 south_west
  {
    North: { direction: South },
    South: { direction: West },
    East:  { direction: West },
    West:  { direction: South }
  },
  //rail_direction=8 north_west
  {
    North: { direction: West },
    South: { direction: North },
    East:  { direction: West },
    West:  { direction: North }
  },
  //rail_direction=9 north_east
  {
    North: { direction: East },
    South: { direction: North },
    East:  { direction: North },
    West:  { direction: East }
  }
]