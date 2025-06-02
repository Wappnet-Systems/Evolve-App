import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Platform} from 'react-native';
import { Colors } from '../../constants/colors';
import { TextFontSize } from '../../styles/Text';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('7%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: 8,
  },
  backButton: {
    marginRight: wp('2%'),
    height: '100%',
    width: wp('10%'),
    justifyContent: 'center',
  },
  backIcon: {
    width: wp('6.5%'),
    height: wp('6.5%'),
    // alignSelf: 'center',
    tintColor: Colors.black,
  },
  username: {
    flex: 1,
    fontSize: 20,
    color: Colors.black,
    fontFamily: 'Lato-Bold',
    paddingHorizontal: wp('2%'),
  },
  title: {
    flex: 0.89,
    textAlign: 'center',
    fontSize: TextFontSize.medium,
    color: Colors.black,
    fontFamily: 'Roboto-Bold',
  },
  titleTicker: {
    flex: 0.89,
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? TextFontSize.small : TextFontSize.medium,
    color: Colors.white,
    fontFamily: 'Lato-Bold',
    marginTop: hp('0.8%'),
    width: wp('82%'),
  },
  onlyTitle: {
    fontSize: TextFontSize.large,
    flex: 1,
    textAlign: 'center',
    color: Colors.black,
    fontFamily: 'Roboto-Bold',
  },
  rightIconWrapper: {
    flexDirection: 'row',
    gap: wp('1%'),
  },
  rightIcon: {
    marginLeft: wp('2%'),
    marginRight: wp('1%'),
    height: '100%',
    justifyContent: 'center',
  },
  rightIconImage: {
    width: wp('6.2%'),
    height: wp('6.2%'),
    tintColor: Colors.black,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: wp('5%'),
    height: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
