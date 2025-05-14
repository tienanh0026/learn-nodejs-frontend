import { useEffect, useRef } from 'react'
import { ExtensionCategory, Graph, register } from '@antv/g6'
import { ExtendBaseEdge } from './CustomEdge'
import VirtualChatBox from './ChatTest'

register(ExtensionCategory.EDGE, 'line-arrow', ExtendBaseEdge)

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const graph = new Graph({
      container: containerRef.current!,
      //   width: 500,
      height: 500,
      data: {
        nodes: [
          {
            id: 'node-1',
            style: { x: 50, y: 100 },
            // combo: 'combo-1',
          },
          {
            id: 'node-2',
            style: { x: 150, y: 100 },
            // combo: 'combo-1',
          },
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2',
            type: 'cubic-horizontal',
            data: {
              label: '123123',
            },
            style: {
              edgeOffset: 10,
            },
          },
        ],
        // combos: [
        //   {
        //     id: 'combo-1',
        //     type: 'circle',
        //     label: 'Group 1',
        //   },
        //   {
        //     id: 'combo-2',
        //     type: 'circle',
        //   },
        // ],
      },
      node: {
        // type: 'star',
        style: {
          fill: 'red',
          zIndex: 100,
        },
        animation: {
          update: 'translate', // Only use translation animation in the update stage
        },
        state: {
          selected: {
            fill: 'blue',
          },
        },
      },
      edge: {
        type: 'line-arrow',
        style: {
          labelText: (d) => (d.data?.label as string) || '',
          // labelFill: '#8b9baf',
          // labelFontWeight: 600,
          // labelBackground: true,
          // labelBackgroundFill: '#f8f8f8',
          // labelBackgroundOpacity: 1,
          // labelBackgroundLineWidth: 1,
          // labelBackgroundStroke: '#8b9baf',
          // labelPadding: [2, 10],
          // labelBackgroundRadius: 4,
          // startArrow: true,
          // endArrow: true,
          startArrowOffset: 18,
          endArrowOffset: 18,
          endArrow: true,
          endArrowZIndex: 100000,
          endArrowType: 'simple',
          startArrow: true,
          startArrowZIndex: 100000,
          startArrowType: 'simple',
          endArrowZ: 12,
          // startArrow: {

          // },
        },
        state: {
          hover: {
            fill: 'yellow',
          },
        },
      },

      behaviors: [
        'zoom-canvas',
        'drag-canvas',
        'hover-element',
        'drag-element',
        'click-select',
      ],
    })

    graph.render()
  }, [])
  return (
    <div>
      Test
      {/* <div ref={containerRef} className="border border-black"></div> */}
      <VirtualChatBox />
    </div>
  )
}
