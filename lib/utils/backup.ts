import { useLearningStore } from "@/lib/store/learnings";
import { useTodoStore } from "@/lib/store/todos";
import { useAttendanceStore } from "@/lib/store/attendance";

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    learnings: any;
    todos: any;
    attendance: any;
  };
}

export const exportData = (): BackupData => {
  const learnings = useLearningStore.getState();
  const todos = useTodoStore.getState();
  const attendance = useAttendanceStore.getState();

  return {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    data: {
      learnings: {
        learnings: learnings.learnings,
      },
      todos: {
        todos: todos.todos,
      },
      attendance: {
        records: attendance.records,
        allowedAbsences: attendance.allowedAbsences,
      },
    },
  };
};

export const downloadBackup = () => {
  const backup = exportData();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `second-semester-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (backupData: BackupData): { success: boolean; error?: string } => {
  try {
    // 버전 체크
    if (!backupData.version) {
      return { success: false, error: "잘못된 백업 파일 형식입니다." };
    }

    // 데이터 복구
    if (backupData.data.learnings) {
      const learningStore = useLearningStore.getState();
      if (backupData.data.learnings.learnings) {
        useLearningStore.setState({ learnings: backupData.data.learnings.learnings });
      }
    }

    if (backupData.data.todos) {
      if (backupData.data.todos.todos) {
        useTodoStore.setState({ todos: backupData.data.todos.todos });
      }
    }

    if (backupData.data.attendance) {
      const updates: any = {};
      if (backupData.data.attendance.records) {
        updates.records = backupData.data.attendance.records;
      }
      if (backupData.data.attendance.allowedAbsences !== undefined) {
        updates.allowedAbsences = backupData.data.attendance.allowedAbsences;
      }
      useAttendanceStore.setState(updates);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "데이터 복구 중 오류가 발생했습니다." };
  }
};

export const uploadBackup = (file: File): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData: BackupData = JSON.parse(content);
        const result = importData(backupData);
        resolve(result);
      } catch (error) {
        resolve({ success: false, error: "파일을 읽을 수 없습니다." });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: "파일 읽기 중 오류가 발생했습니다." });
    };

    reader.readAsText(file);
  });
};
