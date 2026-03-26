import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/textField';
import { TextArea } from '@/components/textArea';
import { ThemedText } from '@/components/templateComponents/themed-text';
import { ThemedView } from '@/components/templateComponents/themed-view';
import { useCreateToDo } from '@/hooks/createToDo';
import { useGetLocalToDoList } from '@/hooks/getLocalToDoList';
import { useToDoUIState } from '@/stores/toDoUIState';

export default function ToDoScreen() {
  const insets = useSafeAreaInsets();
  const { createToDo } = useCreateToDo();
  const { getToDoList } = useGetLocalToDoList();

  const title = useToDoUIState((s) => s.title);
  const details = useToDoUIState((s) => s.details);
  const error = useToDoUIState((s) => s.error);
  const successMessage = useToDoUIState((s) => s.successMessage);
  const setTitle = useToDoUIState((s) => s.setTitle);
  const setDetails = useToDoUIState((s) => s.setDetails);
  const setError = useToDoUIState((s) => s.setError);
  const setSuccessMessage = useToDoUIState((s) => s.setSuccessMessage);
  const reset = useToDoUIState((s) => s.reset);

  useEffect(() => {
    void getToDoList();
  }, [getToDoList]);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please enter a title.');
      setSuccessMessage(null);
      return;
    }

    const createdTodo = await createToDo(title, details);

    if (!createdTodo) {
      setError('Unable to create your to-do right now.');
      setSuccessMessage(null);
      return;
    }

    reset();
    setSuccessMessage(`"${createdTodo.title}" was added to your list.`);
    Alert.alert('To-Do Created', 'Your new activity has been added successfully.');
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16) + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 92,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title">To-Do</ThemedText>
          <ThemedText style={styles.subtitle}>
            Create To-Do Tasks.
          </ThemedText>
        </View>

        <Card
          title="Create New To-Do"
          subtitle="Write down the next task you want to track."
          footer={
            successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null
          }
        >
          <TextField
            label="Title"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              if (error) {
                setError(null);
              }
              if (successMessage) {
                setSuccessMessage(null);
              }
            }}
            placeholder="Enter task title"
            maxLength={80}
          />

          <TextArea
            label="Details"
            value={details}
            onChangeText={(value) => {
              setDetails(value);
              if (error) {
                setError(null);
              }
              if (successMessage) {
                setSuccessMessage(null);
              }
            }}
            placeholder="Example: Prepare the presentation slides for tomorrow's meeting."
            error={error}
            maxLength={240}
          />

          <Button title="Create To-Do" onPress={() => void handleCreate()} />
        </Card>

        <Card title="Quick Notes" subtitle="A few ideas for writing clearer tasks.">
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <ThemedText style={styles.tipText}>Start with an action word so the task is easier to scan.</ThemedText>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <ThemedText style={styles.tipText}>Keep each to-do focused on one outcome instead of multiple steps.</ThemedText>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <ThemedText style={styles.tipText}>Use this screen to quickly add items before organizing them later.</ThemedText>
          </View>
        </Card>
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
  subtitle: {
    opacity: 0.7,
    lineHeight: 22,
  },
  successText: {
    color: '#15803D',
    fontWeight: '600',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    backgroundColor: '#2563EB',
  },
  tipText: {
    flex: 1,
    lineHeight: 22,
  },
});
