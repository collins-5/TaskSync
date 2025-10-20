import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

const HeaderSafeAreaView: React.FC<Omit<SafeAreaViewProps, 'edges'>> = ({ children, ...props }) => {
  return (
    <SafeAreaView className='bg-white' edges={['top', 'left', 'right']} {...props}>
      {children}
    </SafeAreaView>
  );
};

export default HeaderSafeAreaView;
