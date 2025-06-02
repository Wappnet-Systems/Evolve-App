import {StyleSheet} from 'react-native';
import {TextStyles} from '../../constants/textstyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from '../../constants/colors';
import {Dimens} from '../../constants/dimens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
    paddingTop: hp('10%'),
  },
  titleContainer: {
    marginBottom: hp('4.5%'),
  },
  content: {
    flex: 1,
    paddingBottom: hp('12.60%'),
  },
  titleText: {
    fontFamily: TextStyles.boldText,
    fontSize: Dimens.fontSize.FONTSIZE_36,
    color: Colors.black,
  },
  forgotPasswordText: {
    fontFamily: TextStyles.regularText,
    fontSize: Dimens.fontSize.FONTSIZE_12,
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: hp('6.5%'),
  },
  loginButton: {
    marginBottom: Dimens.height.HEIGHT_75,
  },
  ssoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  continueText: {
    fontFamily: TextStyles.mediumText,
    fontSize: Dimens.fontSize.FONTSIZE_12,
    color: Colors.darkGray2,
    textAlign: 'center',
    marginBottom: Dimens.height.HEIGHT_20,
  },
  ssoButton: {
    marginRight: wp('2.80%'),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp('3.70%'),
  },

  footerText1: {
    fontSize: Dimens.fontSize.FONTSIZE_14,
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    fontFamily: TextStyles.regularText,
    color: Colors.darkGray2,
  },
  footerText2: {
    fontSize: Dimens.fontSize.FONTSIZE_14,
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    fontFamily: TextStyles.semiBoldText,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
