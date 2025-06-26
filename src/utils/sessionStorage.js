// Persistent session storage using localStorage
const SESSIONS_KEY = 'culture_prioritization_sessions'
const VOTES_KEY = 'culture_prioritization_votes'

// Helper functions for localStorage
const getStoredSessions = () => {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY)
    return stored ? new Map(JSON.parse(stored)) : new Map()
  } catch (error) {
    console.error('Error reading sessions from localStorage:', error)
    return new Map()
  }
}

const setStoredSessions = (sessions) => {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(Array.from(sessions.entries())))
  } catch (error) {
    console.error('Error writing sessions to localStorage:', error)
  }
}

const getStoredVotes = () => {
  try {
    const stored = localStorage.getItem(VOTES_KEY)
    return stored ? new Map(JSON.parse(stored)) : new Map()
  } catch (error) {
    console.error('Error reading votes from localStorage:', error)
    return new Map()
  }
}

const setStoredVotes = (votes) => {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(Array.from(votes.entries())))
  } catch (error) {
    console.error('Error writing votes to localStorage:', error)
  }
}

export const createSession = (sessionData) => {
  const sessionId = Math.random().toString(36).substr(2, 9)
  const session = {
    id: sessionId,
    ...sessionData,
    createdAt: new Date().toISOString(),
    status: 'active'
  }
  
  const sessions = getStoredSessions()
  const votes = getStoredVotes()
  
  sessions.set(sessionId, session)
  votes.set(sessionId, [])
  
  setStoredSessions(sessions)
  setStoredVotes(votes)
  
  console.log('Session created:', sessionId, session)
  console.log('All sessions:', Array.from(sessions.keys()))
  return sessionId
}

export const getSession = (sessionId) => {
  const sessions = getStoredSessions()
  const session = sessions.get(sessionId)
  console.log('Getting session:', sessionId, session)
  return session
}

export const getAllSessions = () => {
  const sessions = getStoredSessions()
  return Array.from(sessions.values())
}

export const saveVote = (sessionId, participantName, componentVotes) => {
  const votes = getStoredVotes()
  const sessionVotes = votes.get(sessionId) || []
  const vote = {
    id: Math.random().toString(36).substr(2, 9),
    participantName,
    componentVotes,
    timestamp: new Date().toISOString()
  }
  sessionVotes.push(vote)
  votes.set(sessionId, sessionVotes)
  setStoredVotes(votes)
  return vote
}

export const getSessionVotes = (sessionId) => {
  const votes = getStoredVotes()
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