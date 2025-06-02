import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  headerDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    // marginBottom:hp("1%"),
    padding: 16,
    marginTop:hp("1%"),
  },
  emptyContainer: {
    height: hp("80%"),
    width: wp("100%"),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    marginTop: 8,
    fontSize: 16,
    color: '#4D96FF',
    fontWeight: '500',
  },
  floatingAddButton: {
    backgroundColor: Colors.white,
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 28,   
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 16,
    marginBottom: hp("2%"),
    bottom:hp("2%"),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeContainer: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: hp("80%"),
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    // width: 54,
    // height: 56,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fabInner: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center", 
    alignItems: "center",
  },
  fabIcon: {
    width: 24,
    height: 24,
  },
}); 