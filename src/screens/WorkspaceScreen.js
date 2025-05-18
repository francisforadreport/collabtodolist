import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import ChecklistItem from '../components/ChecklistItem';

const WorkspaceScreen = ({ 
  workspace,
  taskLists,
  onAddList,
  onListPress,
  onInviteMembers,
  onBackPress
}) => {
  const { colors } = useTheme();
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.listCard, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }
      ]}
      onPress={() => onListPress(item)}
    >
      <Text style={[styles.listTitle, { color: colors.text }]}>{item.title}</Text>
      <View style={styles.listStats}>
        <Text style={[styles.listStat, { color: colors.text + '80' }]}>
          {item.taskCount || 0} tasks
        </Text>
        <Text style={[styles.listStat, { color: colors.text + '80' }]}>
          {item.completedCount || 0} completed
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{workspace.name}</Text>
      </View>
      
      <View style={styles.membersSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Members</Text>
          <TouchableOpacity onPress={onInviteMembers}>
            <Text style={[styles.inviteText, { color: colors.primary }]}>+ Invite</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.membersList}>
          {workspace.members.map((member, index) => (
            <View 
              key={index} 
              style={[
                styles.memberChip, 
                { 
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary + '40'
                }
              ]}
            >
              <Text style={[styles.memberName, { color: colors.text }]}>
                {member.displayName || 'User'}
              </Text>
              {member.role === 'admin' && (
                <Text style={[styles.adminBadge, { color: colors.primary }]}>
                  Admin
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.listsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Task Lists</Text>
        
        {taskLists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
              No task lists yet. Create your first list to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            data={taskLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Create New List" 
          onPress={onAddList} 
          style={styles.addButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  membersSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  inviteText: {
    fontSize: 16,
    fontWeight: '500',
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },
  adminBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listsSection: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingTop: 8,
  },
  listCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listStat: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    marginBottom: 0,
  },
});

export default WorkspaceScreen;
