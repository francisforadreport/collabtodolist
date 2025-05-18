import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

// New ProgressDashboard component for tracking completion metrics
const ProgressDashboard = ({ 
  workspaceType,
  workspaceName,
  totalTasks,
  completedTasks,
  memberStats = [],
  period = 'week' // 'day', 'week', 'month'
}) => {
  const theme = useTheme();
  
  // Calculate overall completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Get workspace color based on type
  const getWorkspaceColor = () => {
    switch(workspaceType) {
      case 'couple':
        return theme.colors.couple;
      case 'family':
        return theme.colors.family;
      case 'personal':
      default:
        return theme.colors.personal;
    }
  };
  
  // Format period for display
  const getPeriodLabel = () => {
    switch(period) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      default:
        return 'Overall';
    }
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden'
      }
    ]}>
      <View style={[
        styles.header,
        {
          backgroundColor: getWorkspaceColor() + '20',
          padding: theme.spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <Text style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.l,
            fontWeight: 'bold'
          }
        ]}>
          Progress Dashboard
        </Text>
        <Text style={[
          styles.subtitle,
          {
            color: theme.colors.secondary,
            fontSize: theme.typography.fontSize.s
          }
        ]}>
          {workspaceName} • {getPeriodLabel()}
        </Text>
      </View>
      
      <ScrollView style={[styles.content, { padding: theme.spacing.m }]}>
        <View style={[
          styles.overallStats,
          {
            marginBottom: theme.spacing.l
          }
        ]}>
          <View style={[
            styles.completionCircle,
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 8,
              borderColor: theme.colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: theme.spacing.m,
              alignSelf: 'center'
            }
          ]}>
            <Text style={[
              styles.completionPercentage,
              {
                color: theme.colors.text,
                fontSize: 32,
                fontWeight: 'bold'
              }
            ]}>
              {completionPercentage}%
            </Text>
          </View>
          
          <View style={[
            styles.taskStats,
            {
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: theme.spacing.m
            }
          ]}>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.l,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }
              ]}>
                {totalTasks}
              </Text>
              <Text style={[
                styles.statLabel,
                {
                  color: theme.colors.secondary,
                  fontSize: theme.typography.fontSize.xs,
                  textAlign: 'center'
                }
              ]}>
                Total Tasks
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                {
                  color: theme.colors.success,
                  fontSize: theme.typography.fontSize.l,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }
              ]}>
                {completedTasks}
              </Text>
              <Text style={[
                styles.statLabel,
                {
                  color: theme.colors.secondary,
                  fontSize: theme.typography.fontSize.xs,
                  textAlign: 'center'
                }
              ]}>
                Completed
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSize.l,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }
              ]}>
                {totalTasks - completedTasks}
              </Text>
              <Text style={[
                styles.statLabel,
                {
                  color: theme.colors.secondary,
                  fontSize: theme.typography.fontSize.xs,
                  textAlign: 'center'
                }
              ]}>
                Remaining
              </Text>
            </View>
          </View>
        </View>
        
        {workspaceType !== 'personal' && memberStats.length > 0 && (
          <View style={styles.memberStats}>
            <Text style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.m,
                fontWeight: '600',
                marginBottom: theme.spacing.m
              }
            ]}>
              Member Contributions
            </Text>
            
            {memberStats.map((member, index) => {
              const memberCompletionPercentage = member.totalTasks > 0 
                ? Math.round((member.completedTasks / member.totalTasks) * 100) 
                : 0;
                
              return (
                <View 
                  key={index}
                  style={[
                    styles.memberItem,
                    {
                      marginBottom: theme.spacing.m
                    }
                  ]}
                >
                  <View style={[
                    styles.memberHeader,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.spacing.xs
                    }
                  ]}>
                    <Text style={[
                      styles.memberName,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.s,
                        fontWeight: '500'
                      }
                    ]}>
                      {member.name}
                    </Text>
                    <Text style={[
                      styles.memberPercentage,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.s,
                        fontWeight: '500'
                      }
                    ]}>
                      {memberCompletionPercentage}%
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.progressBar,
                    {
                      height: 8,
                      backgroundColor: theme.colors.border,
                      borderRadius: 4,
                      overflow: 'hidden'
                    }
                  ]}>
                    <View 
                      style={[
                        styles.progressFill,
                        {
                          width: `${memberCompletionPercentage}%`,
                          height: '100%',
                          backgroundColor: getWorkspaceColor()
                        }
                      ]}
                    />
                  </View>
                  
                  <View style={[
                    styles.memberTaskCount,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: theme.spacing.xs
                    }
                  ]}>
                    <Text style={[
                      styles.memberTaskLabel,
                      {
                        color: theme.colors.secondary,
                        fontSize: theme.typography.fontSize.xs
                      }
                    ]}>
                      {member.completedTasks} of {member.totalTasks} tasks
                    </Text>
                    <Text style={[
                      styles.memberTaskLabel,
                      {
                        color: theme.colors.secondary,
                        fontSize: theme.typography.fontSize.xs
                      }
                    ]}>
                      {member.assignedTasks} assigned
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ProgressDashboard;
