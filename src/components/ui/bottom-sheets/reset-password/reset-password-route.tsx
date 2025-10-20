import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SheetManager, useSheetRouter } from 'react-native-actions-sheet';


import { Button } from '../../button';
import Icon from '../../icon';
import { Input } from '../../input';
import OTPInput from '../../otp-input';
import { Text } from '../../text';
import View from '../../view';

const ResetPasswordRoute = () => {
  const router = useRouter();
  const sheetRouter = useSheetRouter('reset-password');


  const handleResetPassword = async () => {
  
        SheetManager.hide('reset-password');
        router.replace('/(auth)/sign-in');
      
  };

  return (
    <>
      <View className="mb-1">
        <View className="h-20 w-20 items-center justify-center self-center rounded-full bg-primary/20">
          <Icon name="account-outline" size={24} className="text-primary" />
        </View>
        <View className="pb-6 text-center">
          <Text className="mb-2 text-center text-2xl font-bold text-muted-foreground">
            Reset Your Password
          </Text>
          <Text className="mb-4 text-base text-muted-foreground">
            Enter the verification code sent to your email or phone, then set a new password.
          </Text>
        </View>
        <Text className="mb-2 text-sm font-medium text-foreground">Verification Code</Text>
        <View className='p-4'>
            <OTPInput  />
        </View>
       
      </View>
      <View className="mb-1">
                <View className='p-4'>

              <Input
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                iconProps={{
                  name: 'lock-outline',
                  size: 20,
                  className: 'text-muted-foreground',
                }}
              />
            </View>
      </View>
             <View className='p-4'>

            <Input
              placeholder="Re-enter new password"
              secureTextEntry
              autoCapitalize="none"
              iconProps={{
                name: 'lock-outline',
                size: 20,
                className: 'text-muted-foreground',
              }}
            />
          </View>
      <Button
        onPress={() => sheetRouter?.goBack()}
        text={"Didn't get reset password"}
        className="mb-2 mt-2 min-h-5 bg-transparent text-primary"
      />

      <Button
        onPress={handleResetPassword}
        text="Reset Password"
        className="min-h-4"
      />
    </>
  );
};

export default ResetPasswordRoute;
