import Jazzicon from 'react-jazzicon/dist/Jazzicon'

export default function ProfilePicture({
  address,
  size,
}: {
  address: string
  size?: number
}) {
  return (
    <Jazzicon diameter={size ?? 70} seed={parseInt(address.slice(2, 10), 16)} />
  )
}
