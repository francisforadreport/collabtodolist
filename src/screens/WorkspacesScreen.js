import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import WorkspaceCard from '../components/WorkspaceCard';
import Icon from 'react-native-vector-icons/Feather';

// Updated WorkspacesScreen with workspace type differentiation and minimalist design
const WorkspacesScreen = ({ 
  workspaces, 
  onWorkspacePress, 
  onCreateWorkspace,
  onLogout,
  userProfile
}) => {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('all'); // 'all', 'personal', 'couple', 'family'
  
  const filteredWorkspaces = filterType === 'all' 
    ? workspaces 
    : workspaces.filter(workspace => workspace.type === filterType);
  
  const renderItem = ({ item }) => (
    <WorkspaceCard
      name={item.name}
      type={item.type}
      memberCount={item.members.length}
      taskCount={item.taskCount || 0}
      completedTaskCount={item.completedTaskCount || 0}
      onPress={() => onWorkspacePress(item)}
    />
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[
        styles.header,
        {
          padding: theme.spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <View style={styles.userInfo}>
          <View style={[
            styles.avatar,
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.primary + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.s
            }
          ]}>
            <Text style={[
              styles.avatarText,
              {
                color: theme.colors.primary,
                fontSize: theme.typography.fontSize.m,
                fontWeight: 'bold'
              }
            ]}>
              {userProfile?.displayName?.charAt(0) || 'U'}
            </Text>
          </View>
          <View>
            <Text style={[
              styles.userName,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.m,
                fontWeight: '600'
              }
            ]}>
              {userProfile?.displayName || 'User'}
            </Text>
            <Text style={[
              styles.userEmail,
              {
                color: theme.colors.secondary,
                fontSize: theme.typography.fontSize.xs
              }
            ]}>
              {userProfile?.email || ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="log-out" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={[
        styles.filterContainer,
        {
          flexDirection: 'row',
          padding: theme.spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            {
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.s,
              borderRadius: theme.borderRadius.s,
              marginRight: theme.spacing.s,
              backgroundColor: filterType === 'all' ? theme.colors.primary : 'transparent'
            }
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[
            styles.filterText,
            {
              color: filterType === 'all' ? '#fff' : theme.colors.text,
              fontSize: theme.typography.fontSize.s,
              fontWeight: '500'
            }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            {
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.s,
              borderRadius: theme.borderRadius.s,
              marginRight: theme.spacing.s,
              backgroundColor: filterType === 'personal' ? theme.colors.primary : 'transparent'
            }
          ]}
          onPress={() => setFilterType('personal')}
        >
          <Text style={[
            styles.filterText,
            {
              color: filterType === 'personal' ? '#fff' : theme.colors.text,
              fontSize: theme.typography.fontSize.s,
              fontWeight: '500'
            }
          ]}>
            Personal
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            {
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.s,
              borderRadius: theme.borderRadius.s,
              marginRight: theme.spacing.s,
              backgroundColor: filterType === 'couple' ? theme.colors.primary : 'transparent'
            }
          ]}
          onPress={() => setFilterType('couple')}
        >
          <Text style={[
            styles.filterText,
            {
              color: filterType === 'couple' ? '#fff' : theme.colors.text,
              fontSize: theme.typography.fontSize.s,
              fontWeight: '500'
            }
          ]}>
            Couple
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            {
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.s,
              borderRadius: theme.borderRadius.s,
              backgroundColor: filterType === 'family' ? theme.colors.primary : 'transparent'
            }
          ]}
          onPress={() => setFilterType('family')}
        >
          <Text style={[
            styles.filterText,
            {
              color: filterType === 'family' ? '#fff' : theme.colors.text,
              fontSize: theme.typography.fontSize.s,
              fontWeight: '500'
            }
          ]}>
            Family
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[
        styles.titleContainer,
        {
          padding: theme.spacing.m,
          paddingBottom: 0
        }
      ]}>
        <Text style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.xl,
            fontWeight: 'bold'
          }
        ]}>
          Your Workspaces
        </Text>
      </View>
      
      {filteredWorkspaces.length === 0 ? (
        <View style={[
          styles.emptyContainer,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.xl
          }
        ]}>
          <Icon name="inbox" size={48} color={theme.colors.border} />
          <Text style={[
            styles.emptyText,
            {
              color: theme.colors.secondary,
              fontSize: theme.typography.fontSize.m,
              textAlign: 'center',
              marginTop: theme.spacing.m
            }
          ]}>
            {filterType === 'all' 
              ? "You don't have any workspaces yet. Create your first workspace to get started!"
              : `You don't have any ${filterType} workspaces yet.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkspaces}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            {
              padding: theme.spacing.m
            }
          ]}
        />
      )}
      
      <View style={[
        styles.footer,
        {
          padding: theme.spacing.m,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border
        }
      ]}>
        <Button 
          title="Create New Workspace" 
          onPress={onCreateWorkspace} 
          style={styles.createButton}
          icon="plus"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  footer: {
  },
  createButton: {
    marginBottom: 0,
  },
});

export default WorkspacesScreen;
