import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimens } from '../../../constants/dimens';

const Icon = MaterialIcons as any;
const { AdminModule, UsageStatsModule, UsageAccessModule } = NativeModules;

interface UsageData {
  rawInSeconds: number;
  minutes: number;
  hours: number;
  seconds: number;
  packageName: string;
}

const getAppName = (packageName: string): string => {
  // Convert package names to readable names
  const appNames: { [key: string]: string } = {
    'com.google.android.youtube': 'YouTube',
    'com.whatsapp': 'WhatsApp',
    'com.instagram.android': 'Instagram',
    'com.snapchat.android': 'Snapchat',
    'com.android.chrome': 'Chrome',
    'com.google.android.apps.maps': 'Google Maps',
    'com.microsoft.teams': 'Teams',
    'com.evolve': 'Evolve',
    'com.getsomeheadspace.android': 'Headspace',
    'com.android.vending': 'Play Store',
    'com.oneplus.gallery': 'Photos',
    'com.android.settings': 'Settings',
    'the.hexcoders.whatsdelete': 'WhatsDelete',
  };
  
  return appNames[packageName] || packageName.split('.').pop() || packageName;
};

const formatDuration = (hours: number, minutes: number): string => {
  if (hours > 0) {
    return `${hours} hrs, ${minutes} min`;
  }
  return `${minutes} minutes`;
};

const MobileAddictionScreen = () => {
  const navigation = useNavigation();
  const [showAdminPopup, setShowAdminPopup] = useState(true);
  const [isAdminEnabled, setIsAdminEnabled] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageData[]>([]);
  const [totalScreenTime, setTotalScreenTime] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (Platform.OS === 'android') {
      UsageAccessModule.isUsageAccessGranted()
        .then((granted: boolean) => {
          if (!granted) {
            UsageAccessModule.openUsageAccessSettings();
          } else {
            fetchUsageStats();
          }
        })
        .catch((err: any) => {
          console.warn("Error checking usage access", err);
        });
    }
  }, []);

  const fetchUsageStats = () => {
    UsageStatsModule.getUsageStats({}, (err: any, result: any) => {
      if (err) {
        console.warn("Error getting stats", err);
      } else {
        // Filter out system apps and sort by usage time
        const filteredStats = result
          .filter((stat: UsageData) => stat.rawInSeconds > 0)
          .sort((a: UsageData, b: UsageData) => b.rawInSeconds - a.rawInSeconds);

        // Calculate total screen time
        const totalSeconds = filteredStats.reduce((acc: number, curr: UsageData) => acc + curr.rawInSeconds, 0);
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

        setTotalScreenTime({ hours: totalHours, minutes: totalMinutes });
        setUsageStats(filteredStats);
      }
    });
  };

  const handleEnableAdmin = async () => {
    try {
      await AdminModule.activateAdmin();
      setIsAdminEnabled(true);
      setShowAdminPopup(false);
      Alert.alert('Success', 'Admin access has been enabled');
      fetchUsageStats();
    } catch (error) {
      Alert.alert('Error', 'Failed to enable admin access');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showAdminPopup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAdminPopup(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admin Access Required</Text>
            <Text style={styles.modalText}>
              To control mobile usage, this app needs admin access. This will allow the app to:
            </Text>
            <Text style={styles.modalBullet}>• Monitor app usage</Text>
            <Text style={styles.modalBullet}>• Track screen time</Text>
            <Text style={styles.modalBullet}>• View detailed usage statistics</Text>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={handleEnableAdmin}
            >
              <Text style={styles.adminButtonText}>Enable Admin Access</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <View style={styles.content}> */}

      <View style={styles.header}>
        <TouchableOpacity testID="header-back-button" onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity details</Text>
        <TouchableOpacity onPress={() => {}}>
          {/* <Icon name="star-border" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>

        {/* <Text style={styles.title}>Activity details</Text> */}

        <View style={styles.screenTimeContainer}>
          <Text style={styles.screenTimeLabel}>Screen time</Text>
          <Text style={styles.screenTimeValue}>
            {totalScreenTime.hours} hrs, {totalScreenTime.minutes} min
          </Text>
          <Text style={styles.screenTimeSubtext}>Today</Text>
        </View>

        <ScrollView style={styles.appList}>
          {usageStats.map((stat, index) => (
            <View key={index} style={styles.appItem}>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{getAppName(stat.packageName)}</Text>
                <Text style={styles.appTime}>
                  {formatDuration(stat.hours, stat.minutes)}
                </Text>
              </View>
              <TouchableOpacity style={styles.timerIcon}>
                <Text>⌛</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalBullet: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  adminButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  adminButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  screenTimeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  screenTimeLabel: {
    fontSize: Dimens.fontSize.FONTSIZE_14,
    color: Colors.primary,
    marginBottom: 10,
  },
  screenTimeValue: {
    fontSize: Dimens.fontSize.FONTSIZE_18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  screenTimeSubtext: {
    fontSize: 16,
    color: Colors.text,
    opacity: 0.7,
  },
  appList: {
    flex: 1,
    padding: 16,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  appTime: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.7,
  },
  timerIcon: {
    padding: 10,
  },
});

export default MobileAddictionScreen; 