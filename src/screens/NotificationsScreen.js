import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Feather';

// New NotificationsScreen component for the notification system
const NotificationsScreen = ({ 
  notifications = [],
  onNotificationPress,
  onMarkAllRead,
  onBackPress
}) => {
  const theme = useTheme();
  
  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});
  
  // Convert grouped notifications to sections
  const sections = Object.keys(groupedNotifications).map(date => ({
    title: formatDate(date),
    data: groupedNotifications[date]
  }));
  
  // Format date for section headers
  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    }
  }
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'task_assigned':
        return 'user-check';
      case 'task_completed':
        return 'check-circle';
      case 'deadline_reminder':
        return 'clock';
      case 'workspace_invitation':
        return 'users';
      default:
        return 'bell';
    }
  };
  
  // Format notification message
  const formatNotificationMessage = (notification) => {
    switch(notification.type) {
      case 'task_assigned':
        return `${notification.actorName} assigned you a task: "${notification.taskTitle}"`;
      case 'task_completed':
        return `${notification.actorName} completed a task: "${notification.taskTitle}"`;
      case 'deadline_reminder':
        return `Reminder: "${notification.taskTitle}" is due ${formatDeadline(notification.deadline)}`;
      case 'workspace_invitation':
        return `${notification.actorName} invited you to join "${notification.workspaceName}" workspace`;
      default:
        return notification.message || 'New notification';
    }
  };
  
  // Format deadline for display
  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    // Today
    if (deadlineDate.toDateString() === now.toDateString()) {
      return `today at ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (deadlineDate.toDateString() === tomorrow.toDateString()) {
      return `tomorrow at ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Within a week
    const oneWeek = new Date(now);
    oneWeek.setDate(oneWeek.getDate() + 7);
    if (deadlineDate < oneWeek) {
      const options = { weekday: 'long' };
      return `on ${deadlineDate.toLocaleDateString([], options)} at ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Beyond a week
    return `on ${deadlineDate.toLocaleDateString()}`;
  };
  
  const renderSectionHeader = ({ section }) => (
    <View style={[
      styles.sectionHeader,
      {
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        marginTop: theme.spacing.m
      }
    ]}>
      <Text style={[
        styles.sectionTitle,
        {
          color: theme.colors.secondary,
          fontSize: theme.typography.fontSize.s,
          fontWeight: '600'
        }
      ]}>
        {section.title}
      </Text>
    </View>
  );
  
  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        {
          flexDirection: 'row',
          padding: theme.spacing.m,
          backgroundColor: item.read ? theme.colors.card : theme.colors.card + '80',
          borderLeftWidth: 3,
          borderLeftColor: item.read ? theme.colors.border : theme.colors.primary,
          marginBottom: theme.spacing.s,
          borderRadius: theme.borderRadius.s
        }
      ]}
      onPress={() => onNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.primary + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.m
        }
      ]}>
        <Icon name={getNotificationIcon(item.type)} size={20} color={theme.colors.primary} />
      </View>
      
      <View style={[styles.notificationContent, { flex: 1 }]}>
        <Text style={[
          styles.notificationMessage,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.s,
            fontWeight: item.read ? '400' : '500',
            marginBottom: 4
          }
        ]}>
          {formatNotificationMessage(item)}
        </Text>
        
        <Text style={[
          styles.notificationTime,
          {
            color: theme.colors.secondary,
            fontSize: theme.typography.fontSize.xs
          }
        ]}>
          {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
      
      {!item.read && (
        <View style={[
          styles.unreadIndicator,
          {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.colors.primary,
            marginLeft: theme.spacing.s
          }
        ]} />
      )}
    </TouchableOpacity>
  );
  
  const renderListEmpty = () => (
    <View style={[
      styles.emptyContainer,
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl
      }
    ]}>
      <Icon name="bell-off" size={48} color={theme.colors.border} />
      <Text style={[
        styles.emptyText,
        {
          color: theme.colors.secondary,
          fontSize: theme.typography.fontSize.m,
          textAlign: 'center',
          marginTop: theme.spacing.m
        }
      ]}>
        You don't have any notifications yet
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[
        styles.header,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={onBackPress} 
            style={{ marginRight: theme.spacing.m }}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Icon name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.l,
              fontWeight: 'bold'
            }
          ]}>
            Notifications
          </Text>
        </View>
        
        {notifications.some(n => !n.read) && (
          <TouchableOpacity 
            onPress={onMarkAllRead}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Text style={[
              styles.markAllRead,
              {
                color: theme.colors.primary,
                fontSize: theme.typography.fontSize.s
              }
            ]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <>
            {renderSectionHeader({ section: item })}
            {item.data.map((notification) => (
              <View key={notification.id} style={{ paddingHorizontal: theme.spacing.m }}>
                {renderNotification({ item: notification })}
              </View>
            ))}
          </>
        )}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={[
          styles.listContent,
          {
            flexGrow: 1
          }
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default NotificationsScreen;
