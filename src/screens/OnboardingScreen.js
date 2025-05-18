import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';

const OnboardingScreen = ({ onComplete }) => {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!workspaceName.trim()) {
        Alert.alert('Error', 'Please enter a workspace name');
        return;
      }
      setStep(2);
    } else {
      // Process invites if any
      const emails = inviteEmails.split(',').map(email => email.trim()).filter(email => email);
      
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onComplete({
          workspaceName,
          invitedUsers: emails
        });
      }, 1000);
    }
  };

  const handleSkip = () => {
    if (step === 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onComplete({
          workspaceName,
          invitedUsers: []
        });
      }, 1000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.stepIndicator}>
        <View 
          style={[
            styles.stepDot, 
            { 
              backgroundColor: colors.primary,
              opacity: step === 1 ? 1 : 0.5
            }
          ]} 
        />
        <View 
          style={[
            styles.stepLine, 
            { backgroundColor: colors.border }
          ]} 
        />
        <View 
          style={[
            styles.stepDot, 
            { 
              backgroundColor: colors.primary,
              opacity: step === 2 ? 1 : 0.5
            }
          ]} 
        />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 ? (
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Name your workspace
            </Text>
            <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
              This will be your default workspace. You can create more later.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Workspace Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.card
                  }
                ]}
                value={workspaceName}
                onChangeText={setWorkspaceName}
                placeholder="Enter workspace name"
                placeholderTextColor={colors.text + '50'}
              />
            </View>
          </View>
        ) : (
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Invite collaborators
            </Text>
            <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
              Add people to collaborate with you in "{workspaceName}".
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email Addresses</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.card
                  }
                ]}
                value={inviteEmails}
                onChangeText={setInviteEmails}
                placeholder="Enter email addresses separated by commas"
                placeholderTextColor={colors.text + '50'}
                multiline
                textAlignVertical="top"
              />
              <Text style={[styles.helperText, { color: colors.text + '70' }]}>
                You can skip this step and invite people later.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        {step === 2 && (
          <Button
            title="Skip"
            onPress={handleSkip}
            type="secondary"
            style={styles.skipButton}
            disabled={isLoading}
          />
        )}
        <Button
          title={step === 1 ? "Next" : "Complete Setup"}
          onPress={handleNext}
          disabled={isLoading}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    height: 2,
    width: 40,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 120,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  skipButton: {
    flex: 1,
    marginRight: 12,
  },
  nextButton: {
    flex: 1,
  },
});

export default OnboardingScreen;
