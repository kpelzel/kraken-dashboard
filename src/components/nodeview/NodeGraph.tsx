import React, { Component, createRef, CSSProperties, RefObject } from 'react'
import { Network, Data, Options, Color } from 'vis-network'
import { Graph } from '../../kraken-interactions/graph'
import { COLORS } from '../../config'
import _ from 'lodash'
import { CloseButtonStyle, GraphAreaStyle, GraphSettingsStyle, NodeGraphStyle } from './styles/nodegraphstyles'

interface NodeGraphProps {
  graphToggle: () => void
  graph: Graph
}

interface NodeGraphState {
  data: Data
  options: Options
  settingsMenu: boolean
}

export class NodeGraph extends Component<NodeGraphProps, NodeGraphState> {
  graphRef: RefObject<any> = createRef()
  configRef: RefObject<any> = createRef()
  network: Network | undefined = undefined

  constructor(props: NodeGraphProps) {
    super(props)

    const nodes = props.graph.nodes

    // Add highlight color to nodes
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].color !== undefined) {
        const color = nodes[i].color as Color
        const highlight = {
          border: color.border,
          background: color.background,
        }
        color.highlight = highlight
        nodes[i].color = color
      }
      nodes[i].borderWidth = 2
    }

    const data: Data = {
      nodes: nodes,
      edges: this.props.graph.edges,
    }

    const options: Options = {
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1.5,
          },
        },
        color: {
          inherit: false,
        },
        width: 4,
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -50000,
        },
      },
      height: '100%',
      width: '100%',
    }

    this.state = {
      data: data,
      options: options,
      settingsMenu: false,
    }
  }

  componentDidMount() {
    const options = _.cloneDeep(this.state.options)

    options.configure = {
      filter: (option: any, path: any) => {
        if (path.indexOf('physics') !== -1) {
          return true
        }
        if (path.indexOf('smooth') !== -1 || option === 'smooth') {
          return true
        }
        return false
      },
      container: this.configRef.current,
    }

    this.setState(
      {
        options: options,
      },
      () => {
        this.network = new Network(this.graphRef.current, this.state.data, this.state.options)

        // console.log(this.network)
      }
    )
  }

  componentDidUpdate(prevProps: NodeGraphProps, prevState: NodeGraphState) {
    if (this.props.graph !== prevProps.graph) {
      const data = this.state.data
      const nodes = this.props.graph.nodes

      // Add highlight color to nodes
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].color !== undefined) {
          const color = nodes[i].color as Color
          const highlight = {
            border: color.border,
            background: color.background,
          }
          color.highlight = highlight
          nodes[i].color = color
        }
        nodes[i].borderWidth = 2
      }

      data.nodes = nodes
      data.edges = this.props.graph.edges
      this.forceUpdate()
    }
  }

  toggleSettings = () => {
    this.setState({
      settingsMenu: !this.state.settingsMenu,
    })
  }

  render() {
    const settingsStyle: CSSProperties = {
      width: this.state.settingsMenu ? '20%' : '0px',
      visibility: this.state.settingsMenu ? 'visible' : 'hidden',
    }
    return (
      <div style={GraphAreaStyle}>
        <div
          style={CloseButtonStyle}
          onClick={() => {
            this.props.graphToggle()
          }}>
          <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 24 24'>
            <path fill='None' d='M0 0h24v24H0V0z' />
            <path
              fill={COLORS.grey}
              d='M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z'
            />
          </svg>
        </div>
        <button style={{ position: 'absolute', top: 5, zIndex: 10, left: 25 }} onClick={this.toggleSettings}>
          settings
        </button>
        <div style={{ ...GraphSettingsStyle, ...settingsStyle }} ref={this.configRef} />
        <div style={NodeGraphStyle} ref={this.graphRef} />
      </div>
    )
  }
}
