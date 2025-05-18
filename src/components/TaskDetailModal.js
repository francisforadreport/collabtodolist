import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

// Updated TaskDetailModal with enhanced task structure and hashtag support
const TaskDetailModal = ({ 
  visible, 
  task, 
  workspaceMembers,
  onClose, 
  onSave, 
  onDelete,
  onAssign,
  onComplete
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [deadline, setDeadline] = useState(task?.deadline ? new Date(task?.deadline) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  
  // Extract hashtags from title and description
  const extractTags = (text) => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    if (matches) {
      return matches.map(tag => tag.substring(1));
    }
    return [];
  };
  
  const titleTags = extractTags(title);
  const descriptionTags = extractTags(description);
  const allTags = [...new Set([...titleTags, ...descriptionTags])];
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      ...task,
      title,
      description,
      deadline: deadline ? deadline.toISOString() : null,
      tags: allTags
    });
    onClose();
  };
  
  const handleComplete = () => {
    onComplete(task.id);
    onClose();
  };
  
  const handleAssign = (memberId) => {
    onAssign(task.id, memberId);
    setShowAssignMenu(false);
  };
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };
  
  const formatDeadline = (date) => {
    if (!date) return 'No deadline';
    return date.toLocaleString();
  };
  
  const renderMemberItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.memberItem, 
        { 
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border,
          padding: theme.spacing.m,
          borderBottomWidth: 1
        }
      ]}
      onPress={() => handleAssign(item.userId)}
    >
      <Text style={[styles.memberName, { color: theme.colors.text, fontSize: theme.typography.fontSize.m }]}>
        {item.displayName || 'User'}
      </Text>
      {item.userId === task?.assignedTo && (
        <Icon name="check" size={18} color={theme.colors.success} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          { 
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius.m
          }
        ]}>
          <View style={[
            styles.modalHeader,
            {
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              padding: theme.spacing.m
            }
          ]}>
            <Text style={[
              styles.modalTitle, 
              { 
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.l,
                fontWeight: 'bold'
              }
            ]}>
              {task ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="x" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.modalBody, { padding: theme.spacing.m }]}>
            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
              maxLength={100}
              style={{ marginBottom: theme.spacing.m }}
            />
            
            <Input
              label="Note"
              value={description}
              onChangeText={setDescription}
              placeholder="Task description (optional)"
              multiline
              maxLength={300}
              style={{ marginBottom: theme.spacing.m }}
            />
            
            <Text style={[
              styles.sectionLabel, 
              { 
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.s,
                fontWeight: '500',
                marginBottom: theme.spacing.xs
              }
            ]}>
              Deadline
            </Text>
            <TouchableOpacity 
              style={[
                styles.deadlineSelector,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: theme.spacing.m,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.s,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  marginBottom: theme.spacing.m
                }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.m }}>
                {deadline ? formatDeadline(deadline) : 'Set deadline (optional)'}
              </Text>
              <Icon name="calendar" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={deadline || new Date()}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            )}
            
            {task && (
              <View style={[
                styles.assignSection,
                {
                  marginBottom: theme.spacing.m
                }
              ]}>
                <Text style={[
                  styles.sectionLabel, 
                  { 
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.s,
                    fontWeight: '500',
                    marginBottom: theme.spacing.xs
                  }
                ]}>
                  Assignment
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.assignButton,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: theme.spacing.m,
                      backgroundColor: theme.colors.card,
                      borderRadius: theme.borderRadius.s,
                      borderWidth: 1,
                      borderColor: theme.colors.border
                    }
                  ]}
                  onPress={() => setShowAssignMenu(true)}
                >
                  <Text style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.m }}>
                    {task.assignedToName ? `Assigned to: ${task.assignedToName}` : 'Assign to someone'}
                  </Text>
                  <Icon name="user-plus" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            {allTags.length > 0 && (
              <View style={styles.tagsSection}>
                <Text style={[
                  styles.sectionLabel, 
                  { 
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.s,
                    fontWeight: '500',
                    marginBottom: theme.spacing.xs
                  }
                ]}>
                  Tags
                </Text>
                <View style={styles.tagsContainer}>
                  {allTags.map((tag, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: theme.colors.primary + '20',
                          borderRadius: theme.borderRadius.s,
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          marginRight: 8,
                          marginBottom: 8
                        }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.tagText,
                          {
                            color: theme.colors.primary,
                            fontSize: theme.typography.fontSize.s,
                            fontWeight: '500'
                          }
                        ]}
                      >
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={[
                  styles.tagHint,
                  {
                    color: theme.colors.secondary,
                    fontSize: theme.typography.fontSize.xs,
                    marginTop: theme.spacing.xs
                  }
                ]}>
                  Add tags using # in title or description
                </Text>
              </View>
            )}
          </View>
          
          <View style={[
            styles.modalFooter,
            {
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              padding: theme.spacing.m
            }
          ]}>
            {task && (
              <View style={[styles.actionButtons, { marginBottom: theme.spacing.m }]}>
                <Button
                  title="Delete"
                  onPress={() => onDelete(task.id)}
                  type="danger"
                  style={{ marginRight: theme.spacing.s, flex: 1 }}
                />
                {!task.completed && (
                  <Button
                    title="Complete"
                    onPress={handleComplete}
                    type="success"
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            )}
            <Button
              title="Save"
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
      
      <Modal
        visible={showAssignMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAssignMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.assignModal, 
            { 
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.m
            }
          ]}>
            <View style={[
              styles.modalHeader,
              {
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                padding: theme.spacing.m
              }
            ]}>
              <Text style={[
                styles.modalTitle, 
                { 
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.l,
                  fontWeight: 'bold'
                }
              ]}>
                Assign Task
              </Text>
              <TouchableOpacity onPress={() => setShowAssignMenu(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="x" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={workspaceMembers}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.userId}
              ListHeaderComponent={
                <TouchableOpacity 
                  style={[
                    styles.memberItem, 
                    { 
                      backgroundColor: theme.colors.card,
                      borderBottomColor: theme.colors.border,
                      padding: theme.spacing.m,
                      borderBottomWidth: 1
                    }
                  ]}
                  onPress={() => handleAssign(null)}
                >
                  <Text style={[styles.memberName, { color: theme.colors.text, fontSize: theme.typography.fontSize.m }]}>
                    Unassign
                  </Text>
                  {!task?.assignedTo && (
                    <Icon name="check" size={18} color={theme.colors.success} />
                  )}
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalFooter: {
  },
  actionButtons: {
    flexDirection: 'row',
  },
  assignModal: {
    width: '100%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
});

export default TaskDetailModal;
