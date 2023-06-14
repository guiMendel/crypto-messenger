import { DecodedMessage } from '@xmtp/xmtp-js'

export default interface Chat {
  messages: { [id: string]: DecodedMessage }

  peerAddress: string

  latestMessage?: DecodedMessage
}
