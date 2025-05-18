import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Updated ChecklistItem component with minimalist vif.today-inspired design
const ChecklistItem = ({ 
  title, 
  description = null,
  deadline = null,
  completed, 
  onToggle, 
  onPress, 
  assignedTo = null,
  tags = [],
  style 
}) => {
  const theme = useTheme();
  
  // Format deadline for display
  const formatDeadline = (date) => {
    if (!date) return null;
    
    const now = new Date();
    const deadlineDate = new Date(date);
    
    // Same day
    if (deadlineDate.toDateString() === now.toDateString()) {
      return `Today, ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (deadlineDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Within a week
    const oneWeek = new Date(now);
    oneWeek.setDate(oneWeek.getDate() + 7);
    if (deadlineDate < oneWeek) {
      const options = { weekday: 'short' };
      return `${deadlineDate.toLocaleDateString([], options)}, ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Beyond a week
    return deadlineDate.toLocaleDateString();
  };
  
  const formattedDeadline = deadline ? formatDeadline(deadline) : null;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          borderLeftWidth: 3,
          borderLeftColor: completed ? theme.colors.success : theme.colors.primary,
          borderRadius: theme.borderRadius.s,
          marginBottom: theme.spacing.s,
          padding: theme.spacing.m
        }, 
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={[
            styles.checkbox, 
            { 
              borderColor: completed ? theme.colors.success : theme.colors.primary,
              backgroundColor: completed ? theme.colors.success : 'transparent',
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              marginRight: theme.spacing.s
            }
          ]} 
          onPress={onToggle}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          {completed && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
        
        <Text 
          style={[
            styles.title, 
            { 
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.m,
              fontWeight: '500',
              textDecorationLine: completed ? 'line-through' : 'none',
              opacity: completed ? 0.7 : 1,
              flex: 1
            }
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
      
      {description && (
        <Text 
          style={[
            styles.description, 
            { 
              color: theme.colors.secondary,
              fontSize: theme.typography.fontSize.s,
              marginTop: theme.spacing.xs,
              marginLeft: 30,
              opacity: completed ? 0.7 : 1
            }
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>
      )}
      
      <View style={styles.footer}>
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View 
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: theme.colors.primary + '20',
                    borderRadius: theme.borderRadius.s,
                    paddingVertical: 2,
                    paddingHorizontal: 6,
                    marginRight: 6
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.tagText,
                    {
                      color: theme.colors.primary,
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: '500'
                    }
                  ]}
                >
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.metaContainer}>
          {assignedTo && (
            <Text 
              style={[
                styles.assignedText, 
                { 
                  color: theme.colors.secondary,
                  fontSize: theme.typography.fontSize.xs,
                  marginRight: theme.spacing.s
                }
              ]}
            >
              @{assignedTo}
            </Text>
          )}
          
          {formattedDeadline && (
            <Text 
              style={[
                styles.deadline, 
                { 
                  color: theme.colors.secondary,
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: '500'
                }
              ]}
            >
              {formattedDeadline}
            </Text>
          )}
        </View>
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
    alignItems: 'center',
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    flexShrink: 1,
  },
  description: {
    lineHeight: 18,
  },
  footer: {
    marginTop: 8,
    marginLeft: 30,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default ChecklistItem;
