import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TextStyles } from '../../constants/textstyle';
import { Dimens } from '../../constants/dimens';
import layout from '../../utils/layout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom:hp("1.5%")
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  content: {
    // marginTop:hp("1.5%"),
    marginBottom:hp("1.5%"),
    flexGrow: 1,
    // flex:1,
    // backgroundColor:"red",
    marginHorizontal: 16,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    // marginBottom: hp("2.3%"),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  contentInput: {
    fontSize: 16,
    height:'auto',
    minHeight: 200,
    padding: 16,
    textAlignVertical: 'top',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addMemories:{
    width:wp("85%"),
    alignSelf:'center',
    justifyContent:"center",
    alignItems:'center'
  }
});
