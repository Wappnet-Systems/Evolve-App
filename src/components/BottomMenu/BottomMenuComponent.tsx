import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, TouchableOpacity, Text, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { icons } from "../../constants/images";
import SignupPage from "../../screens/SignupScreen/SignUpScreen";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";
import { Strings } from "../../constants/strings";
import HomeScreen from "../../presentation/screens/Home/HomeScreen";
import { styles } from "./Style";

const Tab = createBottomTabNavigator();

const FloatingShopButton: React.FC = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [isNestedVisible, setIsNestedVisible] = useState(false);

  const toggleModal = () => setIsVisible(!isVisible);
  const toggleNestedModal = () => setIsNestedVisible(!isNestedVisible);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        testID="floating-shop-button"
        activeOpacity={0.7}
        onPress={toggleModal}
      >
        <View style={styles.fabInner}>
          <Image
            source={icons.IC_BOTTOMMENU_CARTUNSELECT}
            style={styles.fabIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheet}>

            <TouchableOpacity style={styles.option}
             onPress={() => {
              toggleModal(); 
              navigation.navigate("MyDairyScreen");
            }}
             >
              <Text style={styles.bottomText}>{Strings.Daily_Dairy}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={toggleNestedModal}>
              <Text style={styles.bottomText}>{Strings.Create_Custom_Habit}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <Text style={styles.bottomText}>{Strings.Create_Diet_Plan}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}
             onPress={() => {
              toggleModal(); 
              navigation.navigate("AlarmScreen");
            }}
            >
              <Text style={styles.bottomText}>{Strings.Puzzle_Alarm_System}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
       
      </Modal>

      <Modal
        visible={isNestedVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleNestedModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheet}>

            <View style={styles.row}>
              <TouchableOpacity 
                style={[styles.card, styles.quitHabit]}
                onPress={() => {
                  toggleNestedModal(); // Close Nested Modal
                  toggleModal(); // Close Main Modal
                  navigation.navigate("MobileAddiction");
                }}
              >
                <Text style={styles.title}>Quit Bad Habit</Text>
                <Text style={styles.description}>Never too late...</Text>
                <View style={styles.iconContainer}>
                  <Text style={styles.crossIcon}>✖️</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
              style={[styles.card, styles.goodHabit]}
              onPress={() => {
                toggleNestedModal(); // Close Nested Modal
                toggleModal(); // Close Main Modal
                navigation.navigate("CreateHabit");
              }}
               >
                <Text style={styles.title}>New Good Habit</Text>
                <Text style={styles.description}>For a better life</Text>
                <View style={styles.iconContainer}>
                  <Text style={styles.checkIcon}>✔️</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.card, styles.mood]}>
              <Text style={styles.title}>Add Mood</Text>
              <Text style={styles.description}>How're you feeling?</Text>
              <View style={styles.emojiContainer}>
                {['😀', '😎', '😢', '😠', '😍'].map((emoji, index) => (
                  <Text key={index} style={styles.emoji}>{emoji}</Text>
                ))}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleNestedModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Define props interface for BottomNavigation
interface BottomNavigationProps {
  testID?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ testID }) => {
  return (
    <View testID={testID} style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="HomePage"
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="HomePage"
          component={HomeScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
                Home
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                testID={focused ? "home-icon-active" : undefined}
                source={icons.IC_BOTTOMMENU_HOMEUNSELECT}
                style={[styles.icon, focused && styles.iconFocused]}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="FloatingButton"
          component={SignupPage}
          options={{
            tabBarButton: () => <FloatingShopButton />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
                Profile
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                testID={focused ? "profile-icon-active" : undefined}
                source={icons.IC_BOTTOMMENU_SETTINGUNSELECT}
                style={[styles.icon, focused && styles.iconFocused]}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigation;
