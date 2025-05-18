import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import Icon from 'react-native-vector-icons/Feather';

// New InviteMembersModal component for workspace collaboration
const InviteMembersModal = ({ 
  visible, 
  onClose, 
  onInviteMembers,
  workspaceType,
  currentMemberCount = 0
}) => {
  const theme = useTheme();
  const [emails, setEmails] = useState('');
  const [error, setError] = useState(null);
  
  // Get max members based on workspace type
  const getMaxMembers = () => {
    switch(workspaceType) {
      case 'couple':
        return 2;
      case 'family':
        return 20;
      case 'personal':
      default:
        return 1;
    }
  };
  
  const maxMembers = getMaxMembers();
  const remainingSlots = maxMembers - currentMemberCount;
  
  const handleInvite = () => {
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }
    
    // Parse email addresses
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }
    
    // Check if adding these members would exceed the limit
    if (emailList.length > remainingSlots) {
      setError(`You can only invite ${remainingSlots} more member${remainingSlots !== 1 ? 's' : ''} to this workspace`);
      return;
    }
    
    onInviteMembers(emailList);
    
    // Reset form
    setEmails('');
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
              Invite Members
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="x" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={[styles.modalBody, { padding: theme.spacing.m }]}>
            <View style={[
              styles.workspaceInfo,
              {
                backgroundColor: theme.colors[workspaceType] + '20',
                borderRadius: theme.borderRadius.m,
                padding: theme.spacing.m,
                marginBottom: theme.spacing.m
              }
            ]}>
              <Text style={[
                styles.workspaceType,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.m,
                  fontWeight: '600',
                  marginBottom: 4
                }
              ]}>
                {workspaceType.charAt(0).toUpperCase() + workspaceType.slice(1)} Workspace
              </Text>
              <Text style={[
                styles.memberLimit,
                {
                  color: theme.colors.secondary,
                  fontSize: theme.typography.fontSize.s
                }
              ]}>
                {currentMemberCount} of {maxMembers} members
              </Text>
              {remainingSlots > 0 ? (
                <Text style={[
                  styles.remainingSlots,
                  {
                    color: theme.colors.secondary,
                    fontSize: theme.typography.fontSize.s,
                    marginTop: theme.spacing.s
                  }
                ]}>
                  You can invite {remainingSlots} more member{remainingSlots !== 1 ? 's' : ''}
                </Text>
              ) : (
                <Text style={[
                  styles.remainingSlots,
                  {
                    color: theme.colors.notification,
                    fontSize: theme.typography.fontSize.s,
                    marginTop: theme.spacing.s
                  }
                ]}>
                  This workspace has reached its member limit
                </Text>
              )}
            </View>
            
            {remainingSlots > 0 ? (
              <>
                <Text style={[
                  styles.sectionLabel, 
                  { 
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.m,
                    fontWeight: '500',
                    marginBottom: theme.spacing.s
                  }
                ]}>
                  Email Addresses
                </Text>
                
                <Input
                  value={emails}
                  onChangeText={setEmails}
                  placeholder="Enter email addresses separated by commas"
                  multiline
                  error={error}
                  style={{ marginBottom: theme.spacing.m }}
                />
                
                <Text style={[
                  styles.helperText,
                  {
                    color: theme.colors.secondary,
                    fontSize: theme.typography.fontSize.xs
                  }
                ]}>
                  Invited members will receive an email with instructions to join this workspace.
                </Text>
              </>
            ) : null}
          </ScrollView>
          
          <View style={[
            styles.modalFooter,
            {
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              padding: theme.spacing.m
            }
          ]}>
            {remainingSlots > 0 ? (
              <Button
                title="Send Invitations"
                onPress={handleInvite}
              />
            ) : (
              <Button
                title="Close"
                onPress={onClose}
                type="secondary"
              />
            )}
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

export default InviteMembersModal;
