import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import ChecklistItem from '../components/ChecklistItem';
import TaskDetailModal from '../components/TaskDetailModal';
import Icon from 'react-native-vector-icons/Feather';

// Updated TaskListScreen with minimalist design and enhanced task structure
const TaskListScreen = ({ 
  listTitle,
  tasks,
  onAddTask,
  onTaskToggle,
  onTaskPress,
  onBackPress,
  workspaceType = 'personal',
  workspaceMembers = []
}) => {
  const theme = useTheme();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [filterAssigned, setFilterAssigned] = useState('all'); // 'all', 'me', 'others', 'unassigned'
  const [filterTag, setFilterTag] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Get all unique tags from tasks
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];
  
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filterStatus === 'active' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    
    // Filter by assignment
    if (filterAssigned === 'me' && task.assignedTo !== 'currentUserId') return false; // Replace with actual current user ID
    if (filterAssigned === 'others' && (task.assignedTo === 'currentUserId' || !task.assignedTo)) return false;
    if (filterAssigned === 'unassigned' && task.assignedTo) return false;
    
    // Filter by tag
    if (filterTag && (!task.tags || !task.tags.includes(filterTag))) return false;
    
    return true;
  });
  
  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };
  
  const handleAddTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };
  
  const renderItem = ({ item }) => (
    <ChecklistItem
      title={item.title}
      description={item.description}
      deadline={item.deadline}
      completed={item.completed}
      assignedTo={item.assignedToName}
      tags={item.tags || []}
      onToggle={() => onTaskToggle(item.id)}
      onPress={() => handleTaskPress(item)}
    />
  );
  
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
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[
        styles.header,
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: theme.spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <TouchableOpacity 
          onPress={onBackPress} 
          style={[
            styles.backButton,
            {
              marginRight: theme.spacing.m
            }
          ]}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={[
          styles.titleContainer,
          {
            flex: 1
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
            {listTitle}
          </Text>
          <View style={[
            styles.workspaceType,
            {
              flexDirection: 'row',
              alignItems: 'center'
            }
          ]}>
            <View style={[
              styles.workspaceIndicator,
              {
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getWorkspaceColor(),
                marginRight: theme.spacing.xs
              }
            ]} />
            <Text style={[
              styles.workspaceTypeText,
              {
                color: theme.colors.secondary,
                fontSize: theme.typography.fontSize.xs
              }
            ]}>
              {workspaceType.charAt(0).toUpperCase() + workspaceType.slice(1)} Workspace
            </Text>
          </View>
        </View>
      </View>
      
      <View style={[
        styles.filterContainer,
        {
          padding: theme.spacing.m,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <View style={[
          styles.filterRow,
          {
            flexDirection: 'row',
            marginBottom: theme.spacing.s
          }
        ]}>
          <Text style={[
            styles.filterLabel,
            {
              color: theme.colors.secondary,
              fontSize: theme.typography.fontSize.xs,
              marginRight: theme.spacing.s
            }
          ]}>
            Status:
          </Text>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              {
                paddingVertical: 2,
                paddingHorizontal: theme.spacing.s,
                borderRadius: theme.borderRadius.s,
                marginRight: theme.spacing.s,
                backgroundColor: filterStatus === 'all' ? theme.colors.primary : 'transparent'
              }
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[
              styles.filterText,
              {
                color: filterStatus === 'all' ? '#fff' : theme.colors.text,
                fontSize: theme.typography.fontSize.xs
              }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              {
                paddingVertical: 2,
                paddingHorizontal: theme.spacing.s,
                borderRadius: theme.borderRadius.s,
                marginRight: theme.spacing.s,
                backgroundColor: filterStatus === 'active' ? theme.colors.primary : 'transparent'
              }
            ]}
            onPress={() => setFilterStatus('active')}
          >
            <Text style={[
              styles.filterText,
              {
                color: filterStatus === 'active' ? '#fff' : theme.colors.text,
                fontSize: theme.typography.fontSize.xs
              }
            ]}>
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              {
                paddingVertical: 2,
                paddingHorizontal: theme.spacing.s,
                borderRadius: theme.borderRadius.s,
                backgroundColor: filterStatus === 'completed' ? theme.colors.primary : 'transparent'
              }
            ]}
            onPress={() => setFilterStatus('completed')}
          >
            <Text style={[
              styles.filterText,
              {
                color: filterStatus === 'completed' ? '#fff' : theme.colors.text,
                fontSize: theme.typography.fontSize.xs
              }
            ]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
        
        {workspaceType !== 'personal' && (
          <View style={[
            styles.filterRow,
            {
              flexDirection: 'row',
              marginBottom: theme.spacing.s
            }
          ]}>
            <Text style={[
              styles.filterLabel,
              {
                color: theme.colors.secondary,
                fontSize: theme.typography.fontSize.xs,
                marginRight: theme.spacing.s
              }
            ]}>
              Assigned:
            </Text>
            <TouchableOpacity 
              style={[
                styles.filterButton,
                {
                  paddingVertical: 2,
                  paddingHorizontal: theme.spacing.s,
                  borderRadius: theme.borderRadius.s,
                  marginRight: theme.spacing.s,
                  backgroundColor: filterAssigned === 'all' ? theme.colors.primary : 'transparent'
                }
              ]}
              onPress={() => setFilterAssigned('all')}
            >
              <Text style={[
                styles.filterText,
                {
                  color: filterAssigned === 'all' ? '#fff' : theme.colors.text,
                  fontSize: theme.typography.fontSize.xs
                }
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton,
                {
                  paddingVertical: 2,
                  paddingHorizontal: theme.spacing.s,
                  borderRadius: theme.borderRadius.s,
                  marginRight: theme.spacing.s,
                  backgroundColor: filterAssigned === 'me' ? theme.colors.primary : 'transparent'
                }
              ]}
              onPress={() => setFilterAssigned('me')}
            >
              <Text style={[
                styles.filterText,
                {
                  color: filterAssigned === 'me' ? '#fff' : theme.colors.text,
                  fontSize: theme.typography.fontSize.xs
                }
              ]}>
                To Me
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton,
                {
                  paddingVertical: 2,
                  paddingHorizontal: theme.spacing.s,
                  borderRadius: theme.borderRadius.s,
                  marginRight: theme.spacing.s,
                  backgroundColor: filterAssigned === 'others' ? theme.colors.primary : 'transparent'
                }
              ]}
              onPress={() => setFilterAssigned('others')}
            >
              <Text style={[
                styles.filterText,
                {
                  color: filterAssigned === 'others' ? '#fff' : theme.colors.text,
                  fontSize: theme.typography.fontSize.xs
                }
              ]}>
                To Others
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton,
                {
                  paddingVertical: 2,
                  paddingHorizontal: theme.spacing.s,
                  borderRadius: theme.borderRadius.s,
                  backgroundColor: filterAssigned === 'unassigned' ? theme.colors.primary : 'transparent'
                }
              ]}
              onPress={() => setFilterAssigned('unassigned')}
            >
              <Text style={[
                styles.filterText,
                {
                  color: filterAssigned === 'unassigned' ? '#fff' : theme.colors.text,
                  fontSize: theme.typography.fontSize.xs
                }
              ]}>
                Unassigned
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {allTags.length > 0 && (
          <View style={[
            styles.filterRow,
            {
              flexDirection: 'row',
              flexWrap: 'wrap'
            }
          ]}>
            <Text style={[
              styles.filterLabel,
              {
                color: theme.colors.secondary,
                fontSize: theme.typography.fontSize.xs,
                marginRight: theme.spacing.s
              }
            ]}>
              Tags:
            </Text>
            <TouchableOpacity 
              style={[
                styles.filterButton,
                {
                  paddingVertical: 2,
                  paddingHorizontal: theme.spacing.s,
                  borderRadius: theme.borderRadius.s,
                  marginRight: theme.spacing.s,
                  marginBottom: 4,
                  backgroundColor: filterTag === null ? theme.colors.primary : 'transparent'
                }
              ]}
              onPress={() => setFilterTag(null)}
            >
              <Text style={[
                styles.filterText,
                {
                  color: filterTag === null ? '#fff' : theme.colors.text,
                  fontSize: theme.typography.fontSize.xs
                }
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            {allTags.map((tag, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.filterButton,
                  {
                    paddingVertical: 2,
                    paddingHorizontal: theme.spacing.s,
                    borderRadius: theme.borderRadius.s,
                    marginRight: theme.spacing.s,
                    marginBottom: 4,
                    backgroundColor: filterTag === tag ? theme.colors.primary : 'transparent'
                  }
                ]}
                onPress={() => setFilterTag(tag)}
              >
                <Text style={[
                  styles.filterText,
                  {
                    color: filterTag === tag ? '#fff' : theme.colors.text,
                    fontSize: theme.typography.fontSize.xs
                  }
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {filteredTasks.length === 0 ? (
        <View style={[
          styles.emptyContainer,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.xl
          }
        ]}>
          <Icon name="clipboard" size={48} color={theme.colors.border} />
          <Text style={[
            styles.emptyText,
            {
              color: theme.colors.secondary,
              fontSize: theme.typography.fontSize.m,
              textAlign: 'center',
              marginTop: theme.spacing.m
            }
          ]}>
            No tasks match your filters. Adjust filters or add a new task!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
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
          title="Add New Task" 
          onPress={handleAddTask} 
          style={styles.addButton}
        />
      </View>
      
      <TaskDetailModal
        visible={showTaskModal}
        task={selectedTask}
        workspaceMembers={workspaceMembers}
        onClose={() => setShowTaskModal(false)}
        onSave={onAddTask}
        onDelete={(id) => {
          // Handle delete
          setShowTaskModal(false);
        }}
        onAssign={(id, userId) => {
          // Handle assign
        }}
        onComplete={(id) => {
          // Handle complete
          onTaskToggle(id);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  footer: {
  },
  addButton: {
    marginBottom: 0,
  },
});

export default TaskListScreen;
