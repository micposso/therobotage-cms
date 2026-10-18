import rawProtocols from '@/content/rxd/protocols.json'
import reachy from '@/content/rxd/robots/reachy-mini.json'
import go2 from '@/content/rxd/robots/unitree-go2-pro.json'
import { ProtocolSchema, validatePackage } from './schema'

export const protocols = rawProtocols.map(p => ProtocolSchema.parse(p))
export const records = [reachy, go2].map(raw => {
  const result = validatePackage(raw, protocols)
  if (!result.success) throw new Error(`Invalid RXD content: ${result.errors.join('; ')}`)
  return result.data
})
export const getRXDRecord = (id: string) => records.find(record => record.robot.id === id)

export const methodLabels = { research: 'Research Profile', observational: 'Observational Evaluation', 'hands-on': 'Hands-on Evaluation', historical: 'Historical evaluation — classification pending' }
export const availabilityLabels = { purchase: 'Available for purchase', quotation: 'Available by enterprise quotation', temporary: 'Temporarily unavailable', unverified: 'Availability unverified', archived: 'Discontinued / archived' }
export const deploymentLabels = { consumer: 'Consumer ready', commercial: 'Commercial deployment ready', integration: 'Integration required', developer: 'Developer/research platform' }
