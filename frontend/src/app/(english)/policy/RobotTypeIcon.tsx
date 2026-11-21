import type { PolicyRobotType } from '@/lib/robotPolicy'

// Code-native SVG placeholders; replace the silhouettes as the icon set evolves.
export default function RobotTypeIcon({ type }: { type: PolicyRobotType }) {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {type === 'autonomous_vehicle' ? <>
        <path d="m8 28 4-12h23l5 12v9H8zM11 25h26M24 10v6M20 10h8" />
        <circle cx="15" cy="36" r="4" fill="var(--color-white)" /><circle cx="33" cy="36" r="4" fill="var(--color-white)" />
        <path d="M14 29h4m12 0h4" />
      </> : type === 'industrial' ? <>
        <path d="M10 40h28M16 40v-7l8-8-8-11 6-5 12 15-9 11v5M34 24l6-5m-2-4 5 7" />
        <circle cx="19" cy="12" r="4" fill="var(--color-white)" /><circle cx="29" cy="25" r="4" fill="var(--color-white)" />
      </> : type === 'sensor_equipped' ? <>
        <rect x="12" y="17" width="24" height="21" rx="5" />
        <path d="M24 17v-5m-3-3a4 4 0 0 1 6 0M8 22v10m32-10v10M19 38v4m10-4v4M20 31h8" />
        <circle cx="19" cy="24" r="1.5" /><circle cx="29" cy="24" r="1.5" />
      </> : <>
        <rect x="10" y={type === 'delivery' ? '16' : '24'} width="28" height={type === 'delivery' ? '19' : '11'} rx="3" />
        <circle cx="16" cy="36" r="4" fill="var(--color-white)" /><circle cx="32" cy="36" r="4" fill="var(--color-white)" />
        {type === 'delivery' ? <path d="M10 22h28M24 16v6m9-6V9m-3 0h6" /> : <path d="M24 24V12m-5 0h10M16 29h5m7 0h4M20 7a7 7 0 0 1 8 0" />}
      </>}
    </svg>
  )
}
