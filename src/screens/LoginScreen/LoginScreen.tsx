import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StatusBar, SafeAreaView, Alert} from 'react-native';
import LableComponent from '../../components/LableComponent';
import {Dimens} from '../../constants/dimens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './Styles';
import { Strings } from '../../constants/strings';
import { icons } from '../../constants/images';
import SsoButton from '../../components/SsoButton';
import RactangularButton from '../../components/RactangularButton';
import TextfieldComponent from '../../components/TextFieldComponent';
import auth from '@react-native-firebase/auth';
import Toast from '../../components/Toast';

interface LoginPageProps {
  navigation: NativeStackNavigationProp<any>;
}

const LoginPage = ({ navigation, route }: any) => {

  useEffect(()=>{
    console.log('hellooo');
    
  },[])
  const [text, setText] = useState<string>('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const checkUserLogin = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        navigation.replace('Dashboard'); // Auto navigate to Dashboard if logged in
      }
    };
    checkUserLogin();
  }, []);

  useEffect(() => {
    if (route.params?.toastMessage) {
        setToast({ message: route.params.toastMessage, type: 'success' });
    }
}, [route.params?.toastMessage]);

  const handleLogin = async () => {
    if (!text || !password) {
      setToast({ message: 'Please enter both email and password', type: 'error' }); 
      // navigation.replace('Dashboard');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(text, password);
      const user = userCredential.user;

      if (user) {
        // await AsyncStorage.setItem('hasSeenGetStarted', 'true');
        await AsyncStorage.setItem('userToken', user.uid); // Store login state
        navigation.replace('Dashboard',{toastMessage: 'Login successful'});
        console.log('USER RESPONSEEE',user);
        
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setToast({ message: 'Invalid Email, The email address is not valid.', type: 'error' }); 

        // Alert.alert('Invalid Email', 'The email address is not valid.');
      } else if (error.code === 'auth/user-not-found') {
        setToast({ message: 'No user found with this email.', type: 'error' }); 

        // Alert.alert('User Not Found', 'No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setToast({ message: 'Incorrect Password', type: 'error' }); 

        // Alert.alert('Incorrect Password', 'Please check your password.');
      } else {
        setToast({ message: "This email is not registered. Please sign up first.", type: 'error' }); 

        // Alert.alert('Error', error.message);
      }
    }
  };
  const checkgetStart = async () => {
    const hasSeenGetStarted = await AsyncStorage.getItem('hasSeenGetStarted');
    if (hasSeenGetStarted) {
      navigation.replace('Dashboard');
    } else {
      navigation.navigate('GetStartPage');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
       {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}
      <View style={styles.titleContainer}>
        <LableComponent value={Strings.LOGINTITLE} style={styles.titleText} />
      </View>
      <View style={styles.content}>
        <TextfieldComponent
          placeholder={'Username or Email'}
          value={text}
          onChangeText={setText}
          icon={icons.IC_USER}
          keyboardType="email-address"
          style={{marginBottom: 31}}
        />
        <TextfieldComponent
          placeholder={'Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          icon={icons.IC_PASSWORD}
          style={{marginBottom: 9}}
        />
        <TouchableOpacity
          // onPress={() => navigation.navigate('ForgotPasswordPage')}
          >
          <LableComponent
            value={'Forgot Password?'}
            style={styles.forgotPasswordText}
          />
        </TouchableOpacity>

        <RactangularButton
          title={'Login'}
          // onPress={() => checkgetStart()}
          onPress={handleLogin}
          style={styles.loginButton}
        />
        <LableComponent
          value={'-OR Continue With-'}
          style={styles.continueText}
        />
        <View style={styles.ssoContainer}>
          <SsoButton
            onPress={() => console.log('Google Login Pressed!')}
            imageSource={icons.IC_GOOGLE}
            style={styles.ssoButton}
            testID="google-login-button"
          />
          <SsoButton
            onPress={() => console.log('Google Login Pressed!')}
            imageSource={icons.IC_APPLE}
            style={styles.ssoButton}
            iconSize={Dimens.icon.APPLESIZE}
            testID="apple-login-button"
          />
          <SsoButton
            onPress={() => console.log('Google Login Pressed!')}
            imageSource={icons.IC_FACEBOOK}
            iconSize={Dimens.icon.FACEBOOKSIZE}
            testID="facebook-login-button"
          />
        </View>
        <View style={styles.footer}>
          <LableComponent
            value={'Create An Account'}
            style={[styles.footerText1, ,]}
          />
          <TouchableOpacity onPress={() => navigation.navigate('SignUpPage')}  testID="signup-button">
            <LableComponent value={'Sign Up'} style={[styles.footerText2]} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
