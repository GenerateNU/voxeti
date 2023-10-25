export interface SocialProviderPendingProps {
  provider: string,
  onClick: () => void,
  setState : React.Dispatch<React.SetStateAction<boolean>>,
}
