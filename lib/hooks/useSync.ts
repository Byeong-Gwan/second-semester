"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useCallback } from "react";
import { useTodoStore } from "@/lib/store/todos";
import { useLearningStore } from "@/lib/store/learnings";
import { useAttendanceStore } from "@/lib/store/attendance";
import { useReflectionStore } from "@/lib/store/reflection";
import { useStudyLogStore } from "@/lib/store/studyLog";
import { useTimelineStore } from "@/lib/store/timeline";

// DB → Zustand: 로그인 시 서버 데이터를 로컬 스토어에 로드
async function loadFromServer(): Promise<boolean> {
  try {
    const res = await fetch("/api/user-data");
    if (!res.ok) return false;
    const { data } = await res.json();
    if (!data) return false;

    // learnings
    if (data.learnings?.length > 0) {
      const items = data.learnings.map((r: any) => ({
        id: r.id,
        title: r.title,
        createdAt: r.created_at,
        startDate: r.start_date,
        endDate: r.end_date,
        progress: r.progress,
        joined: r.joined,
      }));
      useLearningStore.setState({ learnings: items });
    }

    // todos
    if (data.todos?.length > 0) {
      const items = data.todos.map((r: any) => ({
        id: r.id,
        title: r.title,
        completed: r.completed,
        createdAt: r.created_at,
        dueDate: r.due_date,
        priority: r.priority,
      }));
      useTodoStore.setState({ todos: items });
    }

    // attendance
    if (data.attendance?.length > 0) {
      const items = data.attendance.map((r: any) => ({
        date: r.date,
        status: r.status,
      }));
      useAttendanceStore.setState({ records: items });
    }

    // reflections
    if (data.reflections?.length > 0) {
      const items = data.reflections.map((r: any) => ({
        id: r.id,
        date: r.date,
        content: r.content,
        category: r.category,
        mood: r.mood,
        tags: r.tags || [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
      useReflectionStore.setState({ reflections: items });
    }

    // study_logs
    if (data.study_logs?.length > 0) {
      const items = data.study_logs.map((r: any) => ({
        id: r.id,
        date: r.date,
        startTime: r.start_time?.slice(0, 5),
        endTime: r.end_time?.slice(0, 5),
        subject: r.subject,
        description: r.description,
        duration: r.duration,
      }));
      useStudyLogStore.setState({ logs: items });
    }

    // timeline
    if (data.timeline?.length > 0) {
      const items = data.timeline.map((r: any) => ({
        id: r.id,
        date: r.date,
        start: r.start_time?.slice(0, 5),
        end: r.end_time?.slice(0, 5),
        title: r.title,
        type: r.type,
        done: r.done,
      }));
      useTimelineStore.setState({ items });
    }

    return true;
  } catch {
    return false;
  }
}

// Zustand → DB: 로컬 스토어 데이터를 서버에 저장
async function saveToServer(table: string, items: any[]) {
  try {
    await fetch("/api/user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, items }),
    });
  } catch {
    // 실패 시 무시 (다음 동기화에서 재시도)
  }
}

// 스토어 → DB 형식 변환
function learningsToDb(learnings: any[]) {
  return learnings.map((l) => ({
    id: l.id,
    title: l.title,
    created_at: l.createdAt,
    start_date: l.startDate || null,
    end_date: l.endDate || null,
    progress: l.progress,
    joined: l.joined,
  }));
}

function todosToDb(todos: any[]) {
  return todos.map((t) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    created_at: t.createdAt,
    due_date: t.dueDate || null,
    priority: t.priority,
  }));
}

function attendanceToDb(records: any[]) {
  return records.map((r, i) => ({
    id: `att_${r.date}`,
    date: r.date,
    status: r.status,
  }));
}

function reflectionsToDb(reflections: any[]) {
  return reflections.map((r) => ({
    id: r.id,
    date: r.date,
    content: r.content,
    category: r.category,
    mood: r.mood || null,
    tags: r.tags || [],
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  }));
}

function studyLogsToDb(logs: any[]) {
  return logs.map((l) => ({
    id: l.id,
    date: l.date,
    start_time: l.startTime,
    end_time: l.endTime,
    subject: l.subject,
    description: l.description || null,
    duration: l.duration,
  }));
}

function timelineToDb(items: any[]) {
  return items.map((t) => ({
    id: t.id,
    date: t.date,
    start_time: t.start,
    end_time: t.end,
    title: t.title,
    type: t.type,
    done: t.done || false,
  }));
}

export function useSync() {
  const { data: session, status } = useSession();
  const loaded = useRef(false);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // 디바운스된 저장 (500ms 후 실행)
  const debouncedSave = useCallback((table: string, items: any[]) => {
    if (debounceTimers.current[table]) {
      clearTimeout(debounceTimers.current[table]);
    }
    debounceTimers.current[table] = setTimeout(() => {
      saveToServer(table, items);
    }, 500);
  }, []);

  // 로그인 시 서버에서 데이터 로드
  useEffect(() => {
    if (status === "authenticated" && !loaded.current) {
      loaded.current = true;
      loadFromServer();
    }
  }, [status]);

  // 스토어 변경 감지 → DB 동기화
  useEffect(() => {
    if (status !== "authenticated") return;

    const unsubs = [
      useLearningStore.subscribe((state) => {
        debouncedSave("learnings", learningsToDb(state.learnings));
      }),
      useTodoStore.subscribe((state) => {
        debouncedSave("todos", todosToDb(state.todos));
      }),
      useAttendanceStore.subscribe((state) => {
        debouncedSave("attendance", attendanceToDb(state.records));
      }),
      useReflectionStore.subscribe((state) => {
        debouncedSave("reflections", reflectionsToDb(state.reflections));
      }),
      useStudyLogStore.subscribe((state) => {
        debouncedSave("study_logs", studyLogsToDb(state.logs));
      }),
      useTimelineStore.subscribe((state) => {
        debouncedSave("timeline", timelineToDb(state.items));
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [status, debouncedSave]);
}
