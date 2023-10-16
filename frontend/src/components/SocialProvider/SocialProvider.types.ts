export interface SocialProviderProps {
  provider: 'Google';
  onClick: () => void;
  setState : React.Dispatch<React.SetStateAction<boolean>>;
  setProvider: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}
