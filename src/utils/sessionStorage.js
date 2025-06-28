// File-based session storage using server API endpoints

export const createSession = async (sessionData) => {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData),
  })
  const data = await response.json()
  return data.sessionId
}

export const getSession = async (sessionId) => {
  const response = await fetch(`/api/session/${sessionId}`)
  if (!response.ok) return null
  return await response.json()
}

export const getAllSessions = async () => {
  const response = await fetch('/api/sessions')
  if (!response.ok) return []
  return await response.json()
}

export const saveVote = async (sessionId, participantName, componentVotes) => {
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, participantName, componentVotes }),
  })
  return await response.json()
}

export const getSessionVotes = async (sessionId) => {
  const response = await fetch(`/api/votes/${sessionId}`)
  if (!response.ok) return []
  return await response.json()
}

export const calculateResults = (session, sessionVotes) => {
  if (!session || sessionVotes.length === 0) {
    return []
  }

  // Get all components from all categories
  const allComponents = session.categories.flatMap((cat, catIdx) =>
    cat.components.map((comp, compIdx) => ({
      ...comp,
      category: cat.name,
      key: `${catIdx}-${compIdx}`,
    }))
  )

  // Calculate results for each component
  const componentResults = allComponents.map((component) => {
    const componentVotes = sessionVotes.flatMap(vote => 
      vote.componentVotes[component.key] ? [vote.componentVotes[component.key]] : []
    )
    
    const highImpactVotes = componentVotes.filter(vote => vote.impact).length
    const highUrgencyVotes = componentVotes.filter(vote => vote.urgency).length
    const totalVotes = componentVotes.length
    
    const impact = totalVotes > 0 && highImpactVotes > totalVotes / 2 ? 'high' : 'low'
    const urgency = totalVotes > 0 && highUrgencyVotes > totalVotes / 2 ? 'high' : 'low'
    
    return { 
      ...component, 
      impact, 
      urgency,
      totalVotes,
      highImpactVotes,
      highUrgencyVotes
    }
  })

  return componentResults
}

// Placeholder for client-side debug tools
export const clearAllData = () => {
  alert('clearAllData is not implemented for server API version.');
};

export const listAllSessions = () => {
  alert('listAllSessions is not implemented for server API version.');
  return [];
}; 