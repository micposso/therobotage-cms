const targets = await fetch('http://127.0.0.1:9223/json').then((response) => response.json())
const target = targets.find((candidate) => candidate.type === 'page' && candidate.url === 'http://localhost:3002/')

if (!target) throw new Error('TheRobotAge verification tab was not found')

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let commandId = 0
const protocolEvents = []
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown' || message.method === 'Log.entryAdded') {
    protocolEvents.push(message)
  }
})

function command(method, params = {}) {
  const id = ++commandId
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.id !== id) return
      socket.removeEventListener('message', onMessage)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    }
    socket.addEventListener('message', onMessage)
    socket.send(JSON.stringify({ id, method, params }))
  })
}

function evaluate(expression, label = 'evaluation') {
  const id = ++commandId
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.id !== id) return
      socket.removeEventListener('message', onMessage)
      if (message.error) reject(new Error(message.error.message))
      else if (message.result?.exceptionDetails) reject(new Error(`${label}: ${JSON.stringify(message.result.exceptionDetails)}`))
      else resolve(message.result?.result?.value)
    }
    socket.addEventListener('message', onMessage)
    socket.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true },
    }))
  })
}

await command('Runtime.enable')
await command('Log.enable')
await new Promise((resolve) => setTimeout(resolve, 1000))

const support = await evaluate(`({
  secureContext: window.isSecureContext,
  modelContextType: typeof document.modelContext,
  executeToolType: typeof document.modelContext?.executeTool,
  panelText: document.querySelector('[aria-labelledby="webmcp-activity-title"]')?.textContent
})`, 'support')

const tools = await evaluate(`(async () => {
  const tools = await document.modelContext.getTools()
  return tools.map(({ name, title, origin, annotations }) => ({ name, title, origin, annotations }))
})()`, 'getTools')

async function execute(name, input = {}) {
  const inputJson = JSON.stringify(input)
  return evaluate(`(async () => {
    const tools = await document.modelContext.getTools()
    const tool = tools.find((candidate) => candidate.name === ${JSON.stringify(name)})
    const result = await document.modelContext.executeTool(tool, ${JSON.stringify(inputJson)})
    return typeof result === 'string' ? JSON.parse(result) : result
  })()`, `execute ${name}`)
}

let overview
try {
  overview = await execute('get_site_overview')
} catch (error) {
  console.error(JSON.stringify({ error: error.message, protocolEvents }, null, 2))
  socket.close()
  process.exit(1)
}
const events = await execute('list_events')
const details = await execute('get_event_details', { eventId: 'summit' })
const missing = await execute('get_event_details', { eventId: 'does-not-exist' })
const search = await execute('search_site', { query: 'robot design', limit: 3 })
const robots = await execute('list_robot_profiles')
const robot = robots.robots?.[0]
  ? await execute('get_robot_profile', { slug: robots.robots[0].slug })
  : null
const jobs = await execute('list_jobs', { query: 'product', limit: 3 })
const job = jobs.jobs?.[0]
  ? await execute('get_job_details', { slug: jobs.jobs[0].slug })
  : null
const activity = await evaluate(`({
  panelText: document.querySelector('[aria-labelledby="webmcp-activity-title"]')?.textContent,
  entries: [...document.querySelectorAll('[aria-labelledby="webmcp-activity-title"] li')].map((item) => item.textContent)
})`, 'activity')

console.log(JSON.stringify({
  support,
  tools,
  overview,
  events,
  details,
  missing,
  search,
  robots,
  robot,
  jobs,
  job,
  activity,
}, null, 2))
socket.close()
