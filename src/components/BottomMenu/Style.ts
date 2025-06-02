import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Colors } from '../../constants/colors';
import { Dimens } from '../../constants/dimens';

export const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        height: 70,
        backgroundColor: "#fff",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      icon: {
        width: 20,
        height: 20,
        tintColor: "#000000",
      },
      iconFocused: {
        tintColor: Colors.primary,
      },
      fab: {
        borderRadius: 50,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: hp('3%'),
        alignSelf: "center",
        elevation: 6,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      fabInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
      },
      fabIcon: {
        width: 24,
        height: 24,
        tintColor: "#fff",
      },
      modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
      },
      bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
      },
      bottomSheetHabit: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
      },
      nestedBottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
      },
      nestedOption: {
        width: "100%",
        paddingVertical: 12,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        marginVertical: 5,
        borderRadius: 10,
      },
      nestedText: {
        color: "#002055",
        fontSize: Dimens.fontSize.FONTSIZE_16,
        fontWeight: "500",
      },
      closeButton: {
        backgroundColor: Colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: hp('3%')
      },
      closeText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
      },
      option: {
        width: "100%",
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        marginTop: hp('1%'),
        borderRadius: 10
      },
      tabBarLabel: {
        fontSize: 12,
        fontFamily: "Roboto",
        color: "#000",
      },
      tabBarLabelFocused: {
        color: Colors.primary,
        fontWeight: "bold",
      },
      bottomText: {
        color: '#002055',
        fontSize: Dimens.fontSize.FONTSIZE_16,
        fontWeight: "500"
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      },
      card: {
        width: "48%",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        backgroundColor: "#F5F5F5",
      },
      quitHabit: {
        borderColor: "#FFCDD2",
        borderWidth: 2,
      },
      goodHabit: {
        borderColor: "#C8E6C9",
        borderWidth: 2,
      },
      mood: {
        width: "100%",
        borderColor: "#FFF9C4",
        borderWidth: 2,
      },
      title: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333",
      },
      description: {
        fontSize: 12,
        color: "#666",
        marginBottom: 10,
      },
      emojiContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
      },
      emoji: {
        fontSize: 18,
      },
      iconContainer: {
        // position: "absolute",
        // right: 10,
        // top: 10,
      },
      crossIcon: {
        color: "#F44336",
        fontSize: 18,
      },
      checkIcon: {
        color: "#4CAF50",
        fontSize: 18,
      },
      closeButtonText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
      },
});
