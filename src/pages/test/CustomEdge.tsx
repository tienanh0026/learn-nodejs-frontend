import { BaseEdge } from '@antv/g6'

import type { BaseEdgeStyleProps, PathArray } from '@antv/g6'

export class ExtendBaseEdge extends BaseEdge {
  // Override the getKeyStyle method
  protected getKeyStyle(attributes: Required<BaseEdgeStyleProps>) {
    return {
      ...super.getKeyStyle(attributes),
      startArrow: {
        path: 'M 0,0 L 10,5 L 0,10 Z', // Custom arrow path
        fill: '#000',
      },
      endArrow: {
        path: 'M 0,0 L 10,5 L 0,10 Z', // Custom arrow path
        fill: '#000',
      },
      lineWidth: 2, // Width of the main line
      stroke: '#000',
    }
  }
  // protected getArrowStyle(attributes: Required<BaseEdgeStyleProps>) {
  //   return {
  //     ...super.getKeyStyle(attributes),
  //   }
  // }
  protected getKeyPath(_attributes: Required<BaseEdgeStyleProps>): PathArray {
    const { sourceNode, targetNode } = this
    const [x1, y1] = sourceNode.getPosition()
    const [x2, y2] = targetNode.getPosition()

    const offset = 6

    // Compute the length of the line segment
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx * dx + dy * dy)

    // Compute the perpendicular offset vector
    const offsetX = (-dy / length) * offset
    const offsetY = (dx / length) * offset

    // Offset the original points in the perpendicular direction
    const doubleLinePath1: PathArray = [
      ['M', x1 + offsetX, y1 + offsetY],
      ['L', x2 + offsetX, y2 + offsetY],
      ['L', x2 + offsetX, y2 + offsetY],
    ]

    const doubleLinePath2: PathArray = [
      ['M', x1 - offsetX, y1 - offsetY],
      ['L', x2 - offsetX, y2 - offsetY],
    ]

    return [...doubleLinePath1, ...doubleLinePath2]
  }
}
