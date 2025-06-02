import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  SafeAreaView
} from 'react-native';

import { styles } from './Styles';

import BottomNavigation from '../../components/BottomMenu/BottomMenuComponent';
import { Colors } from '../../constants/colors';
import Toast from '../../components/Toast';

const Dashboard = ({route}: {route: any}) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  useEffect(() => {
    if (route.params?.toastMessage) {
        setToast({ message: route.params.toastMessage, type: 'success' });
    }
}, [route.params?.toastMessage]);

  return (
    <SafeAreaView style={styles.container} testID="dashboard-container">
      <StatusBar 
        backgroundColor={Colors.background} 
        barStyle={'dark-content'} 
      />
       {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}
      <BottomNavigation testID="bottom-navigation" />
    </SafeAreaView>
  );
};

export default Dashboard;
