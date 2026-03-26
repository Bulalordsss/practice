import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/templateComponents/themed-text';
import { ThemedView } from '@/components/templateComponents/themed-view';
import { useGetTodoList } from '@/hooks/getTodoList';
import { useLoginStoreData } from '@/stores/loginStoreData';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useLoginStoreData((s) => s.user);
  const {
    todoList,
    totalCount,
    isLoading,
    isRefreshing,
    error,
    hasLoaded,
    getTodoList,
    refreshTodoList,
  } = useGetTodoList();

  useEffect(() => {
    if (!hasLoaded) {
      void getTodoList();
    }
  }, [getTodoList, hasLoaded]);

  const recentActivities = todoList.slice(0, 5);
  const pendingCount = todoList.filter((item) => !item.completed).length;
  const completedCount = todoList.filter((item) => item.completed).length;
  const avatarLabel = user?.username?.charAt(0).toUpperCase() || 'G';

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16) + 12,
            paddingBottom: Math.max(insets.bottom, 20) + 92,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshTodoList()} />
        }
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText type="defaultSemiBold" style={styles.avatarText}>
              {avatarLabel}
            </ThemedText>
          </View>

          <View style={styles.headerText}>
            <ThemedText style={styles.kicker}>Dashboard</ThemedText>
            <ThemedText type="title">Good day!</ThemedText>
            <ThemedText style={styles.subtext}>
              {user?.username ? `Welcome back, ${user.username}.` : 'Here is your task overview.'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Card
            title="To-Do"
            subtitle="Pending activities waiting for action"
            style={styles.summaryCard}
          >
            <ThemedText type="title">{pendingCount}</ThemedText>
          </Card>

          <Card
            title="Complete"
            subtitle="Activities that are already done"
            style={styles.summaryCard}
          >
            <ThemedText type="title">{completedCount}</ThemedText>
          </Card>
        </View>

        <Card title="Recent Activities" subtitle="Latest items from your to-do list">
          <ThemedText style={styles.paginationText}>
            Showing {todoList.length} of {totalCount || todoList.length} activities
          </ThemedText>

          {isLoading ? <ThemedText>Loading activities...</ThemedText> : null}
          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

          {!isLoading && !error && recentActivities.length === 0 ? (
            <ThemedText>No activities available yet.</ThemedText>
          ) : null}

          {!isLoading && !error
            ? recentActivities.map((item) => (
                <View key={item.id} style={styles.activityRow}>
                  <View style={[styles.statusDot, item.completed ? styles.statusDone : styles.statusTodo]} />
                  <View style={styles.activityCopy}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                    <ThemedText style={styles.activityMeta}>
                      {item.completed ? 'Completed' : 'To-Do'}
                    </ThemedText>
                  </View>
                </View>
              ))
            : null}

          <Button title="See All Activities" onPress={() => router.push('/screens/To-Do-List' as any)} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  kicker: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    opacity: 0.65,
  },
  subtext: {
    opacity: 0.72,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minHeight: 146,
    justifyContent: 'space-between',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  statusTodo: {
    backgroundColor: '#F59E0B',
  },
  statusDone: {
    backgroundColor: '#10B981',
  },
  activityCopy: {
    flex: 1,
    gap: 2,
  },
  activityMeta: {
    opacity: 0.65,
  },
  paginationText: {
    opacity: 0.65,
  },
  errorText: {
    color: '#D12C2C',
  },
});
