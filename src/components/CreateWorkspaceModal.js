import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import Icon from 'react-native-vector-icons/Feather';

// New CreateWorkspaceModal with workspace type selection
const CreateWorkspaceModal = ({ 
  visible, 
  onClose, 
  onCreateWorkspace
}) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [type, setType] = useState('personal'); // 'personal', 'couple', or 'family'
  const [error, setError] = useState(null);
  
  const handleCreate = () => {
    if (!name.trim()) {
      setError('Please enter a workspace name');
      return;
    }
    
    onCreateWorkspace({
      name: name.trim(),
      type
    });
    
    // Reset form
    setName('');
    setType('personal');
    setError(null);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[
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
              Create New Workspace
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="x" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={[styles.modalBody, { padding: theme.spacing.m }]}>
            <Input
              label="Workspace Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter workspace name"
              error={error}
              style={{ marginBottom: theme.spacing.l }}
            />
            
            <Text style={[
              styles.sectionLabel, 
              { 
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.m,
                fontWeight: '500',
                marginBottom: theme.spacing.m
              }
            ]}>
              Workspace Type
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.typeOption,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: theme.spacing.m,
                  backgroundColor: type === 'personal' ? theme.colors.personal + '40' : theme.colors.card,
                  borderRadius: theme.borderRadius.m,
                  borderWidth: 1,
                  borderColor: type === 'personal' ? theme.colors.personal : theme.colors.border,
                  marginBottom: theme.spacing.m
                }
              ]}
              onPress={() => setType('personal')}
            >
              <View style={[
                styles.typeIcon,
                {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.personal,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: theme.spacing.m
                }
              ]}>
                <Icon name="user" size={20} color={theme.colors.text} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={[
                  styles.typeName,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.m,
                    fontWeight: '600',
                    marginBottom: 4
                  }
                ]}>
                  Personal
                </Text>
                <Text style={[
                  styles.typeDescription,
                  {
                    color: theme.colors.secondary,
                    fontSize: theme.typography.fontSize.s
                  }
                ]}>
                  Individual task management without collaboration
                </Text>
              </View>
              {type === 'personal' && (
                <Icon name="check-circle" size={24} color={theme.colors.success} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.typeOption,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: theme.spacing.m,
                  backgroundColor: type === 'couple' ? theme.colors.couple + '40' : theme.colors.card,
                  borderRadius: theme.borderRadius.m,
                  borderWidth: 1,
                  borderColor: type === 'couple' ? theme.colors.couple : theme.colors.border,
                  marginBottom: theme.spacing.m
                }
              ]}
              onPress={() => setType('couple')}
            >
              <View style={[
                styles.typeIcon,
                {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.couple,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: theme.spacing.m
                }
              ]}>
                <Icon name="users" size={20} color={theme.colors.text} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={[
                  styles.typeName,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.m,
                    fontWeight: '600',
                    marginBottom: 4
                  }
                ]}>
                  Couple
                </Text>
                <Text style={[
                  styles.typeDescription,
                  {
                    color: theme.colors.secondary,
                    fontSize: theme.typography.fontSize.s
                  }
                ]}>
                  Two-person collaboration for partners
                </Text>
              </View>
              {type === 'couple' && (
                <Icon name="check-circle" size={24} color={theme.colors.success} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.typeOption,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: theme.spacing.m,
                  backgroundColor: type === 'family' ? theme.colors.family + '40' : theme.colors.card,
                  borderRadius: theme.borderRadius.m,
                  borderWidth: 1,
                  borderColor: type === 'family' ? theme.colors.family : theme.colors.border,
                  marginBottom: theme.spacing.m
                }
              ]}
              onPress={() => setType('family')}
            >
              <View style={[
                styles.typeIcon,
                {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.family,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: theme.spacing.m
                }
              ]}>
                <Icon name="home" size={20} color={theme.colors.text} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={[
                  styles.typeName,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.m,
                    fontWeight: '600',
                    marginBottom: 4
                  }
                ]}>
                  Family
                </Text>
                <Text style={[
                  styles.typeDescription,
                  {
                    color: theme.colors.secondary,
                    fontSize: theme.typography.fontSize.s
                  }
                ]}>
                  Multi-member household task management (up to 20 members)
                </Text>
              </View>
              {type === 'family' && (
                <Icon name="check-circle" size={24} color={theme.colors.success} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          </ScrollView>
          
          <View style={[
            styles.modalFooter,
            {
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              padding: theme.spacing.m
            }
          ]}>
            <Button
              title="Create Workspace"
              onPress={handleCreate}
            />
          </View>
        </SafeAreaView>
      </View>
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
  modalFooter: {
  },
});

export default CreateWorkspaceModal;
