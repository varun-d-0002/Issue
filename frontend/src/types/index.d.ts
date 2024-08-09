interface FetchError {
  [x: string]: any
  message: string
  error: {
    response: object
  }
}
type audienceStatusType = 'IN_PROGRESS' | 'READY' | 'FAILED' | 'EXPIRED' | 'INACTIVE' | 'ACTIVATING'
type audienceType = {
  audienceGroupId: string
  description: string
  remarks: string
  audienceCount: number
  status: audienceStatusType
  created: Date
}

type Props = {
  logo?: string
  publicSettings?: any
  auth?: { auth: Object }
  children?: React.ReactNode
}
