// In-memory session storage (in a real app, this would be a database)
let sessions = new Map()
let votes = new Map()

export const createSession = (sessionData) => {
  const sessionId = Math.random().toString(36).substr(2, 9)
  const session = {
    id: sessionId,
    ...sessionData,
    createdAt: new Date().toISOString(),
    status: 'active'
  }
  sessions.set(sessionId, session)
  votes.set(sessionId, [])
  console.log('Session created:', sessionId, session)
  console.log('All sessions:', Array.from(sessions.keys()))
  return sessionId
}

export const getSession = (sessionId) => {
  const session = sessions.get(sessionId)
  console.log('Getting session:', sessionId, session)
  return session
}

export const getAllSessions = () => {
  return Array.from(sessions.values())
}

export const saveVote = (sessionId, participantName, componentVotes) => {
  const sessionVotes = votes.get(sessionId) || []
  const vote = {
    id: Math.random().toString(36).substr(2, 9),
    participantName,
    componentVotes,
    timestamp: new Date().toISOString()
  }
  sessionVotes.push(vote)
  votes.set(sessionId, sessionVotes)
  return vote
}

export const getSessionVotes = (sessionId) => {
  return votes.get(sessionId) || []
}

export const calculateResults = (sessionId) => {
  const session = getSession(sessionId)
  const sessionVotes = getSessionVotes(sessionId)
  
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