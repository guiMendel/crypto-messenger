import { Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import Chat from '../types/Chat.interface'

// Turns conversation to chat
export default function conversationToChat(
  conversation: Conversation,
  messages?: DecodedMessage[]
): Chat {
  return {
    messages: messages?.sort(({ sent }) => sent.getTime()) ?? [],
    peerAddress: conversation.peerAddress,
    latestMessage:
      messages != undefined && messages.length > 0
        ? messages[0].content
        : undefined,
  }
}
