import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextArea } from '@/components/textArea';
import { TextField } from '@/components/textField';
import { ThemedText } from '@/components/templateComponents/themed-text';
import { ThemedView } from '@/components/templateComponents/themed-view';
import { useGetLocalToDoList } from '@/hooks/getLocalToDoList';
import { useManageLocalToDo } from '@/hooks/manageLocalToDo';
import { useToDoListUIState } from '@/stores/toDoListUIState';

export default function ToDoListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { localTodoList, getToDoList } = useGetLocalToDoList();
  const { saveLocalTodo, archiveLocalTodo } = useManageLocalToDo();
  const selectedTodoId = useToDoListUIState((s) => s.selectedTodoId);
  const editTitle = useToDoListUIState((s) => s.editTitle);
  const editDetails = useToDoListUIState((s) => s.editDetails);
  const editCompleted = useToDoListUIState((s) => s.editCompleted);
  const searchQuery = useToDoListUIState((s) => s.searchQuery);
  const statusFilter = useToDoListUIState((s) => s.statusFilter);
  const openEditor = useToDoListUIState((s) => s.openEditor);
  const closeEditor = useToDoListUIState((s) => s.closeEditor);
  const setEditTitle = useToDoListUIState((s) => s.setEditTitle);
  const setEditDetails = useToDoListUIState((s) => s.setEditDetails);
  const setEditCompleted = useToDoListUIState((s) => s.setEditCompleted);
  const setSearchQuery = useToDoListUIState((s) => s.setSearchQuery);
  const setStatusFilter = useToDoListUIState((s) => s.setStatusFilter);

  useEffect(() => {
    void getToDoList();
  }, [getToDoList]);

  const handleSave = async () => {
    if (!selectedTodoId) {
      return;
    }

    if (!editTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title before saving.');
      return;
    }

    await saveLocalTodo({
      id: selectedTodoId,
      title: editTitle.trim(),
      details: editDetails.trim(),
      completed: editCompleted,
    });
    closeEditor();
    Alert.alert('To-Do Updated', 'Your changes were saved.');
  };

  const handleHide = async (id: number) => {
    await archiveLocalTodo(id);
    if (selectedTodoId === id) {
      closeEditor();
    }
    Alert.alert('To-Do Hidden', 'The task was hidden from the list.');
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTodoList = localTodoList.filter((item) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.details.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'todo' && !item.completed) ||
      (statusFilter === 'complete' && item.completed);

    return matchesSearch && matchesStatus;
  });

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16) + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <ThemedText type="title">To-Do List</ThemedText>
              <ThemedText style={styles.subtitle}>
                View and manage your locally created to-do items.
              </ThemedText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close to-do list"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.closeButton, pressed ? styles.iconPressed : null]}
            >
              <MaterialIcons name="close" size={22} color="#1F2937" />
            </Pressable>
          </View>
        </View>

        <TextField
          label="Search Tasks"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title or details"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.filterRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setStatusFilter('all')}
            style={[styles.filterChip, statusFilter === 'all' ? styles.filterChipActive : null]}
          >
            <ThemedText style={statusFilter === 'all' ? styles.filterChipTextActive : undefined}>
              All
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setStatusFilter('todo')}
            style={[styles.filterChip, statusFilter === 'todo' ? styles.filterChipActiveTodo : null]}
          >
            <ThemedText style={statusFilter === 'todo' ? styles.filterChipTextActive : undefined}>
              To-Do
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setStatusFilter('complete')}
            style={[
              styles.filterChip,
              statusFilter === 'complete' ? styles.filterChipActiveComplete : null,
            ]}
          >
            <ThemedText style={statusFilter === 'complete' ? styles.filterChipTextActive : undefined}>
              Complete
            </ThemedText>
          </Pressable>
        </View>

        {filteredTodoList.length === 0 ? (
          <Card title="Activities" subtitle="Your local to-do cards will appear here.">
            <ThemedText style={styles.emptyText}>
              {localTodoList.length === 0
                ? 'No visible to-do items yet.'
                : 'No tasks matched your current search or filter.'}
            </ThemedText>
          </Card>
        ) : null}

        {filteredTodoList.map((item) => {
          const isSelected = selectedTodoId === item.id;

          return (
            <Card
              key={item.id}
              title={item.title}
              subtitle={`Status: ${item.completed ? 'Complete' : 'To-Do'}`}
              footer={
                <ThemedText style={styles.createdAtText}>
                  Created {new Date(item.createdAt).toLocaleString()}
                </ThemedText>
              }
            >
              <ThemedText numberOfLines={isSelected ? undefined : 2} style={styles.detailsPreview}>
                {item.details || 'No details provided.'}
              </ThemedText>

              <View style={styles.actionRow}>
                <Button title="View Task" onPress={() => openEditor(item)} style={styles.flexButton} />
                <Button title="Delete" onPress={() => void handleHide(item.id)} style={styles.hideButton} />
              </View>

              {isSelected ? (
                <View style={styles.editorSection}>
                  <TextField
                    label="Title"
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholder="Enter task title"
                    maxLength={80}
                  />

                  <TextArea
                    label="Task Details"
                    value={editDetails}
                    onChangeText={setEditDetails}
                    placeholder="Add task details"
                    maxLength={240}
                  />

                  <View style={styles.statusRow}>
                    <ThemedText type="defaultSemiBold">Status</ThemedText>
                    <View style={styles.statusButtonRow}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setEditCompleted(false)}
                        style={[
                          styles.statusButton,
                          !editCompleted ? styles.statusButtonActiveTodo : null,
                        ]}
                      >
                        <ThemedText style={!editCompleted ? styles.statusButtonTextActive : undefined}>
                          To-Do
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setEditCompleted(true)}
                        style={[
                          styles.statusButton,
                          editCompleted ? styles.statusButtonActiveComplete : null,
                        ]}
                      >
                        <ThemedText style={editCompleted ? styles.statusButtonTextActive : undefined}>
                          Complete
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.editorActions}>
                    <Button title="Save Changes" onPress={() => void handleSave()} style={styles.flexButton} />
                    <Button title="Close" onPress={closeEditor} style={styles.secondaryButton} />
                  </View>
                </View>
              ) : null}
            </Card>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  subtitle: {
    opacity: 0.72,
    lineHeight: 22,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120,120,120,0.22)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: 'rgba(59,130,246,0.14)',
    borderColor: '#3B82F6',
  },
  filterChipActiveTodo: {
    backgroundColor: 'rgba(245,158,11,0.16)',
    borderColor: '#F59E0B',
  },
  filterChipActiveComplete: {
    backgroundColor: 'rgba(34,197,94,0.16)',
    borderColor: '#22C55E',
  },
  filterChipTextActive: {
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31,41,55,0.08)',
  },
  iconPressed: {
    opacity: 0.7,
  },
  emptyText: {
    opacity: 0.7,
    paddingVertical: 12,
  },
  detailsPreview: {
    opacity: 0.78,
    lineHeight: 22,
  },
  createdAtText: {
    opacity: 0.65,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  flexButton: {
    flex: 1,
  },
  hideButton: {
    minWidth: 96,
    backgroundColor: '#DC2626',
  },
  editorSection: {
    gap: 14,
    paddingTop: 6,
  },
  statusRow: {
    gap: 10,
  },
  statusButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120,120,120,0.25)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonActiveTodo: {
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderColor: '#F59E0B',
  },
  statusButtonActiveComplete: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: '#22C55E',
  },
  statusButtonTextActive: {
    fontWeight: '700',
  },
  editorActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    minWidth: 96,
    backgroundColor: '#6B7280',
  },
});
