import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TextStyles } from '../../constants/textstyle';
import { Dimens } from '../../constants/dimens';
import layout from '../../utils/layout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.palette.neutral100,
  },
  subContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: hp('2.5%'),
    paddingBottom: 32,
  },
  allHabitsContainer: {
    gap: 16,
    marginTop: 24,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  habitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.palette.neutral100,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.palette.neutral200,
  },
  habitLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitTextContainer: {
    gap: 4,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  reminderText: {
    fontSize: 12,
    color: Colors.palette.neutral500,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.palette.neutral200,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 24,
  },
  habitRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8,
    borderRadius: 50,
    // backgroundColor:'red'
  },
  delContainer: {
    padding: 8,
  },
  delIcon: {
    width: wp('4.5%'),
    height: hp("2.5%"),
  },
  btn: {
    backgroundColor: Colors.primary,
    // borderWidth: 1,
    borderRadius: 8,
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp('5%'),
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontWeight: "600",
    color: Colors.palette.neutral900,
    marginBottom: hp('3%'),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.palette.neutral200,
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    color: Colors.palette.neutral900,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp('3%'),
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.palette.neutral200,
    borderRadius: 8,
    padding: wp('3%'),
  },
  addHabitcelBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: wp('3%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: Colors.palette.error100,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: Colors.palette.error600,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    gap: 16,
  },
  // emptyImage: {
  //   width: layout.window.width * 0.6,
  //   height: layout.window.width * 0.6,
  //   marginBottom: 16,
  // },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.palette.neutral400,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyAddButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('2%'),
  },
  emojiSelectorButton: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.palette.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.palette.neutral200,
  },
  selectedEmoji: {
    fontSize: wp('6%'),
  },
  emojiLabel: {
    fontSize: wp('3.5%'),
    color: Colors.palette.neutral600,
  },
  emojiPicker: {
    maxHeight: hp('8%'),
    marginBottom: hp('2%'),
  },
  emojiOption: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.palette.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  emojiOptionText: {
    fontSize: wp('5%'),
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.palette.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.palette.neutral100,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: Colors.palette.neutral200,
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('2%'),
  },
  dateButtonText: {
    fontSize: wp('4%'),
    color: Colors.palette.neutral800,
  },
  durationButton: {
    borderWidth: 1,
    borderColor: Colors.palette.neutral200,
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('2%'),
  },
  durationButtonText: {
    fontSize: wp('4%'),
    color: Colors.palette.neutral800,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationPickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: wp('5%'),
  },
  durationPickerHeader: {
    marginBottom: hp('2%'),
  },
  durationPickerTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: Colors.palette.neutral900,
    marginBottom: hp('2%'),
  },
  typeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.palette.neutral100,
    borderRadius: 8,
    padding: 4,
  },
  typeToggleButton: {
    flex: 1,
    paddingVertical: hp('1%'),
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedTypeButton: {
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  typeToggleText: {
    fontSize: wp('3.5%'),
    color: Colors.palette.neutral600,
  },
  selectedTypeText: {
    color: Colors.palette.neutral900,
    fontWeight: '600',
  },
  durationPickerScroll: {
    maxHeight: hp('40%'),
  },
  durationOption: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.palette.neutral200,
  },
  selectedDuration: {
    backgroundColor: Colors.palette.primary100,
  },
  durationOptionText: {
    fontSize: wp('4%'),
    color: Colors.palette.neutral800,
  },
  selectedDurationText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  durationPickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('3%'),
    gap: wp('3%'),
  },
  durationPickerButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.palette.neutral200,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmButtonText: {
    color: Colors.white,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp('8%'),
    // marginBottom: hp('2%'),
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        // elevation: 3,
      },
    }),
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: Colors.white,
  },
  categoryIcon: {
    fontSize: wp('8%'),
  },
  habitListContent: {
    marginTop: hp('2%'),
    gap: hp('1%'),
  },
  habitListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.palette.neutral100,
    padding: wp('5%'),
    borderRadius: 8,
    gap: wp('3%'),
  },
  habitListItemText: {
    fontSize: wp('4%'),
    color: Colors.palette.neutral800,
  },
  orContainer: {
    alignItems: 'center',
    // marginVertical: hp('2%'),
  },
  orText: {
    fontSize: wp('4%'),
    color: Colors.palette.neutral500,
    fontWeight: '500',
  },
});
