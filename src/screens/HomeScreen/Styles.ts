import {StyleSheet, Platform} from 'react-native';
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
        marginBottom: hp('7%'),
        backgroundColor: '#F8F9FA',
      },
      header: {
        padding: wp('5%'),
        backgroundColor: Colors.white,
      },
      headerTop: {
        marginBottom: hp('2%'),
      },
      greeting: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        color: '#1A1C1E',
        marginBottom: hp('0.5%'),
      },
      subGreeting: {
        fontSize: wp('3.5%'),
        color: '#71767A',
      },
      dateSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
      },
      dateLabel: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: '#2196F3',
      },
      clubsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 20,
      },
      clubsText: {
        fontSize: wp('3.5%'),
        color: '#71767A',
        marginRight: wp('2%'),
      },
      clubsBadge: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.2%'),
      },
      clubsCount: {
        color: Colors.white,
        fontSize: wp('3%'),
        fontWeight: '600',
      },
      daysContainer: {
        flexDirection: 'row',
        marginTop: hp('1%'),
      },
      dayButton: {
        alignItems: 'center',
        padding: wp('3%'),
        marginRight: wp('2%'),
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        width: wp('14%'),
      },
      selectedDay: {
        backgroundColor: Colors.primary,
      },
      dayName: {
        fontSize: wp('3%'),
        color: '#71767A',
        marginBottom: hp('0.5%'),
      },
      dayNumber: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: '#1A1C1E',
      },
      selectedDayText: {
        color: Colors.white,
      },
      progressCard: {
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      progressContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap:10
      },
      progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
      },
      progressSubtitle: {
        fontSize: 14,
        opacity: 0.8,
      },
      habitsContainer: {
        padding: wp('5%'),
      },
      sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
      },
      sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      },
      sectionTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: Colors.palette.neutral900,
      },
      viewAllButton: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        backgroundColor: Colors.palette.primary100,
        borderRadius: 20,
      },
      viewAllText: {
        fontSize: wp('3.5%'),
        color: Colors.primary,
        fontWeight: '600',
      },
      habitsScrollView: {
        flex: 1,
      },
      habitCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: wp('4%'),
        borderRadius: 5,
        marginBottom: hp('2%'),
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation:2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        overflow: 'hidden',
      },
      habitLeft: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      habitIcon: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
      },
      habitEmoji: {
        fontSize: wp('6%'),
      },
      habitInfo: {
        // flex: 1,
      },
      habitName: {
        fontSize: wp('4%'),
        fontWeight: '500',
        color: '#1A1C1E',
        marginBottom: hp('0.5%'),
      },
      habitTime: {
        fontSize: 14,
        color: Colors.palette.neutral600,
        marginTop: 4,
      },
      habitStatus: {
        fontSize: 12,
        color: Colors.palette.neutral500,
        marginTop: 4,
      },
      habitRight: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      noHabitsContainer: {
        padding: wp('4%'),
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: hp('2%'),
      },
      noHabitsText: {
        color: Colors.palette.neutral500,
        fontSize: 16,
        textAlign: 'center',
      },
      loadingMoreContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp("20%"), // Adjust as needed
      },
      completeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.palette.neutral100,
      },
      delContainer: {
        padding: 8,
      },
      delIcon: {
        width: wp('4.5%'),
        height: hp("2.5%"),
      },
      completedIcon: {
        width: wp('8%'),
        height: wp('8%'),
        marginRight: wp('2%'),
      },
});
