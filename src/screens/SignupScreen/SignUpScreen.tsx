import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import TextfieldComponent from '../../components/TextFieldComponent';
import RactangularButton from '../../components/RactangularButton';
import SsoButton from '../../components/SsoButton';
import LableComponent from '../../components/LableComponent';
import { TextStyles } from '../../constants/textstyle';

import { Colors } from '../../constants/colors';
import { icons } from '../../constants/images';
import { Dimens } from '../../constants/dimens';
import { Strings } from '../../constants/strings';
import { styles } from './Styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { heightPercentageToDP } from 'react-native-responsive-screen';

interface SignupPageProps {
  navigation: NativeStackNavigationProp<any>;
}

const SignupPage = ({ navigation }: SignupPageProps) => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!text || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        text.trim(),
        password
      );
      const user = userCredential.user;

      if (user) {
        // Alert.alert('Success', 'Account created successfully!');
        // navigation.replace('Dashboard'); // Navigate to Dashboard or Home screen
        console.log('USER SIGNUP RESPONSEEE', user);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'The email address is invalid.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert(
          'Error',
          'The password is too weak. Try adding numbers and special characters.'
        );
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1,height:heightPercentageToDP("65%") }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.titleContainer}>
            <LableComponent value={Strings.SIGNUPTITLE} style={styles.titleText} />
          </View>
          <View style={styles.content}>
            <TextfieldComponent
              placeholder={'Username or Email'}
              value={text}
              onChangeText={setText}
              icon={icons.IC_USER}
              style={{ marginBottom: 31 }}
            />
            <TextfieldComponent
              placeholder={'Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              icon={icons.IC_PASSWORD}
              style={{ marginBottom: 31 }}
            />
            <TextfieldComponent
              placeholder={'ConfirmPassword'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              icon={icons.IC_PASSWORD}
              style={{ marginBottom: 87 }}
            />

            <RactangularButton
              title={'Create Account'}
              // onPress={() => console.log('hiiii')}
              onPress={handleSignup}
              style={{ marginBottom: 31 }}
            />
            <LableComponent
              value={'-OR Continue With-'}

              style={styles.continueText}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 28,
              }}>
              <SsoButton
                onPress={() => console.log('Google Login Pressed!')}
                imageSource={icons.IC_GOOGLE}
                style={styles.ssoButton}
              />
              <SsoButton
                onPress={() => console.log('Google Login Pressed!')}
                imageSource={icons.IC_APPLE}
                style={styles.ssoButton}
                iconSize={Dimens.icon.APPLESIZE}
              />
              <SsoButton
                onPress={() => console.log('Google Login Pressed!')}
                imageSource={icons.IC_FACEBOOK}
                iconSize={Dimens.icon.FACEBOOKSIZE}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 30,
              }}>
              <LableComponent
                value={'I Already Have an Account'}
                style={[
                  styles.footerText,
                  { fontFamily: TextStyles.regularText, color: Colors.darkGray2 },
                ]}
              />
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <LableComponent
                  value={'Login'}
                  style={[
                    styles.footerText,
                    {
                      fontFamily: TextStyles.semiBoldText,
                      color: Colors.primary,
                      textDecorationLine: 'underline',
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default SignupPage;
