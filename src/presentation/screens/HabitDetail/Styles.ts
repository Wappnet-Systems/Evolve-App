import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Dimens } from '../../../constants/dimens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.palette.neutral100,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    habitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    input: {
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: Colors.text,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    timeButton: {
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        color: Colors.text,
    },
    dateButton: {
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: Colors.text,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 8,
        minWidth: 60,
        alignItems: 'center',
    },
    selectedDay: {
        backgroundColor: Colors.palette.primary600,
    },
    dayText: {
        fontSize: 14,
        color: Colors.text,
    },
    selectedDayText: {
        color: Colors.palette.neutral100,
    },
    reminderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: Colors.palette.primary600,
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBox: {
        backgroundColor: Colors.palette.primary600,
    },
    checkmark: {
        color: Colors.palette.neutral100,
        fontSize: 16,
    },
    reminderText: {
        fontSize: 16,
        color: Colors.text,
    },
    saveButton: {
        backgroundColor: Colors.palette.primary600,
        borderRadius: 8,
        // padding: 16,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    disabledButton: {
        backgroundColor: Colors.palette.neutral300,
        opacity: 0.7,
    },
    saveBtnTxt:{
        fontSize:Dimens.fontSize.FONTSIZE_16
    },
    durationButton: {
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationText: {
        fontSize: 16,
        color: Colors.text,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationPickerContainer: {
        backgroundColor: Colors.palette.neutral100,
        borderRadius: 16,
        width: '90%',
        maxHeight: '80%',
        padding: 16,
    },
    durationPickerHeader: {
        marginBottom: 16,
    },
    durationPickerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    typeToggleContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.palette.neutral200,
        borderRadius: 8,
        padding: 4,
    },
    typeToggleButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    selectedTypeButton: {
        backgroundColor: Colors.palette.primary600,
    },
    typeToggleText: {
        fontSize: 14,
        textAlign: 'center',
        color: Colors.text,
    },
    selectedTypeText: {
        color: Colors.palette.neutral100,
        fontWeight: '600',
    },
    durationPickerScroll: {
        maxHeight: 300,
    },
    durationOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
    },
    selectedDuration: {
        backgroundColor: Colors.palette.primary100,
    },
    durationOptionText: {
        fontSize: 16,
        color: Colors.text,
        textAlign: 'center',
    },
    selectedDurationText: {
        color: Colors.palette.primary600,
        fontWeight: '600',
    },
    durationPickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    durationPickerButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.palette.neutral200,
    },
    confirmButton: {
        backgroundColor: Colors.palette.primary600,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    confirmButtonText: {
        color: Colors.palette.neutral100,
    },
} as const); 