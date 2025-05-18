import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/Button';
import ChecklistItem from '../components/ChecklistItem';
import TaskDetailModal from '../components/TaskDetailModal';

// Mock data for testing
const mockTasks = [
  {
    id: '1',
    title: 'Complete app design',
    description: 'Finalize the UI/UX design for the collaborative todo app',
    completed: false,
    assignedTo: 'user1',
    assignedToName: 'John Doe'
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Add Google and email authentication',
    completed: true,
    assignedTo: 'user2',
    assignedToName: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Test collaboration features',
    description: 'Ensure real-time updates work correctly',
    completed: false,
    assignedTo: null,
    assignedToName: null
  }
];

const mockMembers = [
  { userId: 'user1', displayName: 'John Doe', role: 'admin' },
  { userId: 'user2', displayName: 'Jane Smith', role: 'member' },
  { userId: 'user3', displayName: 'Bob Johnson', role: 'member' }
];

const TestScreen = () => {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setModalVisible(true);
  };

  const handleSaveTask = (task) => {
    if (task.id) {
      // Update existing task
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      // Add new task
      const newTask = {
        ...task,
        id: Date.now().toString(),
        completed: false,
        assignedTo: null,
        assignedToName: null
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAssignTask = (taskId, userId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const assignedMember = userId ? mockMembers.find(m => m.userId === userId) : null;
        return {
          ...task,
          assignedTo: userId,
          assignedToName: assignedMember ? assignedMember.displayName : null
        };
      }
      return task;
    }));
  };

  const renderItem = ({ item }) => (
    <ChecklistItem
      title={item.title}
      completed={item.completed}
      assignedTo={item.assignedToName}
      onToggle={() => handleTaskToggle(item.id)}
      onPress={() => handleTaskPress(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Test Mode</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading tasks...
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Test Tasks
              </Text>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
                  No tasks available. Add a task to get started!
                </Text>
              </View>
            }
          />
          
          <View style={styles.footer}>
            <Button 
              title="Add Test Task" 
              onPress={handleAddTask} 
              style={styles.addButton}
            />
          </View>
          
          <TaskDetailModal
            visible={modalVisible}
            task={selectedTask}
            workspaceMembers={mockMembers}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            onAssign={handleAssignTask}
            onComplete={handleTaskToggle}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    marginBottom: 0,
  },
});

export default TestScreen;
