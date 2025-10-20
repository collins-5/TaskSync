import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Text } from 'react-native';
import { RouteScreenProps } from 'react-native-actions-sheet';

import { Button } from '../../button';
import Icon from '../../icon';
import { Input } from '../../input';
import View from '../../view';

const EmailOrPhoneNumberRoute: React.FC<
  RouteScreenProps<'reset-password', 'email-or-phone-number'>
> = ({ router }) => {
  


  const handleSendPasswordResetLink = async () => {
  
        router?.navigate('reset-password');
  };

  return (
    <>
      <View className="flex h-full gap-y-1">
        <View className="h-20 w-20 items-center justify-center self-center rounded-full bg-primary/20">
          <Icon name="account-outline" size={24} className="text-primary" />
        </View>
        <View className="pb-6 text-center">
          <Text className="mb-2 text-center text-2xl font-bold text-muted-foreground">
            Forgot Password
          </Text>
          <Text className="px-4 text-base leading-relaxed text-gray-600">
            Don&apos;t worry, we&apos;ll help you get back into your patient account safely and
            securely. Enter the same email or phone number associated with your patient account
          </Text>
        </View>
        <View>
            <>
              <Input
                label="Email or Phone Number"
                placeholder="johndoe@mail.com or 0712345678"
                autoCapitalize="none"
                keyboardType="email-address"
                iconProps={{
                  name: 'account-outline',
                  size: 20,
                  className: 'text-muted-foreground',
                }}
                />
              
                </>
                </View>
        <Button
          onPress={handleSendPasswordResetLink}
          text="Send reset link"
          className="mb-2 mt-auto min-h-6"
        />
      </View>
    </>
  );
};

export default EmailOrPhoneNumberRoute;
