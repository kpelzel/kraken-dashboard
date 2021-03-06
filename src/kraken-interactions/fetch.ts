import { Node } from './node'

// Fetches a json list of nodes from a url
export const fetchNodeListFromUrl = async (url: string): Promise<Node[] | null> => {
  const data = await fetch(url).catch(error => {
    // console.warn('Error during fetchNodeListFromUrl:', error)
    return null
  })
  if (data !== null) {
    const json = await data.json()
    return json.nodes
  } else {
    return null
  }
}

export const fetchAllNodesFromUrls = async (cfgUrl: string, dscUrl: string): Promise<[Node[], Node[]] | null> => {
  const [cfgData, dscData] = await Promise.all([fetch(cfgUrl), fetch(dscUrl)])
  if (cfgData === null || dscData === null) {
    return null
  } else {
    const cfgNodes = await cfgData.json()
    const dscNodes = await dscData.json()
    return [cfgNodes.nodes, dscNodes.nodes]
  }
}

// Fetches a json object from a url
export const fetchJsonFromUrl = async (url: string): Promise<any | null> => {
  const data = await fetch(url).catch(error => {
    // console.warn("Error during fetchJsonFromUrl:", error);
    return null
  })
  if (data !== null) {
    return data.json()
  } else {
    return null
  }
}

// Fetches raw text from a url
export const fetchTextFromUrl = async (url: string): Promise<string | null> => {
  const data = await fetch(url).catch(error => {
    // console.warn("Error during fetchTextFromUrl:", error);
    return null
  })
  if (data !== null) {
    return data.text()
  } else {
    return null
  }
}
