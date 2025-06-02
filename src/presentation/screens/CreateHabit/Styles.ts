import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dimens } from '../../../constants/dimens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    subContainer: {
        padding: 16,
    },
    categoryCard: {
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        padding: wp('3.5%'),
    },
    categoryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    categoryIcon: {
        fontSize: 24,
    },
    habitListContent: {
        backgroundColor: Colors.white,
        padding: 16,
    },
    habitListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    // backgroundColor: Colors.palette.neutral100,
    // backgroundColor: "red",
    },
    habitIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    habitListItemText: {
        fontSize: Dimens.fontSize.FONTSIZE_16,
        color: Colors.palette.neutral800,
    },
    orContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    orText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 16,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },
    emojiSelectorContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    emojiSelectorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectedEmoji: {
        fontSize: 24,
    },
    emojiLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    emojiPicker: {
        maxHeight: 100,
        marginBottom: 16,
    },
    emojiOption: {
        padding: 8,
    },
    emojiOptionText: {
        fontSize: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelBtn: {
        backgroundColor: Colors.palette.neutral200,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    addHabitcelBtn: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: wp('4%'),
    },
    errorText: {
        color: '#FF0000',
        marginBottom: 10,
        textAlign: 'center',
    },
}); 