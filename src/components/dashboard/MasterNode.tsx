import { NodeProps } from './Node'
import { stateToColor, base64ToUuid } from '../../kraken-interactions/node'
import { Link } from 'react-router-dom'
import React from 'react'

export const MasterNode = (props: NodeProps) => {
  const physColor = stateToColor(props.data.physState)
  const uuid = base64ToUuid(props.data.id)

  return (
    <Link className={`master-square shadow animate`} style={{ backgroundColor: physColor }} to={`node/${uuid}`}>
      Master
    </Link>
  )
}
