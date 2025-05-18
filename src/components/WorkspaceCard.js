import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

// New WorkspaceCard component with workspace type differentiation
const WorkspaceCard = ({ 
  name, 
  type = 'personal', // 'personal', 'couple', or 'family'
  memberCount, 
  taskCount, 
  completedTaskCount = 0,
  onPress, 
  style 
}) => {
  const theme = useTheme();
  
  // Get workspace type specific styling
  const getWorkspaceTypeColor = () => {
    switch(type) {
      case 'couple':
        return theme.colors.couple;
      case 'family':
        return theme.colors.family;
      case 'personal':
      default:
        return theme.colors.personal;
    }
  };
  
  const getWorkspaceIcon = () => {
    switch(type) {
      case 'couple':
        return 'users';
      case 'family':
        return 'home';
      case 'personal':
      default:
        return 'user';
    }
  };
  
  const getWorkspaceTypeLabel = () => {
    switch(type) {
      case 'couple':
        return 'Couple';
      case 'family':
        return 'Family';
      case 'personal':
      default:
        return 'Personal';
    }
  };
  
  // Calculate completion percentage
  const completionPercentage = taskCount > 0 
    ? Math.round((completedTaskCount / taskCount) * 100) 
    : 0;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.m,
          borderLeftWidth: 4,
          borderLeftColor: getWorkspaceTypeColor(),
          padding: theme.spacing.m,
          marginBottom: theme.spacing.m
        }, 
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View 
            style={[
              styles.iconContainer, 
              { 
                backgroundColor: getWorkspaceTypeColor() + '40',
                borderRadius: theme.borderRadius.s,
                padding: theme.spacing.xs,
                marginRight: theme.spacing.s
              }
            ]}
          >
            <Icon name={getWorkspaceIcon()} size={16} color={theme.colors.text} />
          </View>
          <View>
            <Text style={[styles.name, { color: theme.colors.text, fontSize: theme.typography.fontSize.l, fontWeight: '600' }]}>
              {name}
            </Text>
            <Text style={[styles.type, { color: theme.colors.secondary, fontSize: theme.typography.fontSize.xs }]}>
              {getWorkspaceTypeLabel()} Workspace
            </Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={theme.colors.secondary} />
      </View>
      
      <View style={[styles.progressBar, { backgroundColor: theme.colors.border, marginVertical: theme.spacing.m }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: getWorkspaceTypeColor(),
              width: `${completionPercentage}%` 
            }
          ]} 
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.stat, { color: theme.colors.secondary, fontSize: theme.typography.fontSize.s }]}>
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </Text>
        <Text style={[styles.stat, { color: theme.colors.secondary, fontSize: theme.typography.fontSize.s }]}>
          {completedTaskCount}/{taskCount} tasks
        </Text>
        <Text style={[styles.completion, { color: theme.colors.text, fontSize: theme.typography.fontSize.s, fontWeight: '500' }]}>
          {completionPercentage}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default WorkspaceCard;
