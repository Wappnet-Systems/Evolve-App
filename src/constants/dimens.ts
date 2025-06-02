import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const Dimens = {
  fontSize: {
    FONTSIZE_10: 10,
    FONTSIZE_12: 12,
    FONTSIZE_14: 14,
    FONTSIZE_16: 16,
    FONTSIZE_18: 18,
    FONTSIZE_20: 20,
    FONTSIZE_36: 36,
  },
  height: {
    HEIGHT_20: hp('2.53%'),
    HEIGHT_40: hp('5.025%'),
    HEIGHT_50: hp('6.30%'),
    HEIGHT_60: hp('7.56%'),
    HEIGHT_75: hp('9.50%'),
  },
  width: {
   WIDTH_20: hp('5.63%'),
    WIDTH_40: hp('10%'),
    WIDTH_50: hp('14.1%'),
    WIDTH_75: hp('21.13%'),
  },
  button: {
    height: hp('6.30%'),
    width: wp('90%'),
    borderRadius: 4,
  },
  roundedButton: {
    height: hp('7.1%'),
    width: wp('15.20%'),
    borderRadius: 50,
  },
  icon: {
    GOOGLESIZE: {width: wp('5.8%'), height: hp('2.8%')},
    APPLESIZE: {width: wp('6%'), height: hp('3%')},
    FACEBOOKSIZE: {width: wp('3.5%'), height: hp('4%')},

    EMAIL: {width: wp('5.90%'), height: hp('2.26%')},
  },
  inputField: {
    height: hp('6.30%'),
    borderRadius: 10,
    paddingHorizontal: wp('2.80%'),
  },
};
